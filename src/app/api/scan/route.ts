import { NextRequest, NextResponse } from 'next/server';

const DATASET_COUNTS: Record<string, { count: number; nameVi: string; sampleImages: string[] }> = {
  battery: {
    count: 756,
    nameVi: 'Pin & Rác Điện Tử',
    sampleImages: ['battery_1.jpg', 'battery_10.jpg', 'battery_100.jpg'],
  },
  biological: {
    count: 699,
    nameVi: 'Rác Sinh Học / Hữu Cơ',
    sampleImages: ['biological_1.jpg', 'biological_10.jpg', 'biological_100.jpg'],
  },
  cardboard: {
    count: 1411,
    nameVi: 'Bìa Các-tông',
    sampleImages: ['cardboard_1.jpg', 'cardboard_10.jpg', 'cardboard_100.jpg'],
  },
  clothes: {
    count: 1892,
    nameVi: 'Quần Áo & Vải Cũ',
    sampleImages: ['clothes_1.jpg', 'clothes_10.jpg', 'clothes_100.jpg'],
  },
  glass: {
    count: 1736,
    nameVi: 'Chai Lọ Thủy Tinh',
    sampleImages: ['glass_1.jpg', 'glass_10.jpg', 'glass_100.jpg'],
  },
  metal: {
    count: 930,
    nameVi: 'Kim Loại & Vỏ Lon',
    sampleImages: ['metal_1.jpg', 'metal_10.jpg', 'metal_100.jpg'],
  },
  paper: {
    count: 1336,
    nameVi: 'Giấy Báo & Sách Vở',
    sampleImages: ['paper_1.jpg', 'paper_10.jpg', 'paper_100.jpg'],
  },
  plastic: {
    count: 1597,
    nameVi: 'Đồ Nhựa Các Loại',
    sampleImages: ['plastic_1.jpg', 'plastic_10.jpg', 'plastic_100.jpg'],
  },
  shoes: {
    count: 1449,
    nameVi: 'Giày Dép Cũ',
    sampleImages: ['shoes_1.jpg', 'shoes_10.jpg', 'shoes_100.jpg'],
  },
  trash: {
    count: 453,
    nameVi: 'Rác Vô Cơ Khác',
    sampleImages: ['trash_1.jpg', 'trash_10.jpg', 'trash_100.jpg'],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, fileName, openaiApiKey, geminiApiKey } = body;

    const openAiKey =
      req.headers.get('x-openai-key') ||
      openaiApiKey ||
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const apiKey =
      req.headers.get('x-gemini-key') ||
      geminiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const cleanBase64 = image.includes(',') ? image.split(',')[1] : image;
    const mimeMatch = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const promptText = `
You are an expert Environmental & Circular Economy AI, specialized in Vietnam waste sorting regulations and grounded in the 10-Class Waste Classification Dataset from the archive (12,259 images):
1. battery (756 samples): Pin tiểu, pin sạc, ắc quy, pin lithium, rác điện tử nguy hại
2. biological (699 samples): Rác hữu cơ, vỏ chuối/trái cây, rau củ quả, thức ăn thừa, bã cà phê
3. cardboard (1,411 samples): Thùng bìa carton sóng, hộp carton đóng gói, bìa cứng
4. clothes (1,892 samples): Quần áo cũ, áo thun, quần jeans, vải sợi cotton, sợi tổng hợp
5. glass (1,736 samples): Chai lọ thủy tinh thực phẩm, hũ gia vị, chai rượu, cốc thủy tinh
6. metal (930 samples): Lon nước ngọt nhôm, đồ hộp thiếc, phế liệu kim loại
7. paper (1,336 samples): Giấy in văn phòng, báo cũ, sách vở, tài liệu
8. plastic (1,597 samples): Chai nhựa PET #1, can nhựa HDPE #2, hộp nhựa PP #5, túi nilông
9. shoes (1,449 samples): Giày thể thao cũ, dép xốp EVA, đế cao su, giày da
10. trash (453 samples): Rác vô cơ hỗn hợp không tái chế được, màng nhôm composite

Analyze the provided image and classify it into one of these exact 10 categories.
You MUST provide the 5 CORE WASTE INSIGHTS required by the user:
1. Đó là rác thải gì (itemName, wasteName)
2. Chất thải loại gì (wasteClassification: Rác tái chế được / Rác hữu cơ / Rác nguy hại sinh hoạt / Rác vô cơ còn lại)
3. Cần làm gì với nó (actionGuide: Mảng các bước hành động cụ thể rõ ràng: Bước 1, Bước 2, Bước 3, Bước 4...)
4. Có thể tái chế được không (canRecycle: true/false, recyclabilityStatus: mô tả trạng thái, tỷ lệ %)
5. Tái chế được những gì? (recyclingProducts: Mảng danh sách các sản phẩm thành phẩm, nguyên liệu tái sinh có thể sản xuất từ loại rác này)

Return ONLY valid JSON matching this schema:
{
  "itemName": "Tên chi tiết tiếng Việt của món đồ (VD: Chai nhựa Lavie PET #1 / Vỏ lon bia nhôm)",
  "wasteName": "Tên nhóm rác thải cụ thể",
  "datasetCategory": "battery" | "biological" | "cardboard" | "clothes" | "glass" | "metal" | "paper" | "plastic" | "shoes" | "trash",
  "category": "plastic" | "paper" | "metal" | "glass" | "organic" | "electronic" | "hazardous" | "cardboard" | "clothes" | "shoes" | "trash" | "other",
  "categoryNameVi": "Tên danh mục tiếng Việt",
  "wasteClassification": "Chất thải có thể tái chế (hoặc Hữu cơ / Nguy hại / Vô cơ còn lại)",
  "wasteBinColor": "Màu thùng rác chuẩn (Thùng Vàng - Tái chế / Xanh lá - Hữu cơ / Đỏ - Nguy hại / Xám - Rác còn lại)",
  "materialType": "Chất liệu cụ thể",
  "canRecycle": true or false,
  "recyclabilityStatus": "Tuyên bố khả năng tái chế kèm tỷ lệ % và điều kiện",
  "recyclingProducts": ["Sản phẩm tái chế 1...", "Sản phẩm tái chế 2...", "Sản phẩm 3..."],
  "actionGuide": ["Bước 1...", "Bước 2...", "Bước 3...", "Bước 4..."],
  "recyclability": "high" | "medium" | "low" | "non-recyclable",
  "ecoScore": integer between 0 and 100,
  "co2SavedKg": float number (kg CO2 saved),
  "decompositionTime": "Thời gian phân hủy tự nhiên",
  "disposalGuide": ["Bước 1...", "Bước 2...", "Bước 3..."],
  "upcyclingTips": ["Ý tưởng tái chế/tái sử dụng 1...", "Ý tưởng 2..."],
  "confidence": float between 0.88 and 0.99
}
Ensure all descriptions are in Vietnamese, accurate, informative, and encouraging. Return ONLY raw JSON, no markdown backticks.
`;

    // 1. Check if OpenAI ChatGPT Vision can be used
    if (openAiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: promptText },
                  {
                    type: 'image_url',
                    image_url: {
                      url: image.startsWith('data:') ? image : `data:${mimeType};base64,${cleanBase64}`,
                    },
                  },
                ],
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
            max_tokens: 1000,
          }),
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          const content = openaiData.choices?.[0]?.message?.content || '{}';
          const parsed = JSON.parse(content);
          const catKey = parsed.datasetCategory || parsed.category || 'plastic';
          const meta = DATASET_COUNTS[catKey] || DATASET_COUNTS.plastic;

          parsed.datasetMatch = {
            categoryKey: catKey,
            categoryNameVi: meta.nameVi,
            totalDatasetSamples: meta.count,
            matchScore: parsed.confidence || 0.97,
            sampleImages: meta.sampleImages.map((file) => ({
              fileName: file,
              imageUrl: `/api/dataset/image?category=${catKey}&file=${file}&size=256`,
            })),
          };

          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.warn('OpenAI Vision attempt failed, continuing:', err);
      }
    }

    // 2. Check if Gemini Vision can be used
    if (apiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        try {
          const parsed = JSON.parse(candidateText.replace(/```json|```/g, '').trim());
          const catKey = parsed.datasetCategory || parsed.category || 'plastic';
          const meta = DATASET_COUNTS[catKey] || DATASET_COUNTS.plastic;

          parsed.datasetMatch = {
            categoryKey: catKey,
            categoryNameVi: meta.nameVi,
            totalDatasetSamples: meta.count,
            matchScore: parsed.confidence || 0.96,
            sampleImages: meta.sampleImages.map((file) => ({
              fileName: file,
              imageUrl: `/api/dataset/image?category=${catKey}&file=${file}&size=256`,
            })),
          };

          return NextResponse.json(parsed);
        } catch {
          // parse failed
        }
      }
    }

    // 3. Fallback to simulator
    return NextResponse.json({
      fallback: true,
      message: 'Using Dataset-Grounded AI Simulator (12,259 samples)',
    });
  } catch (error: any) {
    console.error('API Error in /api/scan:', error);
    return NextResponse.json({ fallback: true, error: error?.message });
  }
}
