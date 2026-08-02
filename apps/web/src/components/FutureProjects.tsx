import { Link } from 'react-router-dom';
import { futureProjectCatalog as projectCatalog, scoreFutureProject } from '@tiny-signal-club/shared';
import type { ProjectScoreName } from '@tiny-signal-club/shared';
import '../styles/future.css';

type ScoreName = ProjectScoreName;

const scoreLabels: Record<ScoreName,string> = {
  audienceAgency: 'Audience agency',
  visualPayoff: 'Visual payoff',
  episodeEngine: 'Episode engine',
  clipPotential: 'Clip potential',
  safety: 'Safety fit',
  hostSustainability: 'Host sustainability'
};

export function FutureProjects() {
  const projects = [...projectCatalog.projects].sort((a,b) => scoreFutureProject(b)-scoreFutureProject(a));
  return <section className="page future-page">
    <header className="future-heading">
      <div><p className="eyebrow coral">THE SIGNAL GARDEN · POSSIBLE FUTURES</p><h1>What could the club build next?</h1><p className="lede">These are prototypes waiting for evidence—not announcements. Every idea must create meaningful audience agency, a visible artifact, a repeatable episode engine, and a workload the host can actually sustain.</p></div>
      <aside><span>HOW A PROJECT EARNS A SEASON</span><ol><li>Paper scope</li><li>One-night prototype</li><li>Three-night mini-series</li><li>Full season only after evidence</li></ol><Link to="/playbook?view=future">Open the interactive project lab ↗</Link><Link to="/roadmap">← Season One roadmap</Link></aside>
    </header>

    <section className="future-principles">
      <p className="eyebrow">SELECTION FRAMEWORK</p><h2>High scores open a prototype. They do not promise a launch.</h2>
      <div>{Object.entries(scoreLabels).map(([name,label]) => <article key={name}><span>{projectCatalog.weights[name as keyof typeof projectCatalog.weights]}%</span><strong>{label}</strong><p>{({audienceAgency:'Do viewers make consequential bounded choices?',visualPayoff:'Does each episode visibly transform the artifact?',episodeEngine:'Can the premise create several distinct nights?',clipPotential:'Can one moment explain itself outside the stream?',safety:'Can rights, privacy, moderation, and accessibility be controlled?',hostSustainability:'Can the work fit the weekly production budget?'})[name as ScoreName]}</p></article>)}</div>
    </section>

    <section className="project-portfolio" aria-labelledby="portfolio-title">
      <div className="portfolio-heading"><div><p className="eyebrow coral">TEN POSSIBLE PROJECTS</p><h2 id="portfolio-title">A portfolio, not a queue.</h2></div><p>The status label includes risk and readiness judgment that a numeric score cannot capture. The audience can choose among projects only after each finalist passes its prototype gate.</p></div>
      <div className="project-grid">
        {projects.map((project,index) => <article key={project.id} className={`future-project ${project.status}`}>
          <header><span>{String(index+1).padStart(2,'0')} · {project.lane}</span><div><b>{project.status}</b><strong>{scoreFutureProject(project)}</strong></div></header>
          <h3>{project.title}</h3><p className="project-premise">{project.premise}</p>
          <div className="project-meta"><span>{project.horizon}</span><span>{project.format}</span></div>
          <section><span>AUDIENCE CONTROLS</span><div className="project-chips">{project.audienceControls.map((control) => <i key={control}>{control}</i>)}</div></section>
          <section><span>PROTOTYPE NIGHT</span><p>{project.prototype}</p></section>
          <section><span>WHY IT COULD GROW</span><p>{project.growthHook}</p></section>
          <details><summary>Risks to solve before a public vote</summary><ul>{project.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></details>
          <footer>{Object.entries(project.scores).map(([name,value]) => <div key={name} title={scoreLabels[name as ScoreName]}><i style={{height:`${value*20}%`}} /><span>{name.replace(/[A-Z]/g,(letter) => ` ${letter.toLowerCase()}`).split(' ')[0]}</span></div>)}</footer>
        </article>)}
      </div>
    </section>

    <section className="future-decision">
      <p className="eyebrow coral">THE HONEST NEXT DECISION</p><h2>Finish the town. Rest. Review evidence. Prototype two finalists.</h2><p>After Season One, the club should compare a continuity option—The Next District—with two new-format prototypes such as The Signal Arcade and One-Button Space Program. Only prototypes that remain understandable, safe, accessible, and sustainable become audience-facing finalists.</p>
      <Link className="button primary" to="/demo">Try the Project One loop</Link>
    </section>
  </section>;
}
