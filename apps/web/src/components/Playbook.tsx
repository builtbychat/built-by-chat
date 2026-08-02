import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { futureProjectCatalog, growthCatalog, scoreFutureProject } from '@tiny-signal-club/shared';
import type { ProjectScoreName } from '@tiny-signal-club/shared';
import progressCatalog from '../../../../docs/launch/PROGRESS.json';
import { craftReleaseChecks, craftVerdict, disclosureMaterials, makingStages } from '../data/craft';
import '../styles/playbook.css';
import '../styles/playbook-craft.css';

type View = 'overview' | 'launch' | 'project-one' | 'craft' | 'growth' | 'future' | 'rehearsal' | 'safety' | 'run';
type TaskFilter = 'remaining' | 'all' | 'done';
type Task = {label:string;status:string};

const views:Array<{id:View;label:string;kicker:string;description:string}> = [
  {id:'overview',label:'Mission control',kicker:'START HERE',description:'Current state, next moves, and every working surface.'},
  {id:'launch',label:'Launch path',kicker:'83 / 113',description:'Live workstreams, gates, evidence, and local focus markers.'},
  {id:'project-one',label:'Project One',kicker:'6 EPISODES',description:'The town season, audience contract, and weekly production loop.'},
  {id:'craft',label:'Human craft + AI',kicker:'RELEASE GATE',description:'Authorship, visible revision, disclosure, and learning receipts.'},
  {id:'growth',label:'Channel growth',kicker:'12 TESTS',description:'Discovery-to-belonging system and sustainable publishing engine.'},
  {id:'future',label:'Future projects',kicker:'10 IDEAS',description:'Prototype gates, weighted evaluator, and portfolio ranking.'},
  {id:'rehearsal',label:'Rehearsal',kicker:'6 SCENARIOS',description:'Bad-minute practice, recovery rules, and evidence.'},
  {id:'safety',label:'Decision guardrails',kicker:'NON-NEGOTIABLE',description:'Vote authority, privacy, rights, and pause rules.'},
  {id:'run',label:'Run center',kicker:'COMMANDS',description:'Copy, launch, test, diagnose, and verify the system.'}
];

const episodePlan = [
  ['AUG 06','Founding Day','Name the town and choose the first landmark.'],
  ['AUG 13','Main Street','Choose a business, owner, and public benefit.'],
  ['AUG 20','Meet the Neighbors','Choose housing, relationships, and a shared need.'],
  ['AUG 27','First Crisis','Choose an absurd reversible problem and response.'],
  ['SEP 03','Town Council','Choose a priority and one playful law.'],
  ['SEP 10','First Festival','Celebrate, inspect the history, and choose what comes next.']
];

const localChecks:Array<[string,string]> = [
  ['identity','Identity direction explicitly approved'],['accounts','Account owners, 2FA, and recovery verified'],
  ['cloudflare','Production Turnstile, Access, email, and alerts exercised'],['obs','OBS scenes, overlays, and isolated recording tracks verified'],
  ['moderators','Lead and backup moderator rehearsed commands'],['failures','All failure and recovery drills timed'],
  ['unlisted','Unlisted dual-platform rehearsal passed'],['go','Owner recorded final go / no-go decision']
];

const commands = [
  {group:'START',label:'Open the whole local app',command:'npm run dev',note:'Worker-backed local development surface.'},
  {group:'DEMO',label:'Open Founding Day',command:'npm run demo',note:'Standalone decision-to-town demo with no credentials.'},
  {group:'STATUS',label:'Launch readiness',command:'npm run status',note:'Prints every tracked workstream and remaining blocker.'},
  {group:'SIMULATE',label:'Run 250 rehearsals',command:'npm run rehearsal:sim -- --runs=250',note:'Reference, guardrail, and randomized operator scenarios.'},
  {group:'STRATEGY',label:'Validate portfolio',command:'npm run growth:status',note:'Checks scores, gates, experiments, funnel, and sources.'},
  {group:'VERIFY',label:'Full repository check',command:'npm run check',note:'Types, lint, unit tests, simulations, validation, and build.'},
  {group:'BROWSER',label:'All viewport journeys',command:'npm run test:e2e',note:'Desktop, tablet, and mobile end-to-end tests.'},
  {group:'DIAGNOSE',label:'Local dependency check',command:'npm run diagnose',note:'Reports local tooling and configuration readiness.'},
  {group:'OBS',label:'Prepare OBS package',command:'npm run obs:prepare',note:'Validates the sanitized scene and overlay package.'},
  {group:'RECORD',label:'Prepare a recording',command:'npm run recording:prepare',note:'Checks media tools, destination, and storage before a show.'}
];

