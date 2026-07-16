import { useEffect, useId, useRef } from 'react';

declare global {
  interface Window { turnstile?: { render: (target: string, options: { sitekey: string; action: string; callback: (token: string) => void; 'expired-callback': () => void }) => string; remove: (id: string) => void }; }
}

export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const reactId = useId().replaceAll(':', '');
  const id = `turnstile-${reactId}`;
  const widget = useRef<string | null>(null);
  useEffect(() => {
    const render = () => {
      if (!window.turnstile || widget.current) return;
      const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
      widget.current = window.turnstile.render(`#${id}`, {
        sitekey: typeof siteKey === 'string' ? siteKey : '1x00000000000000000000AA',
        action: 'turnstile-spin-v2', callback: onToken, 'expired-callback': () => onToken('')
      });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (existing) { existing.addEventListener('load', render); render(); }
    else {
      const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true; script.defer = true; script.dataset.turnstile = 'true'; script.addEventListener('load', render); document.head.appendChild(script);
    }
    return () => { if (widget.current && window.turnstile) window.turnstile.remove(widget.current); };
  }, [id, onToken]);
  return <div id={id} className="turnstile" />;
}
