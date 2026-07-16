import { createRemoteJWKSet, jwtVerify } from 'jose';

interface AccessEnv {
  ENVIRONMENT: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function keySet(teamDomain: string): ReturnType<typeof createRemoteJWKSet> {
  const existing = keySets.get(teamDomain);
  if (existing) return existing;
  const created = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
  keySets.set(teamDomain, created);
  return created;
}

export async function authenticateStudio(request: Request, env: AccessEnv): Promise<string | null> {
  const headerEmail = request.headers.get('Cf-Access-Authenticated-User-Email')?.trim().toLowerCase();
  if (env.ENVIRONMENT === 'development') return headerEmail || null;

  const teamDomain = env.ACCESS_TEAM_DOMAIN?.replace(/\/$/, '');
  const audience = env.ACCESS_AUD;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!teamDomain || !audience || teamDomain.includes('replace-before-access') || audience === 'replace-before-access' || !token) return null;

  try {
    const { payload } = await jwtVerify(token, keySet(teamDomain), { issuer: teamDomain, audience });
    const tokenEmail = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    if (!tokenEmail || (headerEmail && headerEmail !== tokenEmail)) return null;
    return tokenEmail;
  } catch {
    return null;
  }
}
