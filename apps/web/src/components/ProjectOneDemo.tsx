import { useMemo, useState } from 'react';
import type { Building, TownState } from '@tiny-signal-club/shared';
import { Link } from 'react-router-dom';
import { TownMap } from './TownMap';
import '../styles/demo.css';

type DemoStep = 'briefing' | 'name' | 'landmark' | 'release';

interface Choice {
  id: string;
  label: string;
  description: string;
  sampleVotes: number;
}

interface LandmarkChoice extends Choice {
  building: Omit<Building, 'id'>;
}

const nameChoices: Choice[] = [
  { id: 'mosslight', label: 'Mosslight', description: 'Soft, curious, and a little overgrown.', sampleVotes: 72 },
  { id: 'patchbay', label: 'Patchbay', description: 'A town where odd connections are the point.', sampleVotes: 61 },
  { id: 'lantern-loop', label: 'Lantern Loop', description: 'Warm lights, late walks, and a circular main road.', sampleVotes: 48 }
];

const landmarkChoices: LandmarkChoice[] = [
  {
    id: 'public-garden', label: 'Public Garden', description: 'A shared green space with room for future stories.', sampleVotes: 64,
    building: { name: 'Public Garden', kind: 'garden', x: 1, y: 1, width: 2, height: 2, color: '#78e8cb', status: 'built' }
  },
  {
    id: 'clock-tower', label: 'Clock Tower', description: 'A visible meeting point with a very tiny bell.', sampleVotes: 53,
    building: { name: 'Clock Tower', kind: 'tower', x: 1, y: 1, width: 2, height: 2, color: '#ff5b3d', status: 'built' }
  },
  {
    id: 'tiny-library', label: 'Tiny Library', description: 'One quiet room for notes, maps, and borrowed mysteries.', sampleVotes: 67,
    building: { name: 'Tiny Library', kind: 'library', x: 1, y: 1, width: 2, height: 2, color: '#c8ef52', status: 'built' }
  }
];

const baseTown: TownState = {
  width: 12,
  height: 8,
  name: 'Tiny Internet Town',
  version: 1,
  buildings: [
    { id: 'demo-hall', name: 'Town Hall', kind: 'civic', x: 4, y: 2, width: 2, height: 2, color: '#ff5b3d', status: 'built' },
    { id: 'demo-lot-a', name: 'Empty Lot A', kind: 'empty', x: 1, y: 1, width: 2, height: 2, color: '#26345c', status: 'planned' },
    { id: 'demo-lot-b', name: 'Empty Lot B', kind: 'empty', x: 8, y: 1, width: 2, height: 2, color: '#26345c', status: 'planned' },
    { id: 'demo-lot-c', name: 'Empty Lot C', kind: 'empty', x: 8, y: 5, width: 2, height: 2, color: '#26345c', status: 'planned' }
  ],
  residents: [{ id: 'demo-pip', name: 'Pip', role: 'Town caretaker', x: 6, y: 4, color: '#78e8cb' }],
  events: []
};

const runSteps: Array<{ id: DemoStep; time: string; label: string }> = [
  { id: 'briefing', time: '0:00', label: 'Set the promise' },
  { id: 'name', time: '0:02', label: 'Name vote' },
  { id: 'landmark', time: '0:04', label: 'Landmark vote' },
  { id: 'release', time: '0:06', label: 'Build + remember' }
];

