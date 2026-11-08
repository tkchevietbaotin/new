import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, fileName } = body;

    const apiKey =
      req.headers.get('x-gemini-key') ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Return 200 with fallback indicator so client uses smart simulator
      return NextResponse.json({
        fallback: true,
        message: 'No Gemini API key provided. Using Smart AI Simulator.',
      });
    }

    // Call Gemini 1.5 Flash Vision
    const cleanBase64 = image.includes(',') ? image.split(',')[1] : image;
    const mimeMatch = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const promptText = `
You are an expert Environmental & Circular Economy AI (EcoScan AI).
Analyze the provided image of a waste item, package, or product.
Return ONLY valid JSON matching this exact schema:
{
  "itemName": "Tên vật phẩm chi tiết tiếng Việt",
  "category": "plastic" | "paper" | "metal" | "glass" | "organic" | "electronic" | "hazardous" | "other",
  "categoryNameVi": "Phân loại chi tiết tiếng Việt (VD: Nhựa #1 PET, Nhôm, Giấy kraft...)",
  "materialType": "Chất liệu cụ thể",
  "recyclability": "high" | "medium" | "low" | "non-recyclable",
  "ecoScore": integer between 0 and 100 (100 is most eco-friendly/compostable/infinitely recyclable, 0 is toxic hazardous single use),
  "co2SavedKg": float number of kg CO2 saved when properly recycled/composted (e.g. 0.15),
  "decompositionTime": "Thời gian phân hủy tự nhiên (VD: 450 năm, 2 tuần, v.v.)",
  "disposalGuide": ["Bước 1...", "Bước 2...", "Bước 3..."],
  "upcyclingTips": ["Ý tưởng tái chế/tái sử dụng sáng tạo 1...", "Ý tưởng 2..."],
  "confidence": float between 0.85 and 0.99
}
Ensure all text descriptions are in Vietnamese, accurate, informative, and encouraging. Return ONLY raw JSON, no markdown backticks.
`;

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
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.warn('Gemini API Error:', errText);
      return NextResponse.json({ fallback: true, error: errText });
    }

    const geminiData = await geminiRes.json();
    const candidateText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    try {
      const parsed = JSON.parse(candidateText.replace(/```json|```/g, '').trim());
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ fallback: true });
    }
  } catch (error: any) {
    console.error('API Error in /api/scan:', error);
    return NextResponse.json({ fallback: true, error: error?.message });
  }
}