const scoreLabels:Record<ProjectScoreName,string>={audienceAgency:'Audience agency',visualPayoff:'Visual payoff',episodeEngine:'Episode engine',clipPotential:'Clip potential',safety:'Safety fit',hostSustainability:'Host sustainability'};
const guardrails = [
  {id:'uncertain',label:'Vote result is uncertain',answer:'Freeze the decision. Preserve the original poll and receipts. Explain the pause; never infer a winner from chat volume.'},
  {id:'unsafe',label:'Winning option becomes unsafe',answer:'Do not implement it. Apply the published unsafe-result policy, explain the boundary, and use a reviewed fallback or new vote.'},
  {id:'platform',label:'One stream platform fails',answer:'Keep the authoritative site state intact. Continue only if the remaining experience and recording are healthy; use reviewed status messaging.'},
  {id:'identity',label:'A viewer asks for vote proof',answer:'Show aggregate counts and the immutable result snapshot. Do not expose identities, raw IPs, private moderation material, or individual behavior.'},
  {id:'supporter',label:'A supporter asks for influence',answer:'Decline creative or voting advantage. Support is optional and can never buy votes, ownership, moderation influence, or priority.'}
];

function readLocal<T>(key:string,fallback:T):T { try { const value=JSON.parse(localStorage.getItem(key)??'null') as T|null; return value??fallback; } catch { return fallback; } }

