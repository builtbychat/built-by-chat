import { expect, test } from '@playwright/test';
test('landing page exposes a working keyboard skip target', async ({page}) => { await page.goto('/'); await expect(page.getByRole('heading',{name:/You vote/i})).toBeVisible(); const skip=page.getByText('Skip to content'); await skip.focus(); await expect(skip).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#main')).toBeInViewport(); });
test('town map exposes an accessible name', async ({page}) => { await page.goto('/town'); await expect(page.getByRole('img',{name:/Tiny Internet Town map/i})).toBeVisible(); });
test('empty live room recovers without blocking navigation', async ({page}) => { await page.goto('/live'); await expect(page.getByRole('heading',{name:/town is getting ready/i})).toBeVisible(); await expect(page.getByRole('navigation')).toBeVisible(); });
test('reduced motion is usable', async ({page}) => { await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('/'); await expect(page.getByRole('link',{name:/Enter the live room/i})).toBeVisible(); });
test('animated intro reaches a branded, audio-safe ready state', async ({page}) => { await page.goto('/overlays/intro.html?motion=reduced&episode=Episode%2099'); await expect(page.getByRole('main')).toHaveAttribute('class','content'); await expect(page.getByRole('heading',{name:/Tiny Signal Club/i})).toBeVisible(); await expect(page.getByText('Episode 99')).toBeVisible(); await expect(page.locator('body')).toHaveAttribute('data-ready','true'); await expect(page.locator('body')).not.toHaveAttribute('data-audio','blocked'); });
test('animated outro safely applies editable copy', async ({page}) => { await page.goto('/overlays/outro.html?motion=reduced&event=Community%20Picnic&date=Tomorrow'); await expect(page.getByRole('heading',{name:/Signal made real/i})).toBeVisible(); await expect(page.getByText('Community Picnic')).toBeVisible(); await expect(page.getByText('Tomorrow')).toBeVisible(); });
test('studio cockpit keeps one clock, health row, viewer context, and emergency controls visible', async ({page}) => {
  await page.route('**/studio/api/prompts/runs', route => route.fulfill({ json: [] }));
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
});
