import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Eres un redactor experto de Currículums Vitae (CV) en Chile.
El usuario ha escrito o dictado lo siguiente para el campo: "${context}".
Tu objetivo es corregir la ortografía, mejorar la redacción, usar un tono profesional y verbos de acción.
NO inventes datos, títulos, ni empresas que no estén en el texto original.
CRÍTICO: Devuelve ÚNICAMENTE el texto mejorado, sin introducciones, sin comentarios, SIN comillas y SIN bloques de código (Markdown). El texto debe estar listo para ser insertado directamente en un input HTML.

Texto original del usuario:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedText = response.text().trim();

    return NextResponse.json({ enhancedText });
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 });
  }
}
