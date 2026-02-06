import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json(); // Tady přijímáme téma od rodiče
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Chybí DeepSeek API klíč v nastavení." }, { status: 500 });
    }

    // Voláme DeepSeek API
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: "Jsi kreativní asistent pro rodiče. Navrhni 6 unikátních motivů pro pexeso na základě zadaného tématu. Odpověz v češtině jako čistý JSON seznam řetězců." 
          },
          { role: "user", content: `Téma pexesa: ${text}` }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      navrhy: data.choices[0].message.content 
    });

  } catch (error) {
    return NextResponse.json({ error: "Něco se nepovedlo při komunikaci s AI." }, { status: 500 });
  }
}