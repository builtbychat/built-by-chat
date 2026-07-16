const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

export async function createIdentity(secret: string): Promise<string> {
  const id = crypto.randomUUID();
  return `${id}.${await hmac(secret, id)}`;
}

export async function verifyIdentity(secret: string, signed: string | undefined): Promise<string | null> {
  if (!signed) return null;
  const separator = signed.lastIndexOf('.');
  if (separator < 1) return null;
  const id = signed.slice(0, separator);
  const signature = signed.slice(separator + 1);
  const expected = await hmac(secret, id);
  const a = encoder.encode(signature);
  const b = encoder.encode(expected);
  if (a.byteLength !== b.byteLength) return null;
  let mismatch = 0;
  for (let index = 0; index < a.byteLength; index += 1) mismatch |= (a[index] ?? 0) ^ (b[index] ?? 0);
  return mismatch === 0 ? id : null;
}

export async function hashIdentifier(secret: string, value: string, date = new Date()): Promise<string> {
  const rotation = date.toISOString().slice(0, 10);
  return hmac(secret, `${rotation}:${value}`);
}

export function cookieValue(request: Request, name: string): string | undefined {
  const cookies = request.headers.get('Cookie') ?? '';
  for (const item of cookies.split(';')) {
    const [key, ...parts] = item.trim().split('=');
    if (key === name) return decodeURIComponent(parts.join('='));
  }
  return undefined;
}

export function identityCookie(value: string): string {
  return `bbc_identity=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
}

export async function verifyTurnstile(secret: string | undefined, token: string, remoteIp: string, idempotencyKey: string): Promise<boolean> {
  if (!secret) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: remoteIp, idempotency_key: idempotencyKey });
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body
  });
  if (!response.ok) return false;
  const result: unknown = await response.json();
  return typeof result === 'object' && result !== null && 'success' in result && result.success === true;
}

export async function readJson<T>(request: Request, maxBytes = 16_384): Promise<T> {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > maxBytes) throw new Error('payload_too_large');
  const text = await request.text();
  if (encoder.encode(text).byteLength > maxBytes) throw new Error('payload_too_large');
  return JSON.parse(text) as T;
}
