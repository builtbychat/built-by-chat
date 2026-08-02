PRAGMA foreign_keys = ON;

CREATE TABLE show_control (
  show_id TEXT PRIMARY KEY REFERENCES shows(id),
  phase TEXT NOT NULL CHECK (phase IN ('pre_show','welcome','build','vote','results','break','tour','ending','emergency','ended')) DEFAULT 'pre_show',
  catch_up TEXT NOT NULL DEFAULT 'The show is getting ready.',
  show_started_at TEXT,
  phase_started_at TEXT,
  emergency_message TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);

CREATE TABLE show_cues (
  id TEXT PRIMARY KEY,
  show_id TEXT NOT NULL REFERENCES shows(id),
  label TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('cue','checkpoint','break','vote')) DEFAULT 'cue',
  target_seconds INTEGER NOT NULL CHECK (target_seconds >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending','done','skipped')) DEFAULT 'pending',
  display_order INTEGER NOT NULL,
  completed_at TEXT,
  actor_email TEXT,
  UNIQUE(show_id, display_order)
);

CREATE INDEX idx_show_cues_show_order ON show_cues(show_id, display_order);
