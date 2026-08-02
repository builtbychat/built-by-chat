import { expect, test } from '@playwright/test';
test('landing page exposes a working keyboard skip target', async ({page}) => { await page.goto('/'); await expect(page.getByRole('heading',{name:/You vote/i})).toBeVisible(); const skip=page.getByText('Skip to content'); await skip.focus(); await expect(skip).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#main')).toBeInViewport(); });
test('town map exposes an accessible name', async ({page}) => { await page.goto('/town'); await expect(page.getByRole('img',{name:/Tiny Internet Town map/i})).toBeVisible(); });
test('empty live room recovers without blocking navigation', async ({page}) => { await page.goto('/live'); await expect(page.getByRole('heading',{name:/town is getting ready/i})).toBeVisible(); await expect(page.getByRole('navigation')).toBeVisible(); });
test('reduced motion is usable', async ({page}) => { await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('/'); await expect(page.getByRole('link',{name:/Enter the live room/i})).toBeVisible(); });
test('Project One demo turns two local choices into a versioned town release', async ({page}) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading',{name:/Run Founding Day/i})).toBeVisible();
  await page.getByRole('button',{name:/Start the local episode/i}).click();
  await page.getByRole('radio',{name:/Mosslight/i}).check();
  await page.getByRole('button',{name:/Lock this demo choice/i}).click();
  await page.getByRole('radio',{name:/Tiny Library/i}).check();
  await page.getByRole('button',{name:/Lock this demo choice/i}).click();
  await expect(page.getByRole('heading',{name:'Welcome to Mosslight.'})).toBeVisible();
  await expect(page.getByRole('img',{name:/Mosslight map/i})).toBeVisible();
  await expect(page.getByLabel('Demo decision receipt')).toContainText('Town snapshot v2');
});
test('rehearsal lab runs the reference recovery and rejects unsafe actions', async ({page}) => {
  await page.goto('/studio/rehearsal');
  await expect(page.getByRole('heading',{name:/Practice the bad minute/i})).toBeVisible();
  await page.getByRole('button',{name:'Start rehearsal'}).click();
  await page.getByRole('button',{name:'Inject incident now'}).click();
  await page.getByRole('button',{name:'Use chat reactions as the winner'}).click();
  await expect(page.getByText(/Use chat reactions as the winner rejected/i)).toBeVisible();
  await page.getByRole('button',{name:'Auto-run reference'}).click();
  await expect(page.getByText(/100\/100 · 0 rejected actions/i)).toBeVisible();
  await expect(page.getByText('PASS',{exact:true}).last()).toBeVisible();
});
test('future map presents prototypes without turning them into announcements', async ({page}) => {
  await page.goto('/future');
  await expect(page.getByRole('heading',{name:/What could the club build next/i})).toBeVisible();
  await expect(page.getByText(/prototypes waiting for evidence—not announcements/i)).toBeVisible();
  await expect(page.getByRole('heading',{name:'One-Button Space Program'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'The Signal Arcade'})).toBeVisible();
  await expect(page.getByText(/Finish the town\. Rest\. Review evidence/i)).toBeVisible();
});
test('growth lab records aggregate evidence and triggers the workload stop rule locally', async ({page}) => {
  await page.goto('/studio/growth');
  await expect(page.getByRole('heading',{name:/Grow the signal, not the noise/i})).toBeVisible();
  await expect(page.getByText('Baseline needed')).toBeVisible();
  await page.getByLabel('Episode / artifact').fill('Founding Day rehearsal');
  await page.getByLabel('Production hours').fill('14');
  await page.getByRole('button',{name:'Save local baseline'}).click();
  await expect(page.getByText('Workload stop rule',{exact:true})).toBeVisible();
  await expect(page.getByText(/14 production hours/i)).toBeVisible();
  await page.getByLabel('Result-first episode packaging local status').selectOption('running');
  await expect(page.getByLabel('Result-first episode packaging local status')).toHaveValue('running');
});
test('living playbook navigates, searches, scores, and remembers local launch evidence', async ({page}) => {
  await page.goto('/playbook');
  await expect(page.getByRole('heading',{name:/Everything needed to make the signal real/i})).toBeVisible();
  await page.getByRole('button',{name:/Open the critical path/i}).click();
  await expect(page.getByRole('heading',{name:/30 gates between here and live/i})).toBeVisible();
  await page.getByLabel('Identity direction explicitly approved').check();
  await page.reload();
  await expect(page.getByLabel('Identity direction explicitly approved')).toBeChecked();
  await page.getByLabel('Search the playbook').fill('One-Button Space Program');
  await page.getByRole('button',{name:/One-Button Space Program/i}).click();
  await expect(page.getByRole('heading',{name:/Score earns a test/i})).toBeVisible();
  await page.getByLabel('Audience agency').fill('5');
  await expect(page.getByText('Revise weak dimensions before testing')).toBeVisible();
  await page.getByRole('button',{name:'Run center'}).click();
  await expect(page.getByRole('heading',{name:/Operate without hunting through files/i})).toBeVisible();
  await expect(page.getByText('npm run check')).toBeVisible();
});
test('making journey gates releases, explains disclosure, and preserves a real lesson locally', async ({page}) => {
  await page.goto('/making');
  await expect(page.getByRole('heading',{name:/AI is in the workshop/i})).toBeVisible();
  await expect(page.locator('.making-hero aside')).toContainText('People decide.');
  await expect(page.getByText('Hold the artifact',{exact:true})).toBeVisible();
  for (const label of ['Specific promise','Real audience consequence','Named human responsibility','Visible revision','Clear provenance and rights','Independent verification','Durable artifact','Worth the attention and workload']) await page.getByLabel(label).check();
  await expect(page.getByText('Ready for human release review',{exact:true})).toBeVisible();
  await page.getByLabel(/Realistic synthetic person/i).check();
  await expect(page.getByRole('heading',{name:'Use the platform disclosure'})).toBeVisible();
  await page.getByLabel('What did we notice?').fill('The first draft looked polished but did not explain the audience choice.');
  await page.getByLabel('What did we try?').fill('Opened with the verified decision and named the human interpretation.');
  await page.getByLabel('What did we actually learn?').fill('Provenance is clearer when it is part of the story, not a footer apology.');
  await page.getByLabel('What is the smallest honest next test?').fill('Ask one newcomer what they believe the audience changed.');
  await page.getByRole('button',{name:'Save local reflection'}).click();
  await expect(page.locator('.learning-log>header aside')).toContainText('1');
  await expect(page.locator('.learning-log>header aside')).toContainText('local reflection preserved');
  await page.reload();
  await expect(page.getByText(/Provenance is clearer/i)).toBeVisible();
  await page.goto('/playbook?view=craft');
  await expect(page.getByRole('heading',{name:/Make the judgment visible/i})).toBeVisible();
  await expect(page.getByText('8/8')).toBeVisible();
});
test('animated intro reaches a branded, audio-safe ready state', async ({page}) => { await page.goto('/overlays/intro.html?motion=reduced&episode=Episode%2099'); await expect(page.getByRole('main')).toHaveAttribute('class','content'); await expect(page.getByRole('img',{name:/Tiny Signal Club/i})).toBeVisible(); await expect(page.getByRole('heading',{name:/Tiny Internet Town/i})).toBeVisible(); await expect(page.getByText('Episode 99')).toBeVisible(); await expect(page.locator('body')).toHaveAttribute('data-ready','true'); await expect(page.locator('body')).not.toHaveAttribute('data-audio','blocked'); });
test('animated outro safely applies editable copy', async ({page}) => { await page.goto('/overlays/outro.html?motion=reduced&event=Community%20Picnic&date=Tomorrow'); await expect(page.getByRole('heading',{name:/Signal made real/i})).toBeVisible(); await expect(page.getByText('Community Picnic')).toBeVisible(); await expect(page.getByText('Tomorrow')).toBeVisible(); });
test('studio cockpit keeps one clock, health row, viewer context, and emergency controls visible', async ({page}) => {
  await page.route('**/studio/api/prompts/runs', route => route.fulfill({ json: [] }));
  await page.route('**/studio/api/workload', route => route.fulfill({ json: { entries:[],fourWeekMinutes:0,averageStress:0,averageRecovery:0 } }));
  await page.route('**/studio/api/control', route => route.fulfill({ json: {
    show:{id:'show-001',episodeNumber:1,title:'Founding Day',objective:'Choose the first landmark.',startsAt:'2026-08-07T00:00:00Z',status:'scheduled'},
    control:{showId:'show-001',phase:'pre_show',catchUp:'The map and first landmark vote are ready.',updatedAt:'2026-07-16T18:00:00Z'},
    cues:[{id:'cue-1',showId:'show-001',label:'Verify camera, mic, recording, both streams, and overlay',kind:'checkpoint',targetSeconds:0,status:'pending',displayOrder:0}],
    live:{show:null,poll:null,counts:{},connectedViewers:0},health:{database:'ok',coordinator:'ok',accessConfigured:false,secretsConfigured:false},serverNow:new Date().toISOString()
  }}));
  await page.goto('/studio');
  await expect(page.getByRole('heading',{name:'Studio'})).toBeVisible();
  await expect(page.getByText('00:00:00')).toBeVisible();
  await expect(page.getByLabel('System health')).toContainText('Database · ok');
  await expect(page.getByLabel('Viewer catch-up message')).toHaveValue(/landmark vote/);
  await expect(page.getByRole('button',{name:'Technical pause'})).toBeVisible();
  await expect(page.getByText(/Verify camera, mic/)).toBeVisible();
  await expect(page.getByText('0.0 hours recorded')).toBeVisible();
});
test('post-show pulse is keyboard-readable and explains its privacy boundary', async ({page}) => {
  await page.route('**/api/feedback/context', route => route.fulfill({ json:{ show:{id:'show-001',episodeNumber:1,title:'Founding Day',objective:'Choose.',startsAt:'2026-08-07T00:00:00Z',status:'ended'},accepting:true } }));
  await page.route('https://challenges.cloudflare.com/**', route => route.abort());
  await page.goto('/feedback');
  await expect(page.getByRole('heading',{name:/Did the signal make sense/i})).toBeVisible();
  await expect(page.getByText(/no public identity or raw IP/i)).toBeVisible();
  await expect(page.getByRole('group',{name:/understood what was happening/i})).toBeVisible();
  await page.getByRole('radio',{name:'5'}).first().check();
  await expect(page.getByRole('button',{name:/Save my pulse/i})).toBeDisabled();
});

const routedSurfaces: Array<[string, RegExp]> = [
  ['/', /You vote/i],
  ['/demo', /Run Founding Day/i],
  ['/live', /town is getting ready|Founding Day/i],
  ['/town', /Tiny Internet Town/i],
  ['/roadmap', /Six nights to make a town/i],
  ['/making', /AI is in the workshop/i],
  ['/playbook', /Everything needed to make the signal real/i],
  ['/playbook?view=launch', /gates between here and live/i],
  ['/playbook?view=craft', /Make the judgment visible/i],
  ['/playbook?view=future', /Score earns a test/i],
  ['/future', /What could the club build next/i],
  ['/credits', /Every good town remembers/i],
  ['/feedback', /Did the signal make sense/i],
  ['/support', /Participation stays free/i],
  ['/studio', /Studio/i],
  ['/studio/growth', /Grow the signal/i],
  ['/studio/rehearsal', /Practice the bad minute/i],
  ['/privacy', /Privacy, without the fog/i],
  ['/terms', /Ideas can join the club/i],
  ['/this-route-should-not-exist', /This path does not lead to town/i]
];

test('every routed surface renders a named, intact, viewport-safe document', async ({page}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  for (const [route, heading] of routedSurfaces) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), `${route} should return a successful document`).toBeTruthy();
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/.+ — Tiny Signal Club|Tiny Signal Club — .+/);
    await page.waitForFunction(() => [...document.images].every(image => image.complete));

    const audit = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map(element => element.id);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
        brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc || image.src),
        unnamedFieldCount: document.querySelectorAll('input:not([name]):not([id]), textarea:not([name]):not([id]), select:not([name]):not([id])').length
      };
    });

    expect(audit.overflow, `${route} should not overflow the document viewport`).toBeLessThanOrEqual(1);
    expect(audit.duplicateIds, `${route} should not contain duplicate IDs`).toEqual([]);
    expect(audit.brokenImages, `${route} should not contain broken images`).toEqual([]);
    expect(audit.unnamedFieldCount, `${route} form fields should expose stable names or IDs`).toBe(0);
  }

  expect(pageErrors).toEqual([]);
});

