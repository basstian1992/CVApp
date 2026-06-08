import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const groqApiKey = process.env.GROQ_API_KEY || '';
const groq = new Groq({ apiKey: groqApiKey });

const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';

export async function POST(req: Request) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    if (!apiKey && !groqApiKey && !openRouterApiKey) {
      return NextResponse.json({ error: 'API keys are missing' }, { status: 500 });
    }

    const prompt = `Eres un redactor experto de Currículums Vitae (CV) en Chile.
El usuario ha escrito o dictado lo siguiente para el campo: "${context}".
Tu objetivo es corregir la ortografía, mejorar la redacción, usar un tono profesional y verbos de acción.
NO inventes datos, títulos, ni empresas que no estén en el texto original.
CRÍTICO: Devuelve ÚNICAMENTE el texto mejorado, sin introducciones, sin comentarios, SIN comillas y SIN bloques de código (Markdown). El texto debe estar listo para ser insertado directamente en un input HTML.

Texto original del usuario:
${text}
`;

    let enhancedText = '';

    try {
      // Intento 1: Google Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      enhancedText = response.text().trim();
    } catch (geminiError) {
      console.error('Error con Gemini, intentando Groq...', geminiError);
      
      try {
        // Intento 2 (Fallback 1): Groq
        if (!groqApiKey) throw new Error("No hay llave de Groq");
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
          temperature: 0.3,
          max_tokens: 1024,
        });
        enhancedText = chatCompletion.choices[0]?.message?.content?.trim() || '';
      } catch (groqError) {
        console.error('Error con Groq, intentando OpenRouter...', groqError);

        // Intento 3 (Fallback 2): OpenRouter
        if (!openRouterApiKey) throw new Error("No hay llave de OpenRouter");
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cvgratis.cl", // Site URL
            "X-Title": "CV Gratis", // Site Title
          },
          body: JSON.stringify({
            "model": "google/gemma-2-9b-it:free", // Modelo gratuito y rápido en OpenRouter
            "messages": [
              {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
          })
        });

        if (!response.ok) {
           throw new Error("Error en OpenRouter API");
        }

        const data = await response.json();
        enhancedText = data.choices[0]?.message?.content?.trim() || '';
      }
    }

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 });
  }
}
