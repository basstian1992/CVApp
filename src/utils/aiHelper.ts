export async function enhanceTextWithAI(currentText: string, contextInfo: string): Promise<string> {
  if (!currentText.trim()) return currentText;

  try {
    const response = await fetch('/api/ai/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: currentText,
        context: contextInfo
      }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con la IA');
    }

    const data = await response.json();
    return data.enhancedText || currentText;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
