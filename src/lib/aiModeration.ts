/**
 * AI Content Moderation & Profanity Filtering Engine
 * Automatically analyzes, scores, and decides approval of customer reviews.
 */

export interface ModerationResult {
  isApproved: boolean; // true: auto-publish | false: hide and queue for admin review
  toxicityScore: number; // 0 (fully safe) to 1 (highly toxic)
  reason: string;
  flaggedKeywords: string[];
  moderatedBy: 'ai_gemini' | 'rule_engine' | 'rating_heuristic';
}

// 1. Vietnamese profanity, vulgar, abusive & scam keyword patterns (Unicode word boundaries: (?<!\p{L}) and (?!\p{L}))
export const PROFANITY_PATTERNS: RegExp[] = [
  // Common profanity & obfuscated variants (avoids false positives with common words: dù, dùng, sử dụng, dù sao...)
  /(?<!\p{L})(đ[ụùú]|d[ụú]|du\s*ma|đ[ụùú]\s*m[ẹa]|du\s*me)(?!\p{L})/iu,
  // Avoid false positive with "lon" (lon xi, lon sơn, lon nước) by matching only accented variants [ồòóõọôốồộ]
  /(?<!\p{L})(l[ồòóõọôốồộ]n|c[ặa]c|bu[ồo]i|b[òo]i|d[áa]i)(?!\p{L})/iu,
  /(?<!\p{L})(đ[ééeèẽ]o|d[ééeèẽ]o|deo|đek|đệt|đếch)(?!\p{L})/iu,
  /(?<!\p{L})(đ[iị]t|d[iị]t|đ[iị]t\s*m[ẹa]|dit\s*me|đ[iị]t\s*c[ụu])(?!\p{L})/iu,
  /(?<!\p{L})(đ[km]|d[km]|đcm|dcm|đmm|dmm|đcl|dcl|vcl|vkl|vcc|vl|clgt|cl|cđm|cdm)(?!\p{L})/iu,
  /(?<!\p{L})(m[ẹe]\s*m[àa]y|m[ẹe]\s*n[óo]|cha\s*m[àa]y|b[ốo]\s*m[àa]y)(?!\p{L})/iu,
  /(?<!\p{L})(ch[óo]\s*đ[ẻe]|ch[óo]\s*ch[ếe]t|s[úu]c\s*v[ậa]t|s[úu]c\s*sinh|kh[ốo]n\s*n[ạa]n)(?!\p{L})/iu,
  /(?<!\p{L})(m[ấa]t\s*d[ạa]y|đ[ốo]\s*ch[óo]|l[ũu]\s*ch[óo]|th[ằa]ng\s*ch[óo])(?!\p{L})/iu,
  // Defamation, scam, and severe insults
  /(?<!\p{L})(l[ừu][àa]\s*đ[ảa]o|gian\s*l[ậa]n|l[ừu]a\s*ti[ềe]n|[ăa]n\s*c[ướu][ớo]p|b[ọo]n\s*l[ừu]a)(?!\p{L})/iu,
  // Gambling & betting spam
  /(?<!\p{L})(t[àa]i\s*x[ỉi]u|kubet|thabet|nohu|n[ổo]\s*h[ũu]|game\s*b[àa]i|k[èe]o\s*b[óo]ng)(?!\p{L})/iu,
];

// Normalize text to catch obfuscation variants: "đ.ụ", "l_ồ_n", "d * m"
export function normalizeTextForProfanityCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[._\-*~@#$^&+=|/\\]/g, '') // Strip interleaved separator characters
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Internal rule-based engine check (0ms latency, highly reliable).
 */
export function checkLocalProfanity(text: string): { hasProfanity: boolean; matched: string[] } {
  const normalized = normalizeTextForProfanityCheck(text);
  const matched: string[] = [];

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text) || pattern.test(normalized)) {
      matched.push(pattern.source);
    }
  }

  return {
    hasProfanity: matched.length > 0,
    matched,
  };
}

/**
 * Call Google Gemini AI for contextual reading and safety scoring (if an API key is configured).
 */
