import { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiCan, aiNever, craftReleaseChecks, craftVerdict, disclosureMaterials, makingStages } from '../data/craft';
import '../styles/making.css';

interface LearningEntry {
  id: string;
  episode: string;
  noticed: string;
  tried: string;
  learned: string;
  next: string;
  recordedAt: string;
}

const learningKey='tiny-signal-learning-log-v1';
const craftKey='tiny-signal-craft-gate-v1';
const emptyReflection={episode:'Founding Day',noticed:'',tried:'',learned:'',next:''};

function readLocal<T>(key:string,fallback:T):T { try { const value=JSON.parse(localStorage.getItem(key)??'null') as T|null; return value??fallback; } catch { return fallback; } }

export function MakingJourney() {
  const [checks,setChecks]=useState<Record<string,boolean>>(()=>readLocal(craftKey,{}));
  const [entries,setEntries]=useState<LearningEntry[]>(()=>readLocal(learningKey,[]));
  const [reflection,setReflection]=useState(emptyReflection);
  const [copied,setCopied]=useState('');
  const [disclosureCase,setDisclosureCase]=useState<'assistance'|'fantasy'|'synthetic-audio'|'realistic'>('assistance');
  const verdict=craftVerdict(checks);

  const toggle=(id:string)=>{const next={...checks,[id]:!checks[id]};localStorage.setItem(craftKey,JSON.stringify(next));setChecks(next);};
  const saveReflection=(event:React.FormEvent)=>{event.preventDefault();const entry={...reflection,id:crypto.randomUUID(),recordedAt:new Date().toISOString()};const next=[entry,...entries].slice(0,20);localStorage.setItem(learningKey,JSON.stringify(next));setEntries(next);setReflection({...emptyReflection,episode:reflection.episode});};
  const copy=async(id:string,value:string)=>{try{await navigator.clipboard.writeText(value);setCopied(id);window.setTimeout(()=>setCopied(''),1600);}catch{setCopied('error');}};
  const disclosure={
    assistance:{label:'Platform label usually not required',body:'Outlines, draft code, title or thumbnail help, caption creation, and other production assistance generally do not require YouTube’s altered-content setting. Tiny Signal Club still names the AI role in its own process receipt.'},
    fantasy:{label:'Platform label usually not required',body:'Clearly fantastical or unrealistic animation generally falls outside YouTube’s mandatory altered-content disclosure. Keep project-level provenance because trust is broader than minimum compliance.'},
    'synthetic-audio':{label:'Use the platform disclosure',body:'YouTube’s current guidance includes synthetically generated music and cloning someone else’s voice among examples that require disclosure. Tiny Signal Club does not clone another person’s voice and records music provenance before release.'},
    realistic:{label:'Use the platform disclosure',body:'If synthetic media appears realistic, alters a real person, place, or event, or depicts a realistic scene that did not occur, mark the YouTube AI-use/altered-content field. Tiny Signal Club also prohibits impersonation and unapproved likeness use.'}
  }[disclosureCase];

  return <section className="page making-page">
    <header className="making-hero"><div><p className="eyebrow coral">HOW WE MAKE · A PUBLIC CREATIVE CONTRACT</p><h1>AI is in the workshop. It is not in charge.</h1><p className="lede">Tiny Signal Club is a place to recover the interesting part of making: choosing, trying, noticing what is wrong, revising with taste, testing with other people, and teaching back what we learned.</p><div className="playbook-actions"><a className="button primary" href="#release-gate">Test an artifact</a><a className="button secondary" href="#learning-log">Record a lesson</a><Link className="button secondary" to="/playbook?view=craft">Operator craft plan</Link></div></div><aside><span>THE SHORT VERSION</span><strong>People decide.<br />Tools assist.<br />People remain responsible.</strong><p>No fake audience. No prompt-to-publish pipeline. No output quota. No hiding where consequential synthetic material came from.</p></aside></header>

    <section className="making-thesis"><p className="eyebrow">THE POINT IS NOT TO WATCH A MACHINE PRODUCE</p><h2>The point is to watch a community learn how an idea becomes something worth keeping.</h2><div>{[['01','Agency','A verified audience choice creates a real constraint.'],['02','Judgment','Phaenex interprets the signal and owns the editorial decision.'],['03','Craft','Drafts are inspected, rejected, revised, and integrated into a coherent artifact.'],['04','Proof','Behavior, access, safety, rights, and audience understanding are checked.'],['05','Memory','The result, provenance, correction history, and lesson remain inspectable.']].map(([number,title,body])=><article key={title}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>

    <section className="making-cycle"><div className="making-title"><p className="eyebrow coral">THE LEARNING JOURNEY</p><h2>Every episode moves through seven honest questions.</h2></div><ol>{makingStages.map((stage,index)=><li key={stage.label}><b>{String(index+1).padStart(2,'0')}</b><div><h3>{stage.label}</h3><strong>{stage.question}</strong><p>{stage.proof}</p></div></li>)}</ol></section>

    <section className="tool-boundary"><div><p className="eyebrow">AI MAY</p><h2>Help inside a bounded workshop.</h2><ul>{aiCan.map(item=><li key={item}>{item}</li>)}</ul></div><div><p className="eyebrow coral">AI NEVER</p><h2>Becomes the audience, authority, or excuse.</h2><ul>{aiNever.map(item=><li key={item}>{item}</li>)}</ul></div></section>

    <section className="craft-gate" id="release-gate"><header><div><p className="eyebrow coral">ANTI-SLOP RELEASE GATE</p><h2>Would this deserve attention without the AI story?</h2><p>Check only what has evidence. This stays in local browser storage and never turns an artifact into an approved release by itself.</p></div><aside className={verdict.passed===craftReleaseChecks.length?'ready':verdict.passed>=5?'revise':'hold'} aria-live="polite"><span>{verdict.passed}/{craftReleaseChecks.length} PROOFS</span><strong>{verdict.label}</strong><p>{verdict.detail}</p></aside></header><div>{craftReleaseChecks.map((check,index)=><label key={check.id} className={checks[check.id]?'checked':''}><input name={`craft-${check.id}`} type="checkbox" checked={Boolean(checks[check.id])} onChange={()=>toggle(check.id)} /><b>{String(index+1).padStart(2,'0')}</b><span><strong>{check.label}</strong><p>{check.question}</p><small>If missing: {check.failureAction}</small></span></label>)}</div></section>

    <section className="disclosure-tool"><div><p className="eyebrow">PLATFORM DISCLOSURE CHECK</p><h2>What kind of assistance appears in the release?</h2><div role="radiogroup" aria-label="Synthetic content type"><label><input type="radio" name="disclosure" checked={disclosureCase==='assistance'} onChange={()=>setDisclosureCase('assistance')} /><span>Backstage production assistance</span></label><label><input type="radio" name="disclosure" checked={disclosureCase==='fantasy'} onChange={()=>setDisclosureCase('fantasy')} /><span>Clearly fantastical animation or world</span></label><label><input type="radio" name="disclosure" checked={disclosureCase==='synthetic-audio'} onChange={()=>setDisclosureCase('synthetic-audio')} /><span>Synthetically generated music or another person’s cloned voice</span></label><label><input type="radio" name="disclosure" checked={disclosureCase==='realistic'} onChange={()=>setDisclosureCase('realistic')} /><span>Realistic synthetic person, place, event, audio, or scene</span></label></div></div><aside aria-live="polite"><span>CURRENT YOUTUBE OPERATING ANSWER</span><h3>{disclosure.label}</h3><p>{disclosure.body}</p><div><a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noreferrer">YouTube official guidance ↗</a><a href="https://help.twitch.tv/s/article/content-classification-labels" target="_blank" rel="noreferrer">Twitch label guidance ↗</a><a href="https://safety.twitch.tv/articles/en_US/Knowledge/Community-Guidelines" target="_blank" rel="noreferrer">Twitch community rules ↗</a></div><small>Twitch’s current classification-label list does not include a general AI label, while its community rules prohibit impersonation. Platform rules are the minimum; the project process receipt stays visible in every case.</small></aside></section>

    <section className="material-bank"><header><div><p className="eyebrow coral">READY-TO-USE MATERIAL</p><h2>Say exactly what happened.</h2></div><p>Replace brackets with verified facts. Never claim a rejection, test, or audience decision that is not in the record.</p></header><div>{disclosureMaterials.map(material=><article key={material.id}><span>{material.use}</span><h3>{material.label}</h3><pre>{material.copy}</pre><button onClick={()=>void copy(material.id,material.copy)}>{copied===material.id?'Copied':'Copy material'}</button></article>)}</div><p aria-live="polite">{copied==='error'?'Clipboard access is unavailable in this browser.':''}</p></section>

    <section className="learning-log" id="learning-log"><header><div><p className="eyebrow">LOCAL LEARNING LOG</p><h2>Notice. Try. Learn. Return.</h2><p>This is a private reflection tool stored only in this browser. It deliberately asks for a lesson and a next test—not a content-performance victory lap.</p></div><aside><span>{entries.length}</span><p>local reflection{entries.length===1?'':'s'} preserved</p></aside></header><form onSubmit={saveReflection}><label>Episode or artifact<input name="reflection-episode" required maxLength={80} value={reflection.episode} onChange={event=>setReflection({...reflection,episode:event.target.value})} /></label><label>What did we notice?<textarea name="reflection-noticed" required maxLength={400} value={reflection.noticed} onChange={event=>setReflection({...reflection,noticed:event.target.value})} /></label><label>What did we try?<textarea name="reflection-tried" required maxLength={400} value={reflection.tried} onChange={event=>setReflection({...reflection,tried:event.target.value})} /></label><label>What did we actually learn?<textarea name="reflection-learned" required maxLength={400} value={reflection.learned} onChange={event=>setReflection({...reflection,learned:event.target.value})} /></label><label>What is the smallest honest next test?<textarea name="reflection-next" required maxLength={400} value={reflection.next} onChange={event=>setReflection({...reflection,next:event.target.value})} /></label><button className="button primary">Save local reflection</button></form>{entries.length>0&&<div className="learning-history">{entries.map(entry=><article key={entry.id}><header><strong>{entry.episode}</strong><time>{new Date(entry.recordedAt).toLocaleDateString()}</time></header><div><span>NOTICED</span><p>{entry.noticed}</p><span>TRIED</span><p>{entry.tried}</p><span>LEARNED</span><p>{entry.learned}</p><span>NEXT TEST</span><p>{entry.next}</p></div></article>)}</div>}</section>

    <section className="making-close"><p className="eyebrow coral">THE CULTURAL BET</p><h2>Maybe the interesting future is not effortless creation. Maybe it is learning to pay attention again—with better tools and stronger responsibility.</h2><Link className="button primary" to="/demo">See the first decision loop</Link></section>
  </section>;
}
