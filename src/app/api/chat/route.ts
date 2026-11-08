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
        message: 'No Gemini key provided, using Smart AI Fallback',
      });
    }

    const systemPrompt = `
You are EcoBot AI - an enthusiastic, cheerful, and expert environmental consultant and circular economy specialist in Vietnam.
You specialize in:
- Waste sorting and recycling guidelines (especially practical in Vietnam, distinguishing plastics #1-#7, paper, metal, glass, organic, and hazardous e-waste/batteries).
- Upcycling and creative DIY solutions.
- Composting and zero-waste kitchen tips.
- Encouraging people to adopt a sustainable lifestyle.

Tone: Friendly, inspiring, informative, with relevant emojis.
Respond in Vietnamese with clear bullet points and bold key terms. Keep responses concise and engaging.
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
      suggestions: ['Làm sao phân loại pin cũ?', 'Cách làm phân compost tại nhà?']
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ fallback: true });
  }
}
