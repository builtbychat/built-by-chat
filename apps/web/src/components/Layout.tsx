import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const nav: Array<[string, string]> = [['/', 'Home'], ['/demo', 'Demo'], ['/live', 'Live'], ['/town', 'Town'], ['/roadmap', 'Roadmap'], ['/making', 'Making'], ['/playbook', 'Playbook'], ['/credits', 'Credits'], ['/feedback', 'Feedback'], ['/support', 'Support']];

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': { title: 'Tiny Signal Club — You Vote, We Build', description: 'Tiny Internet Town is a live illustrated world shaped by verified audience choices.' },
  '/demo': { title: 'Founding Day Demo — Tiny Signal Club', description: 'Run a local decision-to-reveal loop and turn two audience choices into a versioned town artifact.' },
  '/live': { title: 'Live Room — Tiny Signal Club', description: 'Follow the current build objective and cast the authoritative site vote during a live show.' },
  '/town': { title: 'Tiny Internet Town Map — Tiny Signal Club', description: 'Explore the current versioned town map, its residents, built landmarks, and open lots.' },
  '/roadmap': { title: 'Season One Roadmap — Tiny Signal Club', description: 'See the six-episode path for building Tiny Internet Town with its audience.' },
  '/making': { title: 'How We Make — Tiny Signal Club', description: 'Inspect the human craft, AI boundaries, release proofs, disclosures, and lessons behind each artifact.' },
  '/playbook': { title: 'Living Playbook — Tiny Signal Club', description: 'Operate the launch, project journey, growth experiments, rehearsal system, and decision guardrails.' },
  '/future': { title: 'Future Project Map — Tiny Signal Club', description: 'Explore ten possible future projects as bounded prototypes waiting for evidence, not announcements.' },
  '/credits': { title: 'Community Credits — Tiny Signal Club', description: 'A durable ledger for approved ideas, episode decisions, contributors, testers, and moderators.' },
  '/feedback': { title: 'Post-Show Pulse — Tiny Signal Club', description: 'Share a private clarity, agency, and accessibility pulse after a Tiny Signal Club show.' },
  '/support': { title: 'Support the Signal — Tiny Signal Club', description: 'Submit an idea for moderation and read the project’s free-participation and no-pay-to-play boundaries.' },
  '/studio': { title: 'Studio Control Room — Tiny Signal Club', description: 'Operate show cues, viewer catch-up state, workload evidence, and the private prompt ledger.' },
  '/studio/growth': { title: 'Growth Lab — Tiny Signal Club', description: 'Track aggregate episode evidence, workload alerts, growth experiments, and future-project readiness.' },
  '/studio/rehearsal': { title: 'Rehearsal Lab — Tiny Signal Club', description: 'Practice show failures, reject unsafe shortcuts, and preserve sanitized recovery evidence.' },
  '/privacy': { title: 'Privacy — Tiny Signal Club', description: 'Read how browser identity, voting, submissions, and operational records are handled.' },
  '/terms': { title: 'Submission Terms — Tiny Signal Club', description: 'Read the plain-language terms for contributing ideas to Tiny Signal Club.' }
};

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = routeMetadata[pathname] ?? { title: 'Signal Not Found — Tiny Signal Club', description: 'Return to the Tiny Signal Club home, town map, or living playbook.' };
    document.title = metadata.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', metadata.description);
  }, [pathname]);

  return <div className="site-shell">
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Tiny Signal Club home">
        <img className="brand-wordmark-image" src="/brand/logo-wordmark-dark.svg" alt="" />
      </NavLink>
      <nav aria-label="Primary navigation">{nav.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <NavLink className="live-chip" to="/live"><span aria-hidden="true" /> Next: Aug 6</NavLink>
    </header>
    <main id="main"><Outlet /></main>
    <footer>
      <div><img src="/brand/logo-icon-dark.svg" alt="" /><strong>Tiny Signal Club</strong><p>Hosted by Phaenex. Small signals become big, strange things.</p></div>
      <div><p>Tune in.<br />Choose something weird.</p><Link to="/making">How we make</Link> · <Link to="/privacy">Privacy</Link> · <Link to="/terms">Submission terms</Link></div>
    </footer>
  </div>;
}
