/**
 * AI Content Moderation & Profanity Filtering Engine
 * Tự động đọc hiểu, chấm điểm độc hại và quyết định phê duyệt bình luận khách hàng.
 */

export interface ModerationResult {
  isApproved: boolean; // true: Tự động hiển thị ngay | false: Ẩn và chờ Admin duyệt
  toxicityScore: number; // 0 (Hoàn toàn an toàn) đến 1 (Rất độc hại)
  reason: string;
  flaggedKeywords: string[];
  moderatedBy: 'ai_gemini' | 'rule_engine' | 'rating_heuristic';
}

// 1. Danh sách từ khóa chửi thề, thô tục, lăng mạ & lừa đảo tiếng Việt
const PROFANITY_PATTERNS: RegExp[] = [
  // Chửi bậy thông dụng & biến thể lách chữ
  /\b(đ[ụùú]|d[ụùú]|du\s*ma|đ[ụùú]\s*m[ẹa]|đ[ụùú]\s*m[ẹa]|du\s*me)\b/i,
  /\b(l[ồoòóõọôốồộ]n|c[ặa]c|bu[ồo]i|b[òo]i|d[áa]i)\b/i,
  /\b(đ[ééeèẽ]o|d[ééeèẽ]o|deo|đek|đệt|đếch)\b/i,
  /\b(đ[iị]t|d[iị]t|đ[iị]t\s*m[ẹa]|dit\s*me|đ[iị]t\s*c[ụu])\b/i,
  /\b(đ[km]|d[km]|đcm|dcm|đmm|dmm|đcl|dcl|vcl|vkl|vcc|vl|clgt|cl|cđm|cdm|vcl)\b/i,
  /\b(m[ẹe]\s*m[àa]y|m[ẹe]\s*n[óo]|cha\s*m[àa]y|b[ốo]\s*m[àa]y)\b/i,
  /\b(ch[óo]\s*đ[ẻe]|ch[óo]\s*ch[ếe]t|s[úu]c\s*v[ậa]t|s[úu]c\s*sinh|kh[ốo]n\s*n[ạa]n)\b/i,
  /\b(m[ấa]t\s*d[ạa]y|đ[ốo]\s*ch[óo]|l[ũu]\s*ch[óo]|th[ằa]ng\s*ch[óo])\b/i,
  // Bôi nhọ, lừa đảo, xúc phạm nặng
  /\b(l[ừu][àa]\s*đ[ảa]o|gian\s*l[ậa]n|l[ừu]a\s*ti[ềe]n|[ăa]n\s*c[ướu][ớo]p|b[ọo]n\s*l[ừu]a)\b/i,
  // Cờ bạc, cá độ rác
  /\b(t[àa]i\s*x[ỉi]u|kubet|thabet|nohu|n[ổo]\s*h[ũu]|game\s*b[àa]i|k[èe]o\s*b[óo]ng)\b/i,
];

// Hàm chuẩn hóa chuỗi để bắt biến thể lách chữ: "đ.ụ", "l_ồ_n", "d * m"
function normalizeTextForProfanityCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[._\-*~@#$^&+=|/\\]/g, '') // Xóa ký tự chen giữa
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kiểm tra bằng Rule-based Engine nội bộ (0ms latency, cực kỳ tin cậy)
 */
function checkLocalProfanity(text: string): { hasProfanity: boolean; matched: string[] } {
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
 * Gọi AI Google Gemini để đọc hiểu văn cảnh và chấm điểm độ an toàn (Nếu có API key)
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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    const parsed = JSON.parse(rawText);
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
 * Hàm kiểm duyệt tổng hợp chính:
 * 1. Quét từ ngữ chửi thề & lách chữ bằng Regex Engine.
 * 2. Gọi AI Gemini đọc ngữ cảnh (nếu có key).
 * 3. Áp dụng quy tắc Heuristic (1-2 sao với từ ngữ gắt gao sẽ tự động đưa vào hàng chờ duyệt).
 */
export async function moderateReviewContent(params: {
  authorName: string;
  content: string;
  rating: number;
}): Promise<ModerationResult> {
  const { authorName, content, rating } = params;
  const combinedText = `${authorName} ${content}`;

  // ── BƯỚC 1: Quét từ ngữ chửi thề thô tục ngay lập tức ──
  const localCheck = checkLocalProfanity(combinedText);
  if (localCheck.hasProfanity) {
    return {
      isApproved: false, // Ẩn ngay lập tức, chuyển vào hàng chờ duyệt
      toxicityScore: 0.95,
      reason: 'Phát hiện từ ngữ thô tục, chửi thề hoặc lăng mạ trong nội dung.',
      flaggedKeywords: localCheck.matched,
      moderatedBy: 'rule_engine',
    };
  }

  // ── BƯỚC 2: Gọi AI Google Gemini nếu có cấu hình GEMINI_API_KEY ──
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (geminiKey) {
    const aiResult = await checkWithGemini(content, authorName, rating, geminiKey);
    if (aiResult) {
      // Nếu AI đánh giá mức độc hại > 0.4 hoặc không an toàn
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

  // ── BƯỚC 3: Heuristic Rule - Đánh giá 1 - 2 sao có từ ngữ tiêu cực gắt gao ──
  // Đánh giá 1-2 sao thường cần được shop xem xét và hỗ trợ trước khi công khai
  const harshWords = ['quá tệ', 'cực kỳ tệ', 'thất vọng', 'rất bực', 'không chấp nhận được', 'quá kém', 'hàng dỏm', 'bị hỏng', 'bị rách'];
  const hasHarshWords = harshWords.some((w) => content.toLowerCase().includes(w));

  if (rating <= 2 && hasHarshWords) {
    return {
      isApproved: false, // Tự động đưa vào hàng chờ duyệt để chủ shop liên hệ hỗ trợ khách trước
      toxicityScore: 0.45,
      reason: 'Đánh giá điểm thấp có phản ánh tiêu cực mạnh. Đưa vào hàng chờ duyệt để hỗ trợ khách hàng trước khi hiển thị.',
      flaggedKeywords: harshWords.filter((w) => content.toLowerCase().includes(w)),
      moderatedBy: 'rating_heuristic',
    };
  }

  // Mặc định: An toàn và hợp lệ -> Tự động duyệt hiển thị ngay
  return {
    isApproved: true,
    toxicityScore: 0.05,
    reason: 'Nội dung lịch sự, hợp lệ và an toàn.',
    flaggedKeywords: [],
    moderatedBy: 'rule_engine',
  };
}

