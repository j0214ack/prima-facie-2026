let currentProvider = localStorage.getItem('provider') || 'anthropic';

export function getProvider() {
  return currentProvider;
}

export function setProvider(provider) {
  currentProvider = provider;
  localStorage.setItem('provider', provider);
}

export async function sendMessage(systemPrompt, history, userMessage, onChunk) {
  if (currentProvider === 'anthropic') {
    return sendAnthropic(systemPrompt, history, userMessage, onChunk);
  }
  return sendGemini(systemPrompt, history, userMessage);
}

async function sendAnthropic(systemPrompt, history, userMessage, onChunk) {
  const messages = [];

  for (const msg of history) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text,
    });
  }
  messages.push({ role: 'user', content: userMessage });

  const res = await fetch('/api/anthropic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt + '\n\n請用繁體中文回答。',
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error: ${res.status} - ${err}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') continue;

      try {
        const event = JSON.parse(data);
        if (event.type === 'content_block_delta' && event.delta?.text) {
          fullText += event.delta.text;
          if (onChunk) onChunk(fullText);
        }
      } catch {}
    }
  }

  return fullText || '（無回應）';
}

async function sendGemini(systemPrompt, history, userMessage) {
  const contents = [];

  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\n請用繁體中文回答。以下是當事人的問題：' }],
  });
  contents.push({
    role: 'model',
    parts: [{ text: '好的，我了解了。請問有什麼我能幫您的？' }],
  });

  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  }
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '（無回應）';
}