function DemoPoll({
  eyebrow,
  question,
  choices,
  selected,
  onSelect,
  onContinue
}: {
  eyebrow: string;
  question: string;
  choices: Choice[];
  selected: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  const total = choices.reduce((sum, choice) => sum + choice.sampleVotes, 0) + (selected ? 1 : 0);
  return <section className="demo-poll" aria-labelledby={`demo-${eyebrow.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="demo-panel-label"><span className="signal" /> {eyebrow}<span>SIMULATED ROOM · {total}</span></div>
    <h2 id={`demo-${eyebrow.toLowerCase().replaceAll(' ', '-')}`}>{question}</h2>
    <p className="demo-helper">Choose as if you were in the live audience. Nothing is submitted or saved.</p>
    <div className="demo-options">
      {choices.map((choice) => {
        const count = choice.sampleVotes + (selected === choice.id ? 1 : 0);
        const percent = Math.round(count / total * 100);
        return <label key={choice.id} className={selected === choice.id ? 'selected' : ''}>
          <input type="radio" name={eyebrow} checked={selected === choice.id} onChange={() => onSelect(choice.id)} />
          <span className="demo-choice-copy"><strong>{choice.label}</strong><small>{choice.description}</small></span>
          <span className="demo-tally" aria-label={`${percent} percent in the simulated room`}><b>{percent}%</b><i><i style={{ width: `${percent}%` }} /></i></span>
        </label>;
      })}
    </div>
    <button className="button primary" disabled={!selected} onClick={onContinue}>Lock this demo choice <span aria-hidden="true">→</span></button>
  </section>;
}

export function ProjectOneDemo() {
  const [step, setStep] = useState<DemoStep>('briefing');
  const [nameId, setNameId] = useState('');
  const [landmarkId, setLandmarkId] = useState('');
  const [runNumber, setRunNumber] = useState(1);

  const name = nameChoices.find((choice) => choice.id === nameId);
  const landmark = landmarkChoices.find((choice) => choice.id === landmarkId);
  const activeIndex = runSteps.findIndex((item) => item.id === step);

  const town = useMemo<TownState>(() => {
    const buildings = landmark
      ? [
          ...baseTown.buildings.filter((building) => building.id !== 'demo-lot-a'),
          { ...landmark.building, id: `demo-${landmark.id}` }
        ]
      : baseTown.buildings;
    return {
      ...baseTown,
      name: name?.label ?? baseTown.name,
      version: step === 'release' ? 2 : 1,
      buildings,
      events: step === 'release' && name && landmark ? [{
        id: `demo-founding-${runNumber}`,
        type: 'founding',
        title: 'Founding Day',
        description: `${name.label} was named and ${landmark.label} became its first audience-chosen landmark.`,
        occurredAt: 'Demo run'
      }] : []
    };
  }, [landmark, name, runNumber, step]);

  const reset = () => {
    setNameId('');
    setLandmarkId('');
    setRunNumber((value) => value + 1);
    setStep('briefing');
  };

  return <section className="page demo-page">
    <div className="demo-heading">
      <div>
        <p className="eyebrow coral">PROJECT ONE · INTERACTIVE PILOT</p>
        <h1>Run Founding Day in five minutes.</h1>
        <p className="lede">This standalone demo shows the core loop of Tiny Internet Town: the host frames a bounded choice, the audience votes, the winning decision changes the map, and the town keeps a public memory of what happened.</p>
      </div>
      <aside><span>DEMO MODE</span><strong>No account. No backend. No pretend live data.</strong><p>The totals are illustrative; your choices stay in this browser tab.</p></aside>
    </div>

    <div className="demo-workbench">
      <aside className="demo-run-rail" aria-label="Demo run of show">
        <div><span className="demo-live-dot" /> LOCAL REHEARSAL</div>
        <ol>
          {runSteps.map((item, index) => <li key={item.id} className={index === activeIndex ? 'active' : index < activeIndex ? 'complete' : ''}>
            <span>{index < activeIndex ? '✓' : index + 1}</span><time>{item.time}</time><strong>{item.label}</strong>
          </li>)}
        </ol>
        <p>Real episode: 2 hours<br />This walkthrough: about 5 minutes</p>
      </aside>

      <div className="demo-stage">
        <div className="demo-stage-copy" aria-live="polite">
          {step === 'briefing' && <section className="demo-briefing">
            <div className="demo-panel-label">HOST BRIEF · EPISODE 01</div>
            <h2>Tonight, this map stops belonging to me.</h2>
            <p>The audience gets two decisions with clear boundaries: the town’s name and the first landmark placed in Lot A. Town Hall, Pip, the river, and the remaining lots stay intact.</p>
            <dl>
              <div><dt>Audience controls</dt><dd>Name + first landmark</dd></div>
              <div><dt>Host protects</dt><dd>Scope, safety + accessibility</dd></div>
              <div><dt>Ships tonight</dt><dd>Map version 2 + founding event</dd></div>
            </dl>
            <button className="button primary" onClick={() => setStep('name')}>Start the local episode <span aria-hidden="true">→</span></button>
          </section>}

          {step === 'name' && <DemoPoll eyebrow="VOTE 1 OF 2" question="What should we call this place?" choices={nameChoices} selected={nameId} onSelect={setNameId} onContinue={() => setStep('landmark')} />}

          {step === 'landmark' && <DemoPoll eyebrow="VOTE 2 OF 2" question={`What should ${name?.label ?? 'the town'} build first?`} choices={landmarkChoices} selected={landmarkId} onSelect={setLandmarkId} onContinue={() => setStep('release')} />}

          {step === 'release' && name && landmark && <section className="demo-release">
            <div className="demo-panel-label"><span className="demo-release-check">✓</span> RELEASE APPLIED · MAP V2</div>
            <h2>Welcome to {name.label}.</h2>
            <p>{landmark.label} now occupies Lot A. Two empty lots remain for later episodes, and Pip is still keeping watch.</p>
            <div className="demo-receipt" aria-label="Demo decision receipt">
              <div><span>DECISION 01</span><strong>{name.label}</strong><small>Audience demo vote</small></div>
              <div><span>DECISION 02</span><strong>{landmark.label}</strong><small>Audience demo vote</small></div>
              <div><span>RELEASE</span><strong>Town snapshot v2</strong><small>Founding event recorded</small></div>
              <div><span>CHECKS</span><strong>Scope + labels</strong><small>Two lots preserved</small></div>
            </div>
            <div className="demo-release-actions"><button className="button primary" onClick={reset}>Run another outcome</button><Link className="button secondary" to="/town">Explore the production map</Link></div>
          </section>}
        </div>

        <aside className="demo-map-panel">
          <div className="demo-map-header"><span>BUILD PREVIEW</span><strong>{town.name}</strong><small>MAP VERSION {town.version}</small></div>
          <TownMap town={town} />
          <p>{landmark ? `${landmark.label} is ${step === 'release' ? 'built' : 'being previewed'} in Lot A.` : 'Three lots are waiting. Choose what happens to Lot A.'}</p>
        </aside>
      </div>
    </div>

    <section className="demo-explainer">
      <p className="eyebrow">WHAT THE DEMO PROVES</p>
      <h2>One small signal becomes a durable project change.</h2>
      <div>
        <article><b>01</b><h3>Bounded agency</h3><p>People make consequential choices, but every option fits the episode’s time, safety, and accessibility envelope.</p></article>
        <article><b>02</b><h3>Visible making</h3><p>The host turns the verified result into code, art, and story while explaining what changed and what did not.</p></article>
        <article><b>03</b><h3>Public memory</h3><p>The result, map snapshot, release note, and credits make the audience’s effect inspectable after the stream ends.</p></article>
      </div>
    </section>

    <section className="demo-operations" id="run-it">
      <div>
        <p className="eyebrow coral">RUN THE DEMO</p>
        <h2>One command after install.</h2>
        <p>This route deliberately makes no API calls, so the interactive walkthrough works before Cloudflare, D1, Turnstile, OBS, or streaming accounts are configured.</p>
      </div>
      <pre aria-label="Commands to run the demo"><code>npm install{`\n`}npm run demo</code></pre>
      <p>Open <code>http://localhost:5173/demo</code>. For the real local stack, follow the repository README to generate Cloudflare types, migrate and seed D1, then run <code>npm run dev</code>.</p>
    </section>
  </section>;
}
