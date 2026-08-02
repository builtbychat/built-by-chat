import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { futureProjectCatalog as projectCatalog, growthCatalog, scoreFutureProject } from '@tiny-signal-club/shared';
import type { GrowthExperiment } from '@tiny-signal-club/shared';
import '../styles/growth.css';

type Experiment = GrowthExperiment;
type ExperimentStatus = 'ready' | 'running' | 'learned' | 'paused';

interface EpisodeMetric {
  id: string;
  label: string;
  recordedAt: string;
  impressions: number;
  ctr: number;
  introRetention: number;
  averageViewMinutes: number;
  peakConcurrent: number;
  validVotes: number;
  returningViewers: number;
  productionHours: number;
}

const metricKey = 'tiny-signal-growth-metrics-v1';
const experimentKey = 'tiny-signal-growth-experiments-v1';
const initialForm = { label:'Founding Day',impressions:0,ctr:0,introRetention:0,averageViewMinutes:0,peakConcurrent:0,validVotes:0,returningViewers:0,productionHours:0 };

function readLocal<T>(key:string,fallback:T):T { try { const value=JSON.parse(localStorage.getItem(key)??'null') as T|null; return value??fallback; } catch { return fallback; } }

function growthAlerts(metrics:EpisodeMetric[]) {
  if (!metrics.length) return [{tone:'baseline',title:'Baseline needed',body:'Record the first episode before setting channel-relative targets. Universal “good CTR” or retention numbers are not the operating model.'}];
  const latest=metrics[0]!;
  const previous=metrics[1];
  const alerts:Array<{tone:string;title:string;body:string}>=[];
  if (latest.productionHours>12) alerts.push({tone:'warn',title:'Workload stop rule',body:`${latest.label} used ${latest.productionHours} production hours. Cut the lowest-return optional artifact before adding another experiment.`});
  if (previous && latest.impressions>previous.impressions && latest.ctr<previous.ctr) alerts.push({tone:'info',title:'Reach may be expanding',body:'Impressions increased while CTR decreased. Review traffic sources and watch time together before treating the CTR change as a loss.'});
  if (previous && latest.introRetention>0 && previous.introRetention>0 && latest.introRetention<previous.introRetention-10) alerts.push({tone:'warn',title:'Opening lost clarity',body:'Thirty-second retention dropped by more than 10 points. Check whether the opening delivered the title/thumbnail promise immediately.'});
  if (previous && latest.peakConcurrent>0 && previous.peakConcurrent>0) { const current=latest.validVotes/latest.peakConcurrent; const prior=previous.validVotes/previous.peakConcurrent; if(current<prior*.8) alerts.push({tone:'warn',title:'Participation friction',body:'Votes relative to peak concurrent viewers dropped by more than 20%. Review orientation, link visibility, errors, and poll wording.'}); }
  if (previous && latest.returningViewers>previous.returningViewers) alerts.push({tone:'good',title:'Return loop strengthened',body:`Returning viewers increased from ${previous.returningViewers} to ${latest.returningViewers}. Preserve the episode promise and next-event bridge before adding output.`});
  if (!alerts.length) alerts.push({tone:'good',title:'No automatic exception',body:'Review qualitative feedback and format-specific analytics before changing the cadence. Stable results are useful evidence.'});
  return alerts;
}

