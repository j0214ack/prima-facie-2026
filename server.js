import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const PORT = parseInt(process.env.PORT || '3000', 10);

// API proxy
app.post('/api/messages', async (c) => {
  const body = await c.req.json();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return c.json(data, res.status);
});

// Serve static files from dist/
app.use('/*', serveStatic({ root: './dist' }));

// SPA fallback
app.get('*', serveStatic({ root: './dist', path: '/index.html' }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});
