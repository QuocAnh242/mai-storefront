import { describe, it, expect } from "vitest";
import {
  removeVietnameseTones,
  normalizeSearchQuery,
  matchesSearch,
  filterProductsBySearch,
} from "@/lib/searchUtils";

describe("searchUtils (Vietnamese Diacritic Normalization & Search)", () => {
  it("removes Vietnamese tones accurately", () => {
    expect(removeVietnameseTones("Bột Kim Tuyến")).toBe("Bot Kim Tuyen");
    expect(removeVietnameseTones("Băng Keo Đục Đóng Thùng")).toBe("Bang Keo Duc Dong Thung");
    expect(removeVietnameseTones("Sơn Xịt Đỏ ATM")).toBe("Son Xit Do ATM");
  });

  it("normalizes queries with trimming and lowercasing", () => {
    expect(normalizeSearchQuery("  BỘT   MÀU   ")).toBe("bot mau");
    expect(normalizeSearchQuery("KIM TUYẾN 1/128")).toBe("kim tuyen 1/128");
  });

  it("matches search with accent-insensitive search queries", () => {
    expect(matchesSearch("Bột Màu Ba Biển Vật Liệu Xây Dựng", "bot mau")).toBe(true);
    expect(matchesSearch("Bột Màu Ba Biển Vật Liệu Xây Dựng", "ba bien")).toBe(true);
    expect(matchesSearch("Bột Kim Tuyến Ngũ Sắc Ánh Cầu Vồng", "kim tuyen cau vong")).toBe(true);
    expect(matchesSearch("Băng Keo Trong", "kim tuyen")).toBe(false);
  });

  it("filters products correctly by title, category, or description", () => {
    const products = [
      { id: "1", title: "Bột Kim Tuyến Vàng 1/128", categoryName: "Bột Kim Tuyến", description: "Hạt nhũ mịn óng ánh" },
      { id: "2", title: "Bột Màu Đỏ Ba Biển", categoryName: "Bột Màu & Camay", description: "Chuyên pha xi măng gạch" },
      { id: "3", title: "Băng Keo Trong 200ya", categoryName: "Băng Keo", description: "Đóng gói dán thùng carton" },
    ];

    const res1 = filterProductsBySearch(products, "kim tuyen");
    expect(res1.length).toBe(1);
    expect(res1[0].id).toBe("1");

    const res2 = filterProductsBySearch(products, "xi mang");
    expect(res2.length).toBe(1);
    expect(res2[0].id).toBe("2");

    const res3 = filterProductsBySearch(products, "bang keo");
    expect(res3.length).toBe(1);
    expect(res3[0].id).toBe("3");
  });
});