export function GrowthLab() {
  const [metrics,setMetrics]=useState<EpisodeMetric[]>(()=>readLocal(metricKey,[]));
  const [form,setForm]=useState(initialForm);
  const [statuses,setStatuses]=useState<Record<string,ExperimentStatus>>(()=>readLocal(experimentKey,{}));
  const alerts=useMemo(()=>growthAlerts(metrics),[metrics]);
  const ranked=useMemo(()=>[...projectCatalog.projects].sort((a,b)=>scoreFutureProject(b)-scoreFutureProject(a)),[]);
  const saveMetric=(event:React.FormEvent)=>{event.preventDefault();const record={...form,id:crypto.randomUUID(),recordedAt:new Date().toISOString()};const next=[record,...metrics].slice(0,12);localStorage.setItem(metricKey,JSON.stringify(next));setMetrics(next);setForm({...initialForm,label:`Episode ${next.length+1}`});};
  const setExperiment=(id:string,status:ExperimentStatus)=>{const next={...statuses,[id]:status};localStorage.setItem(experimentKey,JSON.stringify(next));setStatuses(next);};
  const metricInput=(name:keyof typeof initialForm,label:string,step='1')=><label>{label}<input name={name} type={name==='label'?'text':'number'} min={name==='label'?undefined:0} step={step} value={form[name]} onChange={(event)=>setForm({...form,[name]:name==='label'?event.target.value:Number(event.target.value)})} /></label>;
  const phaseLabels:Record<string,string>={launch:'Launch loop', 'season-one':'Season One learning',intermission:'Intermission bets',future:'Future'};

  return <section className="page growth-page">
    <header className="growth-heading"><div><p className="eyebrow coral">PRIVATE STUDIO · GROWTH LAB</p><h1>Grow the signal, not the noise.</h1><p className="lede">A channel operating system for turning discovery into understandable participation, return visits, and durable community memory—without inventing targets before a baseline or posting until the host burns out.</p></div><aside><span>NORTH STAR</span><strong>{growthCatalog.northStar}</strong><p>Followers and raw views are context. Return behavior, meaningful participation, and sustainable delivery are the product.</p><div><Link to="/playbook?view=growth">Interactive growth guide ↗</Link><Link to="/future">Public future map ↗</Link><Link to="/studio">← Studio</Link></div></aside></header>

    <section className="growth-funnel" aria-labelledby="growth-loop-title"><div className="growth-section-title"><p className="eyebrow">THE COMPOUNDING LOOP</p><h2 id="growth-loop-title">Discovery is only the first fifth.</h2></div><ol>{growthCatalog.funnel.map((stage,index)=><li key={stage.id}><b>{String(index+1).padStart(2,'0')}</b><h3>{stage.label}</h3><strong>{stage.question}</strong><ul>{stage.metrics.map(metric=><li key={metric}>{metric}</li>)}</ul></li>)}</ol></section>

    <section className="growth-scoreboard">
      <div className="growth-section-title"><p className="eyebrow coral">EPISODE EVIDENCE</p><h2>Measure against yourself.</h2><p>These entries remain in local browser storage. Enter aggregate platform and site values only—never viewer identities or raw chat exports.</p></div>
      <div className="growth-score-grid"><form onSubmit={saveMetric}><h3>Add an episode baseline</h3><div className="growth-fields">{metricInput('label','Episode / artifact')}{metricInput('impressions','YouTube impressions')}{metricInput('ctr','CTR %','0.1')}{metricInput('introRetention','30-second retention %','0.1')}{metricInput('averageViewMinutes','Average view minutes','0.1')}{metricInput('peakConcurrent','Peak concurrent')}{metricInput('validVotes','Valid final selections')}{metricInput('returningViewers','Returning viewers')}{metricInput('productionHours','Production hours','0.1')}</div><button className="button primary">Save local baseline</button></form><aside className="growth-alerts"><span>AUTOMATIC REVIEW NOTES</span>{alerts.map(alert=><article className={alert.tone} key={alert.title}><strong>{alert.title}</strong><p>{alert.body}</p></article>)}</aside></div>
      {metrics.length>0&&<div className="metric-history"><header><span>RECENT BASELINES</span><small>Newest first · local only</small></header>{metrics.map(metric=><article key={metric.id}><div><strong>{metric.label}</strong><time>{new Date(metric.recordedAt).toLocaleDateString()}</time></div><span><b>{metric.impressions}</b> impressions</span><span><b>{metric.ctr}%</b> CTR</span><span><b>{metric.introRetention}%</b> intro</span><span><b>{metric.peakConcurrent}</b> peak</span><span><b>{metric.validVotes}</b> votes</span><span><b>{metric.returningViewers}</b> returning</span><span><b>{metric.productionHours}h</b> load</span></article>)}</div>}
    </section>

    <section className="growth-timeline"><div className="growth-section-title"><p className="eyebrow">90-DAY ROADMAP</p><h2>Earn each expansion.</h2></div><div><article><span>AUG 1–5</span><h3>Launch foundation</h3><p>Approve identity and accounts, finish production infrastructure, rehearse, and establish one canonical next-event promise.</p></article><article><span>AUG 6–SEP 10</span><h3>Season One evidence</h3><p>Run the six town episodes. Protect the weekly live → recap → clip → picnic → next-show loop and change one growth variable at a time.</p></article><article><span>SEP 11–24</span><h3>Close + recover</h3><p>Finish captions, credits, backup, and retrospective. Take a recovery block. Compare formats, return behavior, participation, and production load.</p></article><article><span>LATE SEP–OCT</span><h3>Prototype finalists</h3><p>Build two one-night prototypes. A public vote chooses only among prototypes that passed clarity, accessibility, safety, and sustainability gates.</p></article></div></section>

    <section className="portfolio-rank"><div className="growth-section-title"><p className="eyebrow coral">FUTURE PROJECT RANKING</p><h2>Score opens a test, not a season.</h2><Link className="button secondary" to="/future">Open the full project map</Link></div><div>{ranked.map((project,index)=><article key={project.id}><b>{String(index+1).padStart(2,'0')}</b><div><span>{project.status} · {project.lane}</span><strong>{project.title}</strong><p>{project.prototype}</p></div><aside><strong>{scoreFutureProject(project)}</strong><i><i style={{width:`${scoreFutureProject(project)}%`}} /></i></aside></article>)}</div></section>

    <section className="experiment-board"><div className="growth-section-title"><p className="eyebrow">GROWTH EXPERIMENTS</p><h2>One hypothesis. One change. One decision rule.</h2><p>Status changes are local planning notes; the app-native catalog remains the reviewed source.</p></div><div className="experiment-columns">{['launch','season-one','intermission'].map(phase=><section key={phase}><header><span>{phaseLabels[phase]}</span><b>{growthCatalog.experiments.filter(item=>item.phase===phase).length}</b></header>{growthCatalog.experiments.filter(item=>item.phase===phase).map((experiment:Experiment)=><article key={experiment.id}><div><span>{experiment.lane} · {experiment.cost} cost</span><select name={`experiment-${experiment.id}`} aria-label={`${experiment.title} local status`} value={statuses[experiment.id]??'ready'} onChange={event=>setExperiment(experiment.id,event.target.value as ExperimentStatus)}><option value="ready">Ready</option><option value="running">Running</option><option value="learned">Learned</option><option value="paused">Paused</option></select></div><h3>{experiment.title}</h3><p>{experiment.hypothesis}</p><details><summary>Action + decision rule</summary><strong>{experiment.action}</strong><p>{experiment.decisionRule}</p><small>{experiment.primaryMetric}</small></details>{experiment.source!=='local-policy'&&<a href={experiment.source} target="_blank" rel="noreferrer">First-party guidance ↗</a>}</article>)}</section>)}</div></section>
  </section>;
}
