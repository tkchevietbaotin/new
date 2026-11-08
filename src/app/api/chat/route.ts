import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const apiKey =
      req.headers.get('x-gemini-key') ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        fallback: true,
        message: 'Using Dataset-Grounded EcoBot Knowledge Base (12,259 samples)',
      });
    }

    const systemPrompt = `
You are EcoBot AI - an expert environmental consultant and circular economy specialist in Vietnam.
You are strictly trained and grounded on the 10-Class Waste Classification Dataset from the archive (12,259 standardized real-world images):
1. battery (756 samples): Pin tiểu AA/AAA, pin Lithium-ion, ắc quy - Chất thải nguy hại kim loại nặng (Chì, Thủy ngân, Cadmium). Phải dán cực và mang đến điểm thu gom, tuyệt đối không đốt hay vứt thùng rác thường.
2. biological (699 samples): Rác hữu cơ sinh học, vỏ rau củ quả, bã cà phê, thức ăn thừa - Dùng ủ phân compost Bokashi vi sinh giàu Nitơ & Kali.
3. cardboard (1,411 samples): Bìa các-tông sóng, hộp carton đóng gói - Tái chế bột giấy, giữ khô ráo và bóc sạch băng keo ni-lông.
4. clothes (1,892 samples): Quần áo cũ, vải dệt, sợi cotton/polyester - Tái sử dụng, tặng Chợ Xanh 0 đồng, hoặc kéo sợi tái sinh làm bông cách nhiệt.
5. glass (1,736 samples): Chai lọ thủy tinh thực phẩm, hũ gia vị - Tái sinh vô hạn 100%, tráng sạch và tháo nắp kim loại/nhựa.
6. metal (930 samples): Lon nước ngọt nhôm, hộp thiếc, phế liệu kim loại - Tiết kiệm 95% năng lượng khi tái chế, dẫm bẹp để tiết kiệm diện tích.
7. paper (1,336 samples): Giấy in văn phòng, báo cũ, sách vở - Giữ khô, tháo ghim sắt, buộc thành kiện.
8. plastic (1,597 samples): Đồ nhựa #1 PET (chai nước), #2 HDPE (can xà phòng), #5 PP (hộp cơm), màng nilông #4 LDPE.
9. shoes (1,449 samples): Giày thể thao cũ, dép xốp EVA, đế cao su lưu hóa - Tháo dây giày, tái chế đế hoặc quyên góp tái sử dụng.
10. trash (453 samples): Rác vô cơ hỗn hợp khó tái chế (bao bì tráng nhôm phức hợp, màng lai tạp).

When answering:
- Explicitly cite and cross-reference against the corresponding category in the 10-Class Archive Dataset (e.g. "Theo phân loại từ kho dữ liệu đối chứng 12.259 mẫu thực tế (nhóm clothes/plastic/battery)...").
- Provide clear, actionable, friendly, and practical advice in Vietnamese with bullet points.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `User Question: ${message}` }
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!geminiRes.ok) {
      return NextResponse.json({ fallback: true });
    }

    const geminiData = await geminiRes.json();
    const replyText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      reply: replyText,
      suggestions: [
        'Pin cũ vứt ở đâu an toàn?',
        'Quần áo cũ có tái chế được không?',
        'Giày dép cũ xử lý thế nào?',
        'Cách làm phân compost tại nhà?'
      ]
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ fallback: true });
  }
}
