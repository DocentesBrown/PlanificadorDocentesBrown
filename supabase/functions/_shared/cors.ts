export function resolveAllowedOrigin(req: Request) {
  const origin = req.headers.get('origin') || '';
  const raw = Deno.env.get('ALLOWED_ORIGINS') || '';

  if (!raw) return origin || '*';

  const allowed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!allowed.length) return origin || '*';
  if (allowed.includes('*')) return '*';
  if (origin && allowed.includes(origin)) return origin;

  return null;
}

export function corsHeaders(req: Request) {
  const allowedOrigin = resolveAllowedOrigin(req);
  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };
}
