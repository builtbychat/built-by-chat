import { NavLink, Outlet } from 'react-router-dom';

const nav: Array<[string, string]> = [['/', 'Home'], ['/live', 'Live'], ['/town', 'Town'], ['/roadmap', 'Roadmap'], ['/credits', 'Credits'], ['/support', 'Support']];

export function Layout() {
  return <div className="site-shell">
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Tiny Signal Club home">
        <img src="/brand/logo-icon-dark.svg" alt="" /><span>Tiny Signal Club</span>
      </NavLink>
      <nav aria-label="Primary navigation">{nav.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <a className="live-chip" href="/live"><span aria-hidden="true" /> Next: Aug 6</a>
    </header>
    <main id="main"><Outlet /></main>
    <footer>
      <div><img src="/brand/logo-icon-dark.svg" alt="" /><strong>Tiny Signal Club</strong><p>Hosted by Phaenex. Small signals become big, strange things.</p></div>
      <div><p>Tune in.<br />Choose something weird.</p><a href="/privacy">Privacy</a> · <a href="/terms">Submission terms</a></div>
    </footer>
  </div>;
}
