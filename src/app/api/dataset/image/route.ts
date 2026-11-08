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
      // Fallback SVG cho môi trường Cloud
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
          <rect width="256" height="256" fill="#f1f5f9"/>
          <circle cx="128" cy="110" r="48" fill="#e2e8f0"/>
          <text x="128" y="122" font-family="sans-serif" font-size="36" text-anchor="middle">♻️</text>
          <text x="128" y="180" font-family="sans-serif" font-size="14" font-weight="600" fill="#0f172a" text-anchor="middle">${safeCategory.toUpperCase()}</text>
          <text x="128" y="200" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="middle">EcoScan Dataset Sample</text>
        </svg>
      `.trim();

      return new NextResponse(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
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