async function checkWithGemini(
  content: string,
  authorName: string,
  rating: number,
  apiKey: string
): Promise<{ isSafe: boolean; toxicityScore: number; reason: string } | null> {
  try {
    const prompt = `Bạn là hệ thống kiểm duyệt nội dung (Content Moderation AI) cho website bán hàng Việt Nam.
Hãy phân tích bình luận của khách hàng dưới đây và đánh giá xem có chứa chửi thề, thô tục, bôi nhọ, xúc phạm, quấy rối hoặc lừa đảo không.

Thông tin bình luận:
- Người gửi: "${authorName}"
- Đánh giá: ${rating} / 5 sao
- Cảm nhận: "${content}"

YÊU CẦU TRẢ VỀ DUY NHẤT 1 ĐỐI TƯỢNG JSON (KHÔNG KÈM MARKDOWN HOẶC GIẢI THÍCH):
{
  "isSafe": true nếu nội dung lịch sự văn minh, false nếu có chửi thề/xúc phạm/thô tục,
  "toxicityScore": số thực từ 0.0 (hoàn toàn an toàn) đến 1.0 (rất độc hại/chửi thề nặng),
  "reason": "Giải thích ngắn gọn lý do bằng tiếng Việt"
}`;

    // 3.5s AbortSignal timeout guards against hangs on slow networks or Google overload
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3500),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return null;
    }

    return {
      isSafe: Boolean(parsed.isSafe),
      toxicityScore: Number(parsed.toxicityScore) || 0,
      reason: String(parsed.reason || 'AI kiểm duyệt thành công'),
    };
  } catch (err) {
    console.warn('[Gemini Moderation Notice]:', err);
    return null;
  }
}

/**
 * Main composite moderation function:
 * 1. Scan profanity & obfuscation via the regex rule engine.
 * 2. Call Gemini AI for contextual analysis (if a key is configured).
 * 3. Apply heuristics (1-2 star reviews with harsh wording go to the review queue).
 */
export async function moderateReviewContent(params: {
  authorName: string;
  content: string;
  rating: number;
}): Promise<ModerationResult> {
  const { authorName, content, rating } = params;
  const combinedText = `${authorName} ${content}`;

  // ── Step 1: Scan for profanity and vulgar language immediately ──
  const localCheck = checkLocalProfanity(combinedText);
  if (localCheck.hasProfanity) {
    return {
      isApproved: false, // Hide immediately and queue for review
      toxicityScore: 0.95,
      reason: 'Phát hiện từ ngữ thô tục, chửi thề hoặc lăng mạ trong nội dung.',
      flaggedKeywords: localCheck.matched,
      moderatedBy: 'rule_engine',
    };
  }

  // ── Step 2: Call Google Gemini AI if GEMINI_API_KEY is configured ──
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (geminiKey) {
    const aiResult = await checkWithGemini(content, authorName, rating, geminiKey);
    if (aiResult) {
      // Disapprove if AI flags it unsafe or toxicityScore >= 0.4
      const shouldApprove = aiResult.isSafe && aiResult.toxicityScore < 0.4;
      return {
        isApproved: shouldApprove,
        toxicityScore: aiResult.toxicityScore,
        reason: aiResult.reason,
        flaggedKeywords: [],
        moderatedBy: 'ai_gemini',
      };
    }
  }

  // ── Step 3: Heuristic rule - 1-2 star reviews containing strongly negative wording ──
  // Low ratings usually require shop review and customer support before publishing
  const harshWords = ['quá tệ', 'cực kỳ tệ', 'thất vọng', 'rất bực', 'không chấp nhận được', 'quá kém', 'hàng dỏm', 'bị hỏng', 'bị rách'];
  const hasHarshWords = harshWords.some((w) => content.toLowerCase().includes(w));

  if (rating <= 2 && hasHarshWords) {
    return {
      isApproved: false, // Queue for review so the shop can contact the customer first
      toxicityScore: 0.45,
      reason: 'Đánh giá điểm thấp có phản ánh tiêu cực mạnh. Đưa vào hàng chờ duyệt để hỗ trợ khách hàng trước khi hiển thị.',
      flaggedKeywords: harshWords.filter((w) => content.toLowerCase().includes(w)),
      moderatedBy: 'rating_heuristic',
    };
  }

  // Default: safe and valid -> auto-approve for immediate display
  return {
    isApproved: true,
    toxicityScore: 0.05,
    reason: 'Nội dung lịch sự, hợp lệ và an toàn.',
    flaggedKeywords: [],
    moderatedBy: 'rule_engine',
  };
}

