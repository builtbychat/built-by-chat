PRAGMA foreign_keys = ON;

CREATE TABLE viewer_feedback (
  show_id TEXT NOT NULL REFERENCES shows(id),
  browser_hash TEXT NOT NULL,
  clarity INTEGER NOT NULL CHECK (clarity BETWEEN 1 AND 5),
  agency INTEGER NOT NULL CHECK (agency BETWEEN 1 AND 5),
  accessibility INTEGER NOT NULL CHECK (accessibility BETWEEN 1 AND 5),
  note TEXT,
  note_status TEXT NOT NULL CHECK (note_status IN ('none','pending','reviewed','removed')) DEFAULT 'none',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (show_id, browser_hash)
);

CREATE TABLE host_workload (
  show_id TEXT PRIMARY KEY REFERENCES shows(id),
  prep_minutes INTEGER NOT NULL CHECK (prep_minutes BETWEEN 0 AND 10080),
  live_minutes INTEGER NOT NULL CHECK (live_minutes BETWEEN 0 AND 10080),
  post_minutes INTEGER NOT NULL CHECK (post_minutes BETWEEN 0 AND 10080),
  admin_minutes INTEGER NOT NULL CHECK (admin_minutes BETWEEN 0 AND 10080),
  stress INTEGER NOT NULL CHECK (stress BETWEEN 1 AND 5),
  recovery INTEGER NOT NULL CHECK (recovery BETWEEN 1 AND 5),
  notes TEXT,
  recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor_email TEXT
);

CREATE INDEX idx_feedback_show_updated ON viewer_feedback(show_id, updated_at DESC);
CREATE INDEX idx_workload_recorded ON host_workload(recorded_at DESC);
