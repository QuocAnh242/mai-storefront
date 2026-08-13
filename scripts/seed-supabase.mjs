import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    envVars[key] = val;
  }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.error('❌ Missing Supabase URL or ANON Key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log('🚀 Starting Supabase Database Initialization...');

  // 1. Initial Categories
  const categories = [
    { id: 'cat-kim-tuyen', name: 'Bột Kim Tuyến', slug: 'bot-kim-tuyen', description: 'Đầy đủ màu sắc, nhũ ánh hạt kim tuyến thủ công & công nghiệp' },
    { id: 'cat-camay', name: 'Bột Camay', slug: 'bot-camay', description: 'Bột ngọc trai camay ánh kim cao cấp chuyên sơn phủ' },
    { id: 'cat-da-quang', name: 'Bột Dạ Quang', slug: 'bot-da-quang', description: 'Bột tự phát sáng trong đêm cho mỹ thuật & thi công' },
    { id: 'cat-phan-quang', name: 'Bột Phản Quang', slug: 'bot-phan-quang', description: 'Bột dán & sơn phản quang cảnh báo an toàn' },
    { id: 'cat-bot-mau', name: 'Bột Màu', slug: 'bot-mau', description: 'Bột màu công nghiệp, xây dựng và mỹ thuật' },
    { id: 'cat-bang-keo', name: 'Băng Keo', slug: 'bang-keo', description: 'Băng keo dán thùng, siêu dính, văn phòng & xây dựng' },
    { id: 'cat-son-xit', name: 'Sơn Xịt', slug: 'son-xit', description: 'Chai sơn xịt các thương hiệu lớn & sơn chuyên dụng' },
    { id: 'cat-keo-dan', name: 'Keo Dán', slug: 'keo-dan', description: 'Keo dính gỗ, vải, silicon, 502, keo AB công nghiệp' },
    { id: 'cat-xi-giay', name: 'Xi Đánh Giày', slug: 'xi-danh-giay', description: 'Xi thái, xi bóng bảo vệ đồ da cao cấp' },
    { id: 'cat-khac', name: 'Vật Tư Khác', slug: 'vat-tu-khac', description: 'Dụng cụ hỗ trợ đóng gói, dán nhãn & phụ kiện' },
  ];

  console.log('📦 Upserting Categories...');
  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  if (catErr) console.error('⚠️ Categories upsert error:', catErr.message);
  else console.log('✅ Categories populated successfully.');

  // 2. Initial Products
  const products = [
    {
      id: 'p-1',
      title: 'Bột Màu Ba Biển Vật Liệu Xây Dựng (Bao 5kg)',
      slug: 'bot-mau-ba-bien-vat-lieu-xay-dung-bao-5kg',
      price: 150000,
      original_price: 180000,
      unit: 'Bao 5kg',
      description: 'Bột màu Ba Biển chuyên làm đá hoa, gạch bông, chậu cảnh, phối màu bê tông, sản xuất phân bón cây trồng & mỹ thuật.',
      category_id: 'cat-bot-mau',
      category_name: 'Bột Màu',
      subcategory_id: 'sub-bm-ba-bien',
      subcategory_name: 'Bột màu Ba biển',
      images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'],
      is_featured: true,
      display_order: 1,
      in_stock: true,
    },
    {
      id: 'p-2',
      title: 'Bột Màu Vàng Oxide Sắt 313 (Bột Màu Vàng Đất 3 Đồng Tiền) - Bao 25kg',
      slug: 'bot-mau-vang-oxide-sat-313-bao-25kg',
      price: 640000,
      original_price: 700000,
      unit: 'Bao 25kg',
      description: 'Bột màu vàng 313 Oxide sắt loại I nhập khẩu cao cấp (Loại 3 đồng tiền) chuyên dùng cho gạch terrazzo, gạch vỉa hè, chậu cảnh.',
      category_id: 'cat-bot-mau',
      category_name: 'Bột Màu',
      subcategory_id: 'sub-bm-xay-dung',
      subcategory_name: 'Bột màu Xây dựng',
      images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'],
      is_featured: true,
      display_order: 2,
      in_stock: true,
    },
    {
      id: 'p-3',
      title: 'Bột Màu Đen Công Nghiệp Pigment Black 722 (RANE ONE) - Bao 25kg',
      slug: 'bot-mau-den-pigment-black-722-25kg',
      price: 680000,
      original_price: 750000,
      unit: 'Bao 25kg',
      description: 'Bột màu đen RANE ONE Pigment Black 722 nhập khẩu chuyên dụng cho ngành sản xuất gạch, bê tông, phân bón & công nghiệp.',
      category_id: 'cat-bot-mau',
      category_name: 'Bột Màu',
      subcategory_id: 'sub-bm-xay-dung',
      subcategory_name: 'Bột màu Xây dựng',
      images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'],
      is_featured: true,
      display_order: 3,
      in_stock: true,
    },
    {
      id: 'p-4',
      title: 'Bột Màu Đỏ Oxide Sắt Y101 (Hunan Three-Ring) - Bao 25kg',
      slug: 'bot-mau-do-oxide-sat-y101-bao-25kg',
      price: 650000,
      original_price: 700000,
      unit: 'Bao 25kg',
      description: 'Bột màu đỏ Oxide sắt Y101 chất lượng cao nhập khẩu Hunan Three-Ring Pigments. Độ bền màu cao, phân tán đều.',
      category_id: 'cat-bot-mau',
      category_name: 'Bột Màu',
      subcategory_id: 'sub-bm-xay-dung',
      subcategory_name: 'Bột màu Xây dựng',
      images: ['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'],
      is_featured: true,
      display_order: 4,
      in_stock: true,
    },
    {
      id: 'p-5',
      title: 'Bột Kim Tuyến Màu Đỏ Ánh Kim Cao Cấp',
      slug: 'bot-kim-tuyen-mau-do-anh-kim',
      price: 120000,
      original_price: 150000,
      unit: 'Kg',
      description: 'Bột kim tuyến đỏ nhũ lấp lánh làm đồ thủ công mỹ nghệ, in lụa, sơn trang trí.',
      category_id: 'cat-kim-tuyen',
      category_name: 'Bột Kim Tuyến',
      subcategory_id: 'sub-kt-mau',
      subcategory_name: 'Kim tuyến Màu',
      images: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'],
      is_featured: true,
      display_order: 5,
      in_stock: true,
    },
  ];

  console.log('🏷️ Upserting Products...');
  const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (prodErr) console.error('⚠️ Products upsert error:', prodErr.message);
  else console.log('✅ Products populated successfully.');

  // 3. Clear existing blogs & Insert initial Section-based Blog Post
  console.log('📰 Clearing old mock blogs and inserting fresh Section-based post...');
  await supabase.from('blogs').delete().neq('id', '');

  const sampleSectionBlog = {
    id: `blog-section-demo-1`,
    title: 'Hướng Dẫn Chi Tiết Chọn Bột Màu Xây Dựng & Bột Kim Tuyến Chuẩn Tận Xưởng',
    slug: 'huong-dan-chi-tiet-chon-bot-mau-xay-dung-bot-kim-tuyen',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    summary: 'Bài viết chia sẻ kinh nghiệm phối bột màu Ba Biển, Bột màu Vàng Oxide Sắt 313 và Bột màu Đỏ Y101 cùng quy trình dán keo siêu dính.',
    content: 'Hướng dẫn chi tiết chọn bột màu xây dựng & bột kim tuyến...',
    sections: [
      {
        id: 'sec-1',
        sectionTitle: 'Phần 1: Giới Thiệu Các Loại Bột Màu Xây Dựng Phổ Biến',
        blocks: [
          {
            id: 'blk-1',
            type: 'paragraph',
            content: 'Trong thi công chậu cảnh, gạch terrazzo, gạch vỉa hè và gạch bông, các dòng bột màu chất lượng cao đóng vai trò quyết định đến độ bền và tính thẩm mỹ.',
            formatting: { alignment: 'left' }
          },
          {
            id: 'blk-2',
            type: 'heading',
            level: 2,
            content: '1.1 Bột Màu Ba Biển & Bột Màu Oxide Sắt',
            formatting: { alignment: 'left' }
          },
          {
            id: 'blk-3',
            type: 'paragraph',
            content: 'Bột màu Ba Biển (Bao 5kg) chuyên dùng cho chậu cảnh nhỏ gọn. Đối với gạch vỉa hè công trình lớn, dòng Oxide Sắt Vàng 313 và Đỏ Y101 mang lại khả năng chống phai màu ngoài trời xuất sắc.',
            formatting: { alignment: 'left' }
          }
        ],
        hasAdAfter: true,
        adConfig: {
          bannerTitle: 'Tư Vấn Trực Tiếp Từ Chị Mai Kim Tuyến',
          bannerSubtitle: 'Liên hệ Hotline/Zalo 0908 998 098 để nhận mẫu thử & bảng giá sỉ tận xưởng.',
          bannerCtaText: 'Liên Hệ Zalo'
        }
      },
      {
        id: 'sec-2',
        sectionTitle: 'Phần 2: Ứng Dụng Bột Kim Tuyến & Keo Dán Chuyên Dụng',
        blocks: [
          {
            id: 'blk-4',
            type: 'paragraph',
            content: 'Bột kim tuyến hạt siêu mịn nhũ lấp lánh thường được áp dụng trong in lụa trên vải, làm keo dán trang trí đồ thủ công và thi công bảng hiệu quảng cáo.',
            formatting: { alignment: 'left' }
          },
          {
            id: 'blk-5',
            type: 'quote',
            content: 'Mẹo hay: Trộn bột kim tuyến với keo bóng xịt phủ lên bề mặt sản phẩm sẽ giúp nhũ bám chặt và không rơi hạt.',
            formatting: { alignment: 'left' }
          }
        ],
        hasAdAfter: false
      }
    ],
    author: 'Chị Mai Kim Tuyến',
    is_published: true,
  };

  // Try inserting with sections
  let { error: blogErr } = await supabase.from('blogs').insert([sampleSectionBlog]);
  if (blogErr && blogErr.message.includes('sections')) {
    // If live Supabase table doesn't have sections column yet, insert without sections column
    console.log('ℹ️ Table blogs has no sections column yet. Inserting standard record...');
    const fallbackBlog = { ...sampleSectionBlog };
    delete fallbackBlog.sections;
    const res = await supabase.from('blogs').insert([fallbackBlog]);
    blogErr = res.error;
  }
  if (blogErr) console.error('⚠️ Blog insert error:', blogErr.message);
  else console.log('✅ Section-based blog post created successfully in Supabase.');

  console.log('🎉 Supabase Data Initialization Finished!');
}

main().catch(console.error);
