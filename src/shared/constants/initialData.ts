import { Category, Product, BlogPost, StoreSettings } from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'MAI KIM TUYẾN',
  hotline: '0908 998 098',
  zaloPhone: '0908998098',
  email: 'chuyencungcapkimtuyensivale@gmail.com',
  facebookUrl: 'https://www.facebook.com/chuyencungcapkimtuyensivale',
  address: '44 Trịnh Hoài Đức, Phường Chợ Lớn, TP. Hồ Chí Minh',
  workingHours: 'Thứ 2 - Thứ 7: 8:00 - 18:00',
  bankAccountName: 'MAI KIM TUYEN',
  bankAccountNumber: '0908998098',
  bankName: 'MBBANK',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-kim-tuyen',
    name: 'Bột Kim Tuyến',
    slug: 'bot-kim-tuyen',
    description: 'Đầy đủ màu sắc, nhũ ánh hạt kim tuyến thủ công & công nghiệp',
    subcategories: [
      { id: 'sub-kt-mau', name: 'Kim tuyến Màu', slug: 'kim-tuyen-mau', categoryId: 'cat-kim-tuyen' },
      { id: 'sub-kt-ngu-sac', name: 'Kim tuyến Ngũ sắc', slug: 'kim-tuyen-ngu-sac', categoryId: 'cat-kim-tuyen' },
      { id: 'sub-kt-cu', name: 'Kim tuyến Cừ', slug: 'kim-tuyen-cu', categoryId: 'cat-kim-tuyen' },
      { id: 'sub-kt-nhu-anh', name: 'Kim tuyến Nhũ ánh', slug: 'kim-tuyen-nhu-anh', categoryId: 'cat-kim-tuyen' },
      { id: 'sub-kt-hinh', name: 'Kim tuyến Hình', slug: 'kim-tuyen-hinh', categoryId: 'cat-kim-tuyen' },
      { id: 'sub-kt-bang-size', name: 'Bảng size kim tuyến', slug: 'bang-size-kim-tuyen', categoryId: 'cat-kim-tuyen' },
    ]
  },
  {
    id: 'cat-camay',
    name: 'Bột Camay',
    slug: 'bot-camay',
    description: 'Bột ngọc trai camay ánh kim cao cấp chuyên sơn phủ',
    subcategories: []
  },
  {
    id: 'cat-da-quang',
    name: 'Bột Dạ Quang',
    slug: 'bot-da-quang',
    description: 'Bột tự phát sáng trong đêm cho mỹ thuật & thi công',
    subcategories: []
  },
  {
    id: 'cat-phan-quang',
    name: 'Bột Phản Quang',
    slug: 'bot-phan-quang',
    description: 'Bột dán & sơn phản quang cảnh báo an toàn',
    subcategories: []
  },
  {
    id: 'cat-bot-mau',
    name: 'Bột Màu',
    slug: 'bot-mau',
    description: 'Bột màu công nghiệp, xây dựng và mỹ thuật',
    subcategories: [
      { id: 'sub-bm-ba-bien', name: 'Bột màu Ba biển', slug: 'bot-mau-ba-bien', categoryId: 'cat-bot-mau' },
      { id: 'sub-bm-xay-dung', name: 'Bột màu Xây dựng', slug: 'bot-mau-xay-dung', categoryId: 'cat-bot-mau' },
      { id: 'sub-bm-mino', name: 'Bột màu Minơ', slug: 'bot-mau-mino', categoryId: 'cat-bot-mau' },
      { id: 'sub-bm-dau', name: 'Bột màu Dầu', slug: 'bot-mau-dau', categoryId: 'cat-bot-mau' },
      { id: 'sub-bm-nuoc', name: 'Bột màu Nước', slug: 'bot-mau-nuoc', categoryId: 'cat-bot-mau' },
      { id: 'sub-bm-khac', name: 'Khác', slug: 'bot-mau-khac', categoryId: 'cat-bot-mau' },
    ]
  },
  {
    id: 'cat-bang-keo',
    name: 'Băng Keo',
    slug: 'bang-keo',
    description: 'Băng keo dán thùng, siêu dính, văn phòng & xây dựng',
    subcategories: [
      { id: 'sub-bk-duc-trong', name: 'Đục / Trong', slug: 'bang-keo-duc-trong', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-simili', name: 'Simili', slug: 'bang-keo-simili', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-2m-xop', name: '2 mặt xốp', slug: 'bang-keo-2-mat-xop', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-2m-mong', name: '2 mặt mỏng', slug: 'bang-keo-2-mat-mong', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-vai', name: 'BK Vải', slug: 'bang-keo-vai', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-vpp', name: 'BK VPP', slug: 'bang-keo-vpp', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-dan-gia', name: 'BK dán giá', slug: 'bang-keo-dan-gia', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-luoi', name: 'BK lưới', slug: 'bang-keo-luoi', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-2m-luoi', name: 'BK 2 mặt lưới', slug: 'bang-keo-2-mat-luoi', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-2m-trong', name: 'BK 2 mặt trong', slug: 'bang-keo-2-mat-trong', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-dien', name: 'BK điện', slug: 'bang-keo-dien', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-thach-cao', name: 'BK lưới dán thạch cao', slug: 'bang-keo-luoi-dan-thach-cao', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-giay', name: 'BK giấy', slug: 'bang-keo-giay', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-chong-dot', name: 'BK chống dột', slug: 'bang-keo-chong-dot', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-da-bo', name: 'BK da bò', slug: 'bang-keo-da-bo', categoryId: 'cat-bang-keo' },
      { id: 'sub-bk-khac', name: 'Khác', slug: 'bang-keo-khac', categoryId: 'cat-bang-keo' },
    ]
  },
  {
    id: 'cat-son-xit',
    name: 'Sơn Xịt',
    slug: 'son-xit',
    description: 'Chai sơn xịt các thương hiệu lớn & sơn chuyên dụng',
    subcategories: [
      { id: 'sub-sx-atm', name: 'ATM', slug: 'son-xit-atm', categoryId: 'cat-son-xit' },
      { id: 'sub-sx-win', name: 'WIN', slug: 'son-xit-win', categoryId: 'cat-son-xit' },
      { id: 'sub-sx-redfox', name: 'Redfox', slug: 'son-xit-redfox', categoryId: 'cat-son-xit' },
      { id: 'sub-sx-samurai', name: 'Samurai', slug: 'son-xit-samurai', categoryId: 'cat-son-xit' },
      { id: 'sub-sx-chong-chay', name: 'Sơn chống cháy', slug: 'son-chong-chay', categoryId: 'cat-son-xit' },
      { id: 'sub-sx-ma', name: 'Sơn mạ', slug: 'son-ma', categoryId: 'cat-son-xit' },
    ]
  },
  {
    id: 'cat-keo-dan',
    name: 'Keo Dán',
    slug: 'keo-dan',
    description: 'Keo dính gỗ, vải, silicon, 502, keo AB công nghiệp',
    subcategories: [
      { id: 'sub-kd-silicon', name: 'Silicon', slug: 'keo-silicon', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-502-cam', name: '502 Cam', slug: 'keo-502-cam', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-502-voi', name: 'Keo 502 voi', slug: 'keo-502-voi', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-go', name: 'Keo dán gỗ', slug: 'keo-dan-go', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-vai', name: 'Keo dán vải', slug: 'keo-dan-vai', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-con-cho', name: 'Keo con chó (Dog X66)', slug: 'keo-con-cho-dog-x66', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-ab', name: 'Keo AB', slug: 'keo-ab', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-sua-atm', name: 'Keo sữa ATM', slug: 'keo-sua-atm', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-moto-kieu', name: 'Keo Moto Kiều', slug: 'keo-moto-kieu', categoryId: 'cat-keo-dan' },
      { id: 'sub-kd-khac', name: 'Khác', slug: 'keo-dan-khac', categoryId: 'cat-keo-dan' },
    ]
  },
  {
    id: 'cat-xi-giay',
    name: 'Xi Đánh Giày',
    slug: 'xi-danh-giay',
    description: 'Xi thái, xi bóng bảo vệ đồ da cao cấp',
    subcategories: [
      { id: 'sub-xi-kleen', name: 'Xi thái Kleen', slug: 'xi-thai-kleen', categoryId: 'cat-xi-giay' },
      { id: 'sub-xi-aromax', name: 'Xi Aromax', slug: 'xi-aromax', categoryId: 'cat-xi-giay' },
      { id: 'sub-xi-ximo', name: 'Xi Ximo', slug: 'xi-ximo', categoryId: 'cat-xi-giay' },
      { id: 'sub-xi-starwax', name: 'Xi Starwax', slug: 'xi-starwax', categoryId: 'cat-xi-giay' },
      { id: 'sub-xi-cf', name: 'Xi CF', slug: 'xi-cf', categoryId: 'cat-xi-giay' },
    ]
  },
  {
    id: 'cat-khac',
    name: 'Vật Tư Khác',
    slug: 'vat-tu-khac',
    description: 'Dụng cụ hỗ trợ đóng gói, dán nhãn & phụ kiện',
    subcategories: [
      { id: 'sub-vt-cat-bk', name: 'Cắt băng keo cầm tay', slug: 'cat-bang-keo-cam-tay', categoryId: 'cat-khac' },
      { id: 'sub-vt-may-gia', name: 'Máy bắn giá tiền', slug: 'may-ban-gia-tien', categoryId: 'cat-khac' },
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Hướng Dẫn Chọn Bột Màu Phù Hợp Cho Công Trình Gạch Vỉa Hè & Chậu Cảnh',
    slug: 'huong-dan-chon-bot-mau-phu-hop-cho-cong-trinh',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    summary: 'Bài viết chia sẻ kinh nghiệm phối bột màu Ba Biển, Bột màu Vàng Oxide Sắt 313 và Bột màu Đỏ Y101 để đạt màu sắc tươi độ bền tối ưu.',
    content: `
### 1. Giới thiệu các loại bột màu xây dựng phổ biến
Trong thi công chậu cảnh, gạch terrazzo, gạch vỉa hè và gạch bông, 3 dòng bột màu được ưa chuộng nhất là:
- **Bột màu Ba Biển (Bao 5kg)**: Chuyên dùng cho chậu cảnh, phối màu bê tông nhỏ gọn, độ phủ mịn.
- **Bột màu Vàng Oxide Sắt 313 (Loại 3 Đồng Tiền - Bao 25kg)**: Tạo tông màu vàng đất tự nhiên, siêu bền màu ngoài trời.
- **Bột màu Đỏ Oxide Sắt Y101 (Hunan Three-Ring - Bao 25kg)**: Tạo tông đỏ rực rỡ, khả năng phân tán tuyệt vời trong xi măng.

### 2. Mẹo tỷ lệ pha trộn xi măng
Nên pha bột màu vào nước hoặc xi măng khô trước khi trộn cát đá để bột màu phân tán đều hoàn toàn, tránh hiện tượng đốm màu.
    `,
    author: 'Chị Mai Kim Tuyến',
    isPublished: true,
    createdAt: '2026-08-05'
  },
  {
    id: 'blog-2',
    title: 'Cách Tẩy Keo 502 & Keo Con Chó Dính Trên Quần Áo, Đồ Da Cực Nhanh',
    slug: 'cach-tay-keo-502-va-keo-con-cho-tren-do-da',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    summary: 'Chẳng may dán keo bị dính ra tay hoặc quần áo? Áp dụng ngay 2 mẹo đơn giản với dung dịch tẩy keo và dầu ăn.',
    content: `
### Cách 1: Tẩy keo 502 bằng dung dịch Xăng thơm hoặc Acetone
Thấm một lượng nhỏ Acetone vào bông gòn rồi lau nhẹ lên vết keo 502 cứng. Keo sẽ rã ra dần dần trong 1-2 phút.

### Cách 2: Tẩy keo con chó Dog X66 bằng Dầu ăn
Keo con chó có gốc cao su. Khi dính lên tay hoặc mép giày, bôi ít dầu ăn và xoa nhẹ, keo sẽ kết vón lại và dễ dàng bóc sạch.
    `,
    author: 'Chị Mai Kim Tuyến',
    isPublished: true,
    createdAt: '2026-08-08'
  }
];
