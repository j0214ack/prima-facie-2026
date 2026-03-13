import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const PORT = parseInt(process.env.PORT || '3000', 10);

// Anthropic proxy (supports streaming + prompt caching)
app.post('/api/anthropic', async (c) => {
  const body = await c.req.json();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
    body: JSON.stringify(body),
  });

  if (body.stream) {
    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  const data = await res.json();
  return c.json(data, res.status);
});

// Gemini proxy
app.post('/api/gemini', async (c) => {
  const body = await c.req.json();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return c.json(data, res.status);
});

// Serve static files from dist/
app.use('/*', serveStatic({
  root: './dist',
  mimes: {
    svg: 'image/svg+xml',
  },
}));

// SPA fallback
app.get('*', serveStatic({ root: './dist', path: '/index.html' }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