export function Playbook() {
  const [params,setParams]=useSearchParams();
  const requested=params.get('view');
  const active:View=views.some(item=>item.id===requested)?requested as View:'overview';
  const [query,setQuery]=useState('');
  const [taskFilter,setTaskFilter]=useState<TaskFilter>('remaining');
  const [focusChecks,setFocusChecks]=useState<Record<string,boolean>>(()=>readLocal('tiny-signal-playbook-checks-v1',{}));
  const [evidenceChecks,setEvidenceChecks]=useState<Record<string,boolean>>(()=>readLocal('tiny-signal-playbook-evidence-v1',{}));
  const [copied,setCopied]=useState('');
  const [craftChecks,setCraftChecks]=useState<Record<string,boolean>>(()=>readLocal('tiny-signal-craft-gate-v1',{}));
  const [guardrail,setGuardrail]=useState('uncertain');
  const [scores,setScores]=useState<Record<ProjectScoreName,number>>({audienceAgency:3,visualPayoff:3,episodeEngine:3,clipPotential:3,safety:3,hostSustainability:3});

  const tasks=useMemo(()=>progressCatalog.workstreams.flatMap(workstream=>workstream.tasks.map(task=>({...task,workstream:workstream.name}))),[]);
  const completed=tasks.filter(task=>task.status==='done').length;
  const remaining=tasks.length-completed;
  const percent=Math.round(completed/tasks.length*100);
  const launchAt=new Date('2026-08-07T00:00:00Z').getTime();
  const days=Math.max(0,Math.ceil((launchAt-Date.now())/86400000));
  const prototypeScore=Math.round(Object.entries(futureProjectCatalog.weights).reduce((sum,[name,weight])=>sum+scores[name as ProjectScoreName]*weight,0)/5);
  const prototypeVerdict=prototypeScore>=85?'Ready for a bounded prototype':prototypeScore>=70?'Revise weak dimensions before testing':'Keep as a seed idea';
  const releaseVerdict=craftVerdict(craftChecks);

  const searchResults=useMemo(()=>{
    const needle=query.trim().toLowerCase();
    if(!needle) return [];
    const entry=(view:View,label:string,meta:string)=>({view,label,meta});
    const entries=[
      ...views.map(item=>entry(item.id,item.label,item.description)),
      ...tasks.map(task=>entry('launch',task.label,task.workstream)),
      ...futureProjectCatalog.projects.map(project=>entry('future',project.title,project.premise)),
      ...growthCatalog.experiments.map(experiment=>entry('growth',experiment.title,experiment.hypothesis)),
      ...disclosureMaterials.map(material=>entry('craft',material.label,material.use)),
      ...commands.map(command=>entry('run',command.label,command.command))
    ];
    return entries.filter(entry=>`${entry.label} ${entry.meta}`.toLowerCase().includes(needle)).slice(0,8);
  },[query,tasks]);

  const setView=(view:View)=>{setParams(view==='overview'?{}:{view});setQuery('');window.scrollTo({top:0,behavior:'smooth'});};
  const toggleStored=(key:string,state:Record<string,boolean>,setter:(next:Record<string,boolean>)=>void,storageKey:string)=>{const next={...state,[key]:!state[key]};localStorage.setItem(storageKey,JSON.stringify(next));setter(next);};
  const copy=async(command:string)=>{try{await navigator.clipboard.writeText(command);setCopied(command);window.setTimeout(()=>setCopied(''),1600);}catch{setCopied('Copy unavailable');}};

  const renderOverview=()=> <div className="playbook-view overview-view">
    <header className="playbook-hero"><div><p className="eyebrow coral">LIVING PRODUCTION SYSTEM · UPDATED {progressCatalog.lastVerified}</p><h1>Everything needed to make the signal real.</h1><p className="lede">Navigate the plan, operate the launch, practice failures, evaluate future projects, and measure growth here. The playbook remembers local working state without changing official evidence.</p><div className="playbook-actions"><button className="button primary" onClick={()=>setView('launch')}>Open the critical path <span>→</span></button><Link className="button secondary" to="/demo">Run Project One</Link></div></div><aside><span>LAUNCH READINESS</span><strong>{percent}%</strong><i><i style={{width:`${percent}%`}} /></i><p>{completed} verified · {remaining} gates remain</p><b>{days===0?'Launch window reached':`${days} days to premiere target`}</b></aside></header>
    <section className="playbook-block"><div className="playbook-title"><p className="eyebrow">DO THE NEXT TRUE THING</p><h2>The launch is blocked by reality, not more ideas.</h2></div><div className="next-grid">{progressCatalog.workstreams.filter(stream=>stream.tasks.some(task=>task.status!=='done')).slice(0,6).map((stream,index)=>{const open=stream.tasks.filter(task=>task.status!=='done');return <button key={stream.name} onClick={()=>setView('launch')}><span>{String(index+1).padStart(2,'0')}</span><strong>{stream.name}</strong><p>{open[0]?.label}</p><small>{open.length} gate{open.length===1?'':'s'} remaining</small></button>})}</div></section>
    <section className="playbook-block"><div className="playbook-title"><p className="eyebrow coral">WORKING SURFACES</p><h2>Open the thing. Do the thing.</h2></div><div className="surface-grid"><Link to="/demo"><span>EXPERIENCE</span><h3>Founding Day demo</h3><p>Make two choices and watch the town become a versioned artifact.</p><b>Launch demo →</b></Link><Link to="/studio/rehearsal"><span>PRACTICE</span><h3>Rehearsal Lab</h3><p>Inject an incident, test unsafe actions, and run the reference recovery.</p><b>Start practice →</b></Link><Link to="/studio/growth"><span>MEASURE</span><h3>Growth Lab</h3><p>Record aggregate evidence and get relative alerts without fake benchmarks.</p><b>Open tracker →</b></Link><Link to="/future"><span>IMAGINE</span><h3>Future Map</h3><p>Inspect the ten-project portfolio, prototype scopes, scores, and risks.</p><b>Explore futures →</b></Link></div></section>
  </div>;

  const renderLaunch=()=> <div className="playbook-view launch-view"><header className="view-heading"><p className="eyebrow coral">LAUNCH CONTROL</p><h1>{remaining} gates between here and live.</h1><p className="lede">Repository status is read-only here. Check “evidence in hand” as a local working marker; the official gate changes only after its evidence is reviewed and the source status is updated.</p></header>
    <section className="launch-dashboard"><article><span>COMPLETE</span><strong>{completed}</strong><p>of {tasks.length} tracked tasks</p></article><article><span>REMAINING</span><strong>{remaining}</strong><p>external or evidence gates</p></article><article><span>WORKSTREAMS</span><strong>{progressCatalog.workstreams.filter(stream=>stream.tasks.every(task=>task.status==='done')).length}/{progressCatalog.workstreams.length}</strong><p>fully complete</p></article><article><span>TARGET</span><strong>AUG 06</strong><p>7:00 PM Central</p></article></section>
    <section className="focus-strip"><div><p className="eyebrow">PREMIERE EVIDENCE STRIP</p><h2>Eight things that must be true.</h2></div><div>{localChecks.map(([id,label])=><label key={id} className={focusChecks[id]?'checked':''}><input name={`focus-${id}`} type="checkbox" checked={Boolean(focusChecks[id])} onChange={()=>toggleStored(id,focusChecks,setFocusChecks,'tiny-signal-playbook-checks-v1')} /><span>{label}</span></label>)}</div><p>{Object.values(focusChecks).filter(Boolean).length}/{localChecks.length} locally confirmed · does not override official status</p></section>
    <section className="workstream-board"><header><div><p className="eyebrow coral">ALL WORKSTREAMS</p><h2>Inspect the evidence path.</h2></div><div className="segmented" aria-label="Task filter">{(['remaining','all','done'] as TaskFilter[]).map(filter=><button className={taskFilter===filter?'active':''} key={filter} onClick={()=>setTaskFilter(filter)}>{filter}</button>)}</div></header>{progressCatalog.workstreams.map((stream,index)=>{const visible=stream.tasks.filter(task=>taskFilter==='all'||(taskFilter==='done'?task.status==='done':task.status!=='done'));if(!visible.length)return null;const count=stream.tasks.filter(task=>task.status==='done').length;return <details key={stream.name} open={index<3&&taskFilter==='remaining'}><summary><span>{String(index+1).padStart(2,'0')}</span><div><strong>{stream.name}</strong><i><i style={{width:`${count/stream.tasks.length*100}%`}} /></i></div><b>{count}/{stream.tasks.length}</b></summary><div className="stream-tasks">{visible.map((task:Task)=>{const key=`${stream.name}:${task.label}`;return <article key={task.label} className={task.status}><i>{task.status==='done'?'✓':'!'}</i><p>{task.label}</p>{task.status!=='done'&&<label><input name={`evidence-${key}`} type="checkbox" checked={Boolean(evidenceChecks[key])} onChange={()=>toggleStored(key,evidenceChecks,setEvidenceChecks,'tiny-signal-playbook-evidence-v1')} /> evidence in hand</label>}</article>})}</div></details>})}</section>
  </div>;

  const renderProjectOne=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">PROJECT ONE · TINY INTERNET TOWN</p><h1>Six nights. One accumulating town.</h1><p className="lede">Every episode closes the same trustworthy loop: orient, choose, verify, build, inspect, remember, and point to the next consequence.</p><div className="playbook-actions"><Link className="button primary" to="/demo">Run Founding Day</Link><Link className="button secondary" to="/town">Inspect the town</Link></div></header>
    <section className="loop-diagram"><p className="eyebrow">THE AUDIENCE CONTRACT</p><ol>{['Orient','Choose','Verify','Build','Inspect','Remember'].map((label,index)=><li key={label}><span>{String(index+1).padStart(2,'0')}</span><strong>{label}</strong><p>{['Show the current artifact, objective, and authority.','Offer bounded neutral options with a close time and tie rule.','Freeze and read the authoritative site result.','Turn the verified decision into a visible change.','Test mobile, keyboard, clarity, safety, and rollback.','Publish a snapshot, receipt, credit, and next question.'][index]}</p></li>)}</ol></section>
    <section className="episode-timeline"><div className="playbook-title"><p className="eyebrow coral">SEASON ONE</p><h2>The whole arc at a glance.</h2></div>{episodePlan.map(([date,title,promise],index)=><article key={title}><b>{String(index+1).padStart(2,'0')}</b><time>{date}</time><div><h3>{title}</h3><p>{promise}</p></div><span>{index===0?'PREMIERE':'PLANNED'}</span></article>)}</section>
    <section className="definition-card"><span>PROJECT ONE IS COMPLETE WHEN</span><h2>A viewer can understand, choose, witness, and revisit the town—and the host can safely repeat the process.</h2><div><Link to="/roadmap">Open the public roadmap →</Link><button onClick={()=>setView('rehearsal')}>Practice recovery →</button><button onClick={()=>setView('growth')}>Plan the return loop →</button></div></section>
  </div>;

  const renderCraft=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">HUMAN CRAFT + AI</p><h1>Make the judgment visible.</h1><p className="lede">AI can accelerate an attempt. It cannot provide audience agency, taste, responsibility, proof, or a reason to publish. This operating gate makes those human parts observable before a release leaves the workshop.</p><div className="playbook-actions"><Link className="button primary" to="/making">Open the public making journey</Link></div></header>
    <section className="craft-principles"><article><span>POSITION</span><h2>AI is in the workshop—not in charge.</h2><p>Lead with the audience choice and finished artifact. Disclose the tool role without making the tool the spectacle.</p></article><article><span>AUTHORSHIP</span><h2>Phaenex remains accountable.</h2><p>Name the interpretation, revisions, rejections, tests, and final editorial decision. A prompt is not authorship evidence.</p></article><article><span>PACE</span><h2>Fewer things, worth keeping.</h2><p>No output quota. Every release needs a durable home, a coherent relationship to the project, and a lesson worth returning to.</p></article></section>
    <section className="operator-craft-gate"><header><div><p className="eyebrow">RELEASE GATE</p><h2>Eight proofs before editorial approval.</h2></div><aside className={releaseVerdict.passed===craftReleaseChecks.length?'ready':releaseVerdict.passed>=5?'revise':'hold'}><strong>{releaseVerdict.passed}/{craftReleaseChecks.length}</strong><span>{releaseVerdict.label}</span><p>{releaseVerdict.detail}</p></aside></header><div>{craftReleaseChecks.map((check,index)=><label className={craftChecks[check.id]?'checked':''} key={check.id}><input name={`operator-craft-${check.id}`} type="checkbox" checked={Boolean(craftChecks[check.id])} onChange={()=>toggleStored(check.id,craftChecks,setCraftChecks,'tiny-signal-craft-gate-v1')} /><b>{String(index+1).padStart(2,'0')}</b><span><strong>{check.label}</strong><p>{check.question}</p><small>{check.failureAction}</small></span></label>)}</div></section>
    <section className="craft-journey-mini"><div><p className="eyebrow coral">EPISODE JOURNEY</p><h2>Learning is part of the shipped artifact.</h2></div><ol>{makingStages.map((stage,index)=><li key={stage.label}><b>{String(index+1).padStart(2,'0')}</b><strong>{stage.label}</strong><span>{stage.proof}</span></li>)}</ol></section>
    <section className="operator-materials"><header><div><p className="eyebrow">COPY BANK</p><h2>Reviewed language, ready for verified facts.</h2></div><Link to="/making#learning-log">Open public learning log →</Link></header><div>{disclosureMaterials.map(material=><article key={material.id}><span>{material.use}</span><h3>{material.label}</h3><p>{material.copy}</p><button onClick={()=>void copy(material.copy)}>{copied===material.copy?'Copied':'Copy material'}</button></article>)}</div></section>
  </div>;

  const renderGrowth=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">CHANNEL GROWTH</p><h1>Return is the product.</h1><p className="lede">Raw reach is only useful when newcomers understand the promise, participate meaningfully, return for the consequence, and can see their contribution preserved.</p><div className="playbook-actions"><Link className="button primary" to="/studio/growth">Open the evidence tracker</Link></div></header>
    <section className="growth-loop-mini"><p className="eyebrow">THE COMPOUNDING LOOP</p><div>{growthCatalog.funnel.map((stage,index)=><article key={stage.id}><b>{String(index+1).padStart(2,'0')}</b><h3>{stage.label}</h3><p>{stage.question}</p><small>{stage.metrics.join(' · ')}</small></article>)}</div></section>
    <section className="weekly-engine"><div><p className="eyebrow coral">MINIMUM VIABLE PUBLISHING</p><h2>One artifact feeds the next.</h2></div><ol><li><b>THU</b><span>Live decision + build</span></li><li><b>FRI</b><span>Verified recap + captions</span></li><li><b>SAT</b><span>One decision → reveal clip</span></li><li><b>SUN</b><span>Playtest + town hall</span></li><li><b>NEXT</b><span>Ship one finding as proof</span></li></ol><aside><span>STOP RULE</span><strong>Over 12 production hours?</strong><p>Remove the lowest-return optional artifact before adding an experiment.</p></aside></section>
    <section className="experiment-summary"><header><div><p className="eyebrow">EXPERIMENT BACKLOG</p><h2>Test a claim, not a vibe.</h2></div><b>{growthCatalog.experiments.length} reviewed experiments</b></header><div>{growthCatalog.experiments.map(experiment=><article key={experiment.id}><span>{experiment.phase} · {experiment.cost}</span><h3>{experiment.title}</h3><p>{experiment.hypothesis}</p><small>{experiment.primaryMetric}</small></article>)}</div><Link className="button secondary" to="/studio/growth">Run and track experiments →</Link></section>
  </div>;

  const renderFuture=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">FUTURE PROJECT LAB</p><h1>Score earns a test—not a promise.</h1><p className="lede">Use the evaluator for a fresh concept, then compare it with the reviewed portfolio. A high number still requires a bounded prototype, safety controls, and real workload evidence.</p><div className="playbook-actions"><Link className="button secondary" to="/future">Open the public portfolio</Link></div></header>
    <section className="prototype-tool"><div className="prototype-inputs"><p className="eyebrow">QUICK PROTOTYPE EVALUATOR</p><h2>How strong is the format?</h2>{(Object.keys(scoreLabels) as ProjectScoreName[]).map(name=><label key={name}><span><strong>{scoreLabels[name]}</strong><b>{scores[name]}/5 · {futureProjectCatalog.weights[name]}%</b></span><input name={`prototype-${name}`} type="range" min="1" max="5" step="1" value={scores[name]} onChange={event=>setScores({...scores,[name]:Number(event.target.value)})} /></label>)}</div><aside aria-live="polite"><span>WEIGHTED SCORE</span><strong>{prototypeScore}</strong><i><i style={{height:`${prototypeScore}%`}} /></i><h3>{prototypeVerdict}</h3><p>{prototypeScore>=85?'Write the audience controls, artifact, fallback, and maximum workload. Then run one local decision-to-reveal loop.':'Improve the lowest score before asking the audience to invest attention.'}</p></aside></section>
    <section className="rank-table"><header><div><p className="eyebrow coral">CURRENT PORTFOLIO</p><h2>Reviewed concepts.</h2></div><Link to="/future">Inspect all controls and risks →</Link></header>{[...futureProjectCatalog.projects].sort((a,b)=>scoreFutureProject(b)-scoreFutureProject(a)).map((project,index)=><article key={project.id}><b>{String(index+1).padStart(2,'0')}</b><div><span>{project.status} · {project.lane}</span><h3>{project.title}</h3><p>{project.prototype}</p></div><strong>{scoreFutureProject(project)}</strong></article>)}</section>
  </div>;

  const renderRehearsal=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">REHEARSAL SYSTEM</p><h1>Practice the bad minute before it is public.</h1><p className="lede">A clean show proves almost nothing about recovery. The lab injects vote loss, microphone loss, platform outage, credential exposure, and uncertain results while rejecting unsafe shortcuts.</p><div className="playbook-actions"><Link className="button primary" to="/studio/rehearsal">Open Rehearsal Lab</Link><button className="button secondary" onClick={()=>setView('run')}>Copy simulation command</button></div></header>
    <section className="rehearsal-grid">{[['Vote path loss','Freeze decision · preserve state · show fallback'],['Microphone loss','Acknowledge · switch source · confirm return'],['One-platform outage','Protect recording · assess remaining experience'],['Credential exposure','Cut source · rotate secret · preserve evidence'],['Uncertain result','Never infer winner · preserve original poll'],['Clean show','Verify cues, recording, workload, and closeout']].map(([title,response],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><h3>{title}</h3><p>{response}</p></article>)}</section>
    <section className="definition-card warning"><span>REFERENCE STANDARD</span><h2>The safe path must be rehearsed, timed, observable, and easier to choose than an unsafe improvisation.</h2><div><button onClick={()=>setView('safety')}>Open decision guardrails →</button><button onClick={()=>setView('run')}>Open run center →</button></div></section>
  </div>;

  const renderSafety=()=>{const activeGuardrail=guardrails.find(item=>item.id===guardrail)!;return <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">DECISION GUARDRAILS</p><h1>Trust survives the weird parts.</h1><p className="lede">The audience controls bounded creative choices. The site owns the official result. The host owns safety, legality, privacy, accessibility, and whether the system must pause.</p></header>
    <section className="guardrail-tool"><div><p className="eyebrow">WHAT JUST HAPPENED?</p><h2>Choose a situation.</h2>{guardrails.map(item=><button className={guardrail===item.id?'active':''} key={item.id} onClick={()=>setGuardrail(item.id)}><span>{item.label}</span><b>→</b></button>)}</div><aside aria-live="polite"><span>OPERATING RULE</span><h3>{activeGuardrail.label}</h3><p>{activeGuardrail.answer}</p><strong>Pause beats a fabricated result.</strong></aside></section>
    <section className="contract-grid">{[['VOTE AUTHORITY','The protected site result is authoritative. Chat reactions are never a substitute.'],['PRIVACY','Use aggregates and pseudonymous receipts. Never publish identities, IPs, or private moderation data.'],['RIGHTS','Only ship original, licensed, or verified-permission material with recorded provenance.'],['ACCESS','Keyboard, captions, reduced motion, contrast, orientation, and fallback are part of the artifact.'],['SUPPORT','Money never buys votes, ownership, moderation influence, or creative priority.'],['HOST LIMIT','Sustainability is a launch gate. Cut scope before compressing recovery or safety.']].map(([title,body])=><article key={title}><span>{title}</span><p>{body}</p></article>)}</section>
  </div>};

  const renderRun=()=> <div className="playbook-view"><header className="view-heading"><p className="eyebrow coral">RUN CENTER</p><h1>Operate without hunting through files.</h1><p className="lede">Copy a reviewed command, run it from the repository root, and return to the relevant visual surface for results. Nothing here deploys, purchases, publishes, messages, or goes live.</p></header><section className="command-grid">{commands.map(item=><article key={item.command}><span>{item.group}</span><h3>{item.label}</h3><code>{item.command}</code><p>{item.note}</p><button onClick={()=>void copy(item.command)}>{copied===item.command?'Copied':'Copy command'}</button></article>)}</section><p className="copy-status" aria-live="polite">{copied==='Copy unavailable'?'Clipboard access is unavailable in this browser.':''}</p></div>;

  const renderView=()=>({overview:renderOverview,launch:renderLaunch,'project-one':renderProjectOne,craft:renderCraft,growth:renderGrowth,future:renderFuture,rehearsal:renderRehearsal,safety:renderSafety,run:renderRun}[active]());

  return <section className="playbook-page">
    <aside className="playbook-menu"><header><p>STUDIO PLAYBOOK</p><strong>Living system</strong><span><i className="signal" /> {percent}% verified</span></header><nav aria-label="Playbook sections">{views.map(item=>{const kicker=item.id==='launch'?`${completed} / ${tasks.length}`:item.id==='growth'?`${growthCatalog.experiments.length} TESTS`:item.id==='future'?`${futureProjectCatalog.projects.length} IDEAS`:item.id==='project-one'?`${episodePlan.length} EPISODES`:item.kicker;return <button key={item.id} className={active===item.id?'active':''} aria-current={active===item.id?'page':undefined} onClick={()=>setView(item.id)}><span>{kicker}</span><strong>{item.label}</strong></button>})}</nav><footer><Link to="/studio">Open Studio ↗</Link><small>Local working state stays in this browser.</small></footer></aside>
    <div className="playbook-main"><div className="playbook-search"><label><span>⌕</span><input name="playbook-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search tasks, projects, experiments, commands…" aria-label="Search the playbook" /></label><b>{views.find(item=>item.id===active)?.label}</b>{searchResults.length>0&&<div className="search-results">{searchResults.map((result,index)=><button key={`${result.label}-${index}`} onClick={()=>setView(result.view)}><strong>{result.label}</strong><span>{result.meta}</span></button>)}</div>}</div>{renderView()}</div>
  </section>;
}
