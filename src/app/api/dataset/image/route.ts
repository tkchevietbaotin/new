import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const file = searchParams.get('file');
    const size = searchParams.get('size') || '256';

    if (!category || !file) {
      return new NextResponse('Thiếu category hoặc file', { status: 400 });
    }

    // Sanitize parameters to avoid directory traversal
    const safeCategory = path.basename(category);
    const safeFile = path.basename(file);
    const folderName = size === '384' ? 'standardized_384' : size === 'original' ? 'original' : 'standardized_256';

    const filePath = path.join(process.cwd(), 'archive', folderName, safeCategory, safeFile);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Không tìm thấy file ảnh', { status: 404 });
    }

    const imageBuffer = fs.readFileSync(filePath);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err: any) {
    console.error('Image serve error:', err);
    return new NextResponse('Lỗi máy chủ', { status: 500 });
  }
}
