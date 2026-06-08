import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const groqApiKey = process.env.GROQ_API_KEY || '';
const groq = new Groq({ apiKey: groqApiKey });

export async function POST(req: Request) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    if (!apiKey && !groqApiKey) {
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
      console.error('Error con Gemini, usando Groq de respaldo:', geminiError);
      
      // Fallback: Groq
      if (!groqApiKey) {
        throw new Error("Gemini falló y no hay llave de Groq disponible.");
      }
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.3,
        max_tokens: 1024,
      });
      
      enhancedText = chatCompletion.choices[0]?.message?.content?.trim() || '';
    }

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 });
  }
}
