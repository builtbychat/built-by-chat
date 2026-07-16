import { NavLink, Outlet } from 'react-router-dom';

const nav: Array<[string, string]> = [['/', 'Home'], ['/live', 'Live'], ['/town', 'Town'], ['/roadmap', 'Roadmap'], ['/credits', 'Credits'], ['/support', 'Support']];

export function Layout() {
  return <div className="site-shell">
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Built by Chat home">
        <img src="/brand/logo-icon-dark.svg" alt="" /><span>Built by Chat</span>
      </NavLink>
      <nav aria-label="Primary navigation">{nav.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <a className="live-chip" href="/live"><span aria-hidden="true" /> Next: Aug 6</a>
    </header>
    <main id="main"><Outlet /></main>
    <footer>
      <div><img src="/brand/logo-icon-dark.svg" alt="" /><strong>Built by Chat</strong><p>Hosted by Phaenex. Built in public with the internet.</p></div>
      <div><p>The internet decides.<br />We build it live.</p><a href="/privacy">Privacy</a> · <a href="/terms">Submission terms</a> · <a href="mailto:security@builtbychat.com">Security</a></div>
    </footer>
  </div>;
}
