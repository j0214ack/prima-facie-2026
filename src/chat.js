const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function sendMessage(systemPrompt, history, userMessage) {
  const contents = [];

  // System instruction as first user turn
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\n請用繁體中文回答。以下是當事人的問題：' }],
  });
  contents.push({
    role: 'model',
    parts: [{ text: '好的，我了解了。請問有什麼我能幫您的？' }],
  });

  // Conversation history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  }

  // Current user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '（無回應）';
}
