import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { runRetention } from '../worker/index';

describe('retention cleanup', () => {
  it('expires private data while preserving aggregate results and permanent prompt provenance', async () => {
    const old = '2024-01-01T00:00:00.000Z';
    await env.DB.batch([
      env.DB.prepare("INSERT INTO shows (id,episode_number,title,objective,starts_at,status) VALUES ('retention-show',99,'Old','Test',?,'ended')").bind(old),
      env.DB.prepare("INSERT INTO polls (id,show_id,question,status,closed_at) VALUES ('retention-poll','retention-show','Old?','closed',?)").bind(old),
      env.DB.prepare("INSERT INTO poll_options (id,poll_id,label,display_order) VALUES ('retention-option','retention-poll','A',0)"),
      env.DB.prepare("INSERT INTO poll_results (poll_id,option_id,vote_count,finalized_at,snapshot_hash) VALUES ('retention-poll','retention-option',7,?,'hash')").bind(old),
      env.DB.prepare("INSERT INTO ideas (id,title,body,status,consent_version,browser_hash,network_hash,created_at,moderated_at) VALUES ('old-idea','Old','Private','rejected','v1','b','n',?,?)").bind(old, old),
      env.DB.prepare("INSERT INTO prompt_runs (id,template_slug,template_version,source_type,source_id,purpose,input_summary,output_summary,disposition,retention_class,public_summary,public_summary_approved_at,created_at) VALUES ('old-run','build-task',1,'issue','1','Old','private input','private output','accepted','permanent-summary','Public provenance',?,?)").bind(old, old),
      env.DB.prepare("INSERT INTO prompt_runs (id,template_slug,template_version,source_type,source_id,purpose,input_summary,output_summary,disposition,retention_class,created_at) VALUES ('ephemeral-run','build-task',1,'issue','2','Temp','private input','private output','failed','ephemeral',?)").bind(old)
      ,env.DB.prepare("INSERT INTO viewer_feedback (show_id,browser_hash,clarity,agency,accessibility,note,note_status,created_at,updated_at) VALUES ('retention-show','old-browser',3,3,3,'old note','pending',?,?)").bind(old,old)
      ,env.DB.prepare("INSERT INTO host_workload (show_id,prep_minutes,live_minutes,post_minutes,admin_minutes,stress,recovery,notes,recorded_at,actor_email) VALUES ('retention-show',60,60,60,60,3,3,'old recovery','2024-01-01T00:00:00.000Z','operator@example.com')")
    ]);
    const show = env.LIVE_SHOWS.getByName('retention-show');
    await show.openPoll({ id: 'retention-poll', showId: 'retention-show', question: 'Old?', status: 'draft', options: [{ id: 'retention-option', label: 'A' }] });
    await show.castVote({ pollId: 'retention-poll', optionId: 'retention-option', browserId: 'browser', networkHash: 'network', idempotencyKey: 'key' });
    await show.closePoll('retention-poll');
    await runRetention(env, new Date('2028-07-16T00:00:00.000Z'));
    expect(await env.DB.prepare("SELECT id FROM ideas WHERE id='old-idea'").first()).toBeNull();
    expect((await env.DB.prepare("SELECT vote_count AS count FROM poll_results WHERE poll_id='retention-poll'").first<{ count: number }>())?.count).toBe(7);
    expect((await env.DB.prepare("SELECT public_summary AS summary FROM prompt_runs WHERE id='old-run'").first<{ summary: string }>())?.summary).toBe('Public provenance');
    expect((await env.DB.prepare("SELECT input_summary AS input FROM prompt_runs WHERE id='ephemeral-run'").first<{ input: string }>())?.input).toBe('[expired]');
    expect((await show.getState()).counts).toEqual({});
    expect(await env.DB.prepare("SELECT show_id FROM viewer_feedback WHERE show_id='retention-show'").first()).toBeNull();
    expect(await env.DB.prepare("SELECT notes FROM host_workload WHERE show_id='retention-show'").first<{ notes: string | null }>()).toEqual({ notes: null });
  });
});
