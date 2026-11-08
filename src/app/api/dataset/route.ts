import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DatasetCategoryInfo, DatasetStats } from '@/types';

const CATEGORY_META: Record<string, { nameVi: string; icon: string; description: string; color: string }> = {
  battery: {
    nameVi: 'Pin & Rác Điện Tử',
    icon: '🔋',
    description: 'Pin tiểu AA/AAA, pin Lithium-ion, ắc quy - Chất thải nguy hại kim loại nặng',
    color: '#ef4444',
  },
  biological: {
    nameVi: 'Rác Sinh Học / Hữu Cơ',
    icon: '🍎',
    description: 'Vỏ trái cây, rau củ quả, thức ăn thừa, bã cà phê - Có thể ủ phân compost vi sinh',
    color: '#10b981',
  },
  cardboard: {
    nameVi: 'Bìa Các-tông (Cardboard)',
    icon: '📦',
    description: 'Thùng carton sóng, hộp giày, bìa giấy cứng - Khả năng tái chế rất cao',
    color: '#b45309',
  },
  clothes: {
    nameVi: 'Quần Áo & Vải Cũ (Clothes)',
    icon: '👕',
    description: 'Áo thun, quần jeans, sợi dệt cotton & polyester - Tái sử dụng hoặc kéo sợi tái sinh',
    color: '#8b5cf6',
  },
  glass: {
    nameVi: 'Chai Lọ Thủy Tinh (Glass)',
    icon: '🍶',
    description: 'Chai rượu, lọ mứt, hũ thủy tinh thực phẩm - Tái sinh 100% vô hạn lần',
    color: '#06b6d4',
  },
  metal: {
    nameVi: 'Kim Loại & Vỏ Lon (Metal)',
    icon: '🥫',
    description: 'Lon nước ngọt nhôm, đồ hộp sắt tây, thìa dĩa kim loại phế liệu',
    color: '#f59e0b',
  },
  paper: {
    nameVi: 'Giấy Báo & Tài Liệu (Paper)',
    icon: '📄',
    description: 'Báo cũ, sách vở, giấy văn phòng A4, phong bì - Tái chế thành bột giấy mới',
    color: '#3b82f6',
  },
  plastic: {
    nameVi: 'Đồ Nhựa Các Loại (Plastic)',
    icon: '🧴',
    description: 'Chai nhựa PET #1, can nhựa HDPE #2, hộp nhựa PP #5, màng bọc nilông',
    color: '#ec4899',
  },
  shoes: {
    nameVi: 'Giày Dép Cũ (Shoes)',
    icon: '👟',
    description: 'Giày thể thao cũ, dép xốp EVA, da nhân tạo - Tái chế đế cao su hoặc quyên góp',
    color: '#6366f1',
  },
  trash: {
    nameVi: 'Rác Thải Vô Cơ Khác (Trash)',
    icon: '🗑️',
    description: 'Rác hỗn hợp khó phân loại, bao bì tráng nhôm phức hợp không tái chế được',
    color: '#64748b',
  },
};

export async function GET(req: NextRequest) {
  try {
    const archivePath = path.join(process.cwd(), 'archive', 'standardized_256');

    if (!fs.existsSync(archivePath)) {
      return NextResponse.json(
        { error: 'Thư mục dataset archive không tìm thấy trên máy.' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const categoryQuery = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);

    const dirEntries = fs.readdirSync(archivePath, { withFileTypes: true });
    const categoryDirs = dirEntries.filter((e) => e.isDirectory()).map((e) => e.name);

    let totalImages = 0;
    const categories: DatasetCategoryInfo[] = [];

    for (const catName of categoryDirs) {
      const catPath = path.join(archivePath, catName);
      const files = fs.readdirSync(catPath).filter((f) => !f.startsWith('.'));
      totalImages += files.length;

      const meta = CATEGORY_META[catName] || {
        nameVi: catName,
        icon: '♻️',
        description: 'Vật phẩm rác thải chuẩn hóa',
        color: '#10b981',
      };

      // If specific category requested, apply pagination
      let sampleFiles = files.slice(0, 12);
      if (categoryQuery && categoryQuery === catName) {
        const startIndex = (page - 1) * limit;
        sampleFiles = files.slice(startIndex, startIndex + limit);
      }

      categories.push({
        key: catName,
        nameVi: meta.nameVi,
        icon: meta.icon,
        count256: files.length,
        count384: files.length,
        description: meta.description,
        color: meta.color,
        sampleFiles,
      });
    }

    const stats: DatasetStats = {
      totalImages,
      categoriesCount: categories.length,
      resolution: '256x256 & 384x384 Standardized',
      categories,
    };

    return NextResponse.json(stats);
  } catch (err: any) {
    console.error('Dataset API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
