INSERT OR IGNORE INTO shows (id, episode_number, title, objective, starts_at, ends_at, status) VALUES
('show-001', 1, 'Founding Day', 'Name the town and choose its first landmark.', '2026-08-07T00:00:00Z', '2026-08-07T02:00:00Z', 'scheduled');
INSERT OR IGNORE INTO polls (id, show_id, question, status) VALUES
('poll-landmark', 'show-001', 'What should we build first?', 'draft');
INSERT OR IGNORE INTO poll_options (id, poll_id, label, description, display_order) VALUES
('option-library', 'poll-landmark', 'Lantern Library', 'A warm public archive for town lore.', 0),
('option-garden', 'poll-landmark', 'Signal Garden', 'A glowing civic garden by the river.', 1),
('option-workshop', 'poll-landmark', 'Patchwork Shop', 'A maker space for odd little inventions.', 2);
INSERT OR IGNORE INTO buildings (id, name, kind, x, y, width, height, color, status) VALUES
('town-hall', 'Town Hall', 'civic', 4, 2, 2, 2, '#ff7b72', 'built'),
('lot-one', 'Empty Lot A', 'empty', 1, 1, 2, 2, '#26345c', 'planned'),
('lot-two', 'Empty Lot B', 'empty', 8, 1, 2, 2, '#26345c', 'planned'),
('lot-three', 'Empty Lot C', 'empty', 8, 5, 2, 2, '#26345c', 'planned');
INSERT OR IGNORE INTO residents (id, name, role, x, y, color) VALUES
('resident-pip', 'Pip', 'Town caretaker', 6, 4, '#5de4c7');
INSERT OR IGNORE INTO town_events (id, type, title, description, occurred_at) VALUES
('event-founded', 'founding', 'The map wakes up', 'Town Hall, three open lots, and Pip are waiting for the internet.', '2026-07-16T18:00:00Z');
INSERT OR IGNORE INTO releases (id, version, title, summary, published_at) VALUES
('release-001', '0.1.0', 'The lights are on', 'The first map, live room, and voting foundation are ready for rehearsal.', '2026-07-16T18:00:00Z');
INSERT OR IGNORE INTO show_control (show_id, phase, catch_up) VALUES
('show-001', 'pre_show', 'Founding Day starts Thursday at 7:00 PM CT. The map, first landmark vote, and Pip are ready.');
INSERT OR IGNORE INTO show_cues (id, show_id, label, kind, target_seconds, display_order) VALUES
('cue-001-signal', 'show-001', 'Verify camera, mic, recording, both streams, and overlay', 'checkpoint', 0, 0),
('cue-001-welcome', 'show-001', 'Welcome and explain how protected voting works', 'cue', 300, 1),
('cue-001-vote-one', 'show-001', 'Open the first landmark vote', 'vote', 1800, 2),
('cue-001-break', 'show-001', 'Take the scheduled break', 'break', 3600, 3),
('cue-001-result', 'show-001', 'Confirm result snapshot before building', 'checkpoint', 4200, 4),
('cue-001-ending', 'show-001', 'Recap, Sunday invitation, and safe shutdown', 'cue', 6900, 5);
