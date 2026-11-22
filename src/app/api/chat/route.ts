import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, openaiApiKey, geminiApiKey, model, scanItemAttachment } = body;

    // Check for OpenAI API key (ChatGPT)
    const openAiKey =
      req.headers.get('x-openai-key') ||
      openaiApiKey ||
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    // Check for Gemini API key
    const geminiKey =
      req.headers.get('x-gemini-key') ||
      geminiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const systemPrompt = `
Bạn là EcoBot AI - Chuyên gia cố vấn môi trường, phân loại rác thải và kinh tế tuần hoàn tại Việt Nam, tích hợp sức mạnh trí tuệ nhân tạo ChatGPT và đối chiếu trực tiếp với bộ dữ liệu chuẩn hóa 10 nhóm rác thải (12.259 mẫu thực tế từ archive):
1. battery (756 mẫu): Pin tiểu AA/AAA, pin Lithium-ion, ắc quy - Chất thải nguy hại kim loại nặng (Chì, Thủy ngân, Cadmium).
2. biological (699 mẫu): Rác hữu cơ sinh học, vỏ rau củ quả, bã cà phê, thức ăn thừa - Dùng ủ phân compost vi sinh.
3. cardboard (1.411 mẫu): Bìa các-tông sóng, hộp carton đóng gói - Tái chế bột giấy, giữ khô ráo.
4. clothes (1.892 mẫu): Quần áo cũ, vải dệt, sợi cotton/polyester - Tái sử dụng, tặng Chợ Xanh 0 đồng, hoặc kéo sợi tái sinh.
5. glass (1.736 mẫu): Chai lọ thủy tinh thực phẩm, hũ gia vị - Tái sinh vô hạn 100%, tráng sạch.
6. metal (930 mẫu): Lon nước ngọt nhôm, hộp thiếc, phế liệu kim loại - Tiết kiệm 95% năng lượng khi tái chế.
7. paper (1.336 mẫu): Giấy in văn phòng, báo cũ, sách vở - Giữ khô, tháo ghim sắt.
8. plastic (1.597 mẫu): Đồ nhựa #1 PET (chai nước), #2 HDPE (can xà phòng), #5 PP (hộp cơm), màng nilông #4 LDPE.
9. shoes (1.449 mẫu): Giày thể thao cũ, dép xốp EVA, đế cao su lưu hóa - Tháo dây giày, tái chế đế hoặc quyên góp.
10. trash (453 mẫu): Rác vô cơ hỗn hợp khó tái chế (màng nhôm composite, tã bỉm, băng keo bẩn).

NGUYÊN TẮC TRẢ LỜI:
- Khi người dùng hỏi về bất kỳ vật phẩm, đồ dùng hay rác thải nào (hoặc khi có thông tin vật quét đính kèm), bạn PHẢI LUÔN LÀM RÕ 5 ĐIỀU SAU:
  1. **Đó là rác thải gì:** Tên cụ thể của vật phẩm/rác thải và chất liệu cấu tạo.
  2. **Chất thải loại gì:** Thuộc nhóm chất thải nào theo Quy chuẩn phân loại rác tại nguồn Việt Nam (Rác tái chế được / Rác hữu cơ dễ phân hủy / Rác vô cơ còn lại / Rác nguy hại sinh hoạt). Chỉ rõ màu thùng rác tương ứng.
  3. **Cần làm gì với nó:** Các bước hành động cụ thể, chi tiết từ làm sạch, bóc tách đến vứt đúng nơi quy định.
  4. **Có thể tái chế được không:** Trả lời rõ Có / Không / Có điều kiện, kèm tỷ lệ % và điều kiện cần thiết.
  5. **Tái chế được những gì?:** Liệt kê chi tiết các sản phẩm thành phẩm, nguyên liệu tái sinh có thể tạo ra từ loại rác này (Ví dụ: chai nhựa thành hạt rPET dệt áo, lon nhôm thành thỏi nhôm đúc vỏ máy, rác hữu cơ thành phân vi sinh compost...).

- Sử dụng phong cách thân thiện, khách quan, giàu năng lượng tích cực, dùng định dạng Markdown rõ ràng, gạch đầu dòng và emoji trực quan.
`;

    // 1. If OpenAI API key is available, call ChatGPT API
    if (openAiKey) {
      const selectedModel = model || 'gpt-4o-mini';
      let userContent = message;
      if (scanItemAttachment) {
        userContent += `\n\n[Thông tin vật phẩm vừa quét đính kèm: Tên: "${scanItemAttachment.itemName}", Loại: "${scanItemAttachment.categoryNameVi}", Chất liệu: "${scanItemAttachment.materialType}", Khả năng tái chế: "${scanItemAttachment.recyclability}"]`;
      }

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey.trim()}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });

      if (openaiRes.ok) {
        const openaiData = await openaiRes.json();
        const replyText = openaiData.choices?.[0]?.message?.content || '';

        return NextResponse.json({
          reply: replyText,
          aiProvider: 'chatgpt',
          model: selectedModel,
          suggestions: [
            'Món này tái chế thành những sản phẩm gì?',
            'Điểm thu gom gần tôi nhất ở đâu?',
            'Cách làm sạch đúng chuẩn trước khi vứt?',
            'Thời gian phân hủy tự nhiên là bao lâu?',
          ],
        });
      } else {
        const errJson = await openaiRes.json().catch(() => ({}));
        console.warn('OpenAI API returned non-200:', openaiRes.status, errJson);
        // If OpenAI key fails (e.g. invalid key or out of quota), proceed to fallback
      }
    }

    // 2. If Gemini API key is available and OpenAI wasn't used/succeeded
    if (geminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `User Question: ${message}${scanItemAttachment ? ` (Vật quét: ${scanItemAttachment.itemName})` : ''}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const replyText =
          geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return NextResponse.json({
          reply: replyText,
          aiProvider: 'gemini',
          model: 'gemini-1.5-flash',
          suggestions: [
            'Pin cũ vứt ở đâu an toàn?',
            'Quần áo cũ có tái chế được không?',
            'Giày dép cũ xử lý thế nào?',
            'Cách làm phân compost tại nhà?',
          ],
        });
      }
    }

    // 3. Fallback: Intelligent Dataset-Grounded Knowledge Engine
    return NextResponse.json({
      fallback: true,
      aiProvider: 'ecobot',
      message: 'Using Dataset-Grounded EcoBot Knowledge Base (12,259 samples)',
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ fallback: true, error: error?.message });
  }
}