test('every browser-source surface loads without broken assets or document overflow', async ({page}) => {
  const surfaces = [
    '/overlays/intro.html?motion=reduced&episode=Episode%2001',
    '/overlays/outro.html?motion=reduced',
    '/overlays/lower-third.html',
    '/overlays/vote.html',
    '/overlays/identity-lab.html',
    '/overlays/wildcard-lab.html'
  ];
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  for (const route of surfaces) {
    const response = await page.goto(route, { waitUntil: 'load' });
    expect(response?.ok(), `${route} should return a successful document`).toBeTruthy();
    const audit = await page.evaluate(() => ({
      mainLandmarks: document.querySelectorAll('main').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc || image.src)
    }));
    expect(audit.mainLandmarks, `${route} should expose one main landmark`).toBe(1);
    expect(audit.overflow, `${route} should not overflow its browser-source canvas`).toBeLessThanOrEqual(1);
    expect(audit.brokenImages, `${route} should not contain broken images`).toEqual([]);
  }

  expect(pageErrors).toEqual([]);
});

test('crawler and calendar endpoints do not fall through to the app shell', async ({request}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toContain('Disallow: /studio');

  const llms = await request.get('/llms.txt');
  expect(llms.ok()).toBeTruthy();
  expect(llms.headers()['content-type']).toContain('text/plain');
  expect(await llms.text()).toContain('# Tiny Signal Club');

  const calendar = await request.get('/tiny-signal-club.ics');
  expect(calendar.ok()).toBeTruthy();
  expect(await calendar.text()).toContain('BEGIN:VCALENDAR');
});
