PRAGMA foreign_keys = ON;

CREATE TABLE shows (
  id TEXT PRIMARY KEY, episode_number INTEGER NOT NULL UNIQUE, title TEXT NOT NULL,
  objective TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT, status TEXT NOT NULL
    CHECK (status IN ('draft','scheduled','live','ended')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE polls (
  id TEXT PRIMARY KEY, show_id TEXT NOT NULL REFERENCES shows(id), question TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','open','closed')), opened_at TEXT, closed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE poll_options (
  id TEXT PRIMARY KEY, poll_id TEXT NOT NULL REFERENCES polls(id), label TEXT NOT NULL,
  description TEXT, display_order INTEGER NOT NULL, UNIQUE(poll_id, display_order)
);
CREATE TABLE poll_results (
  poll_id TEXT NOT NULL REFERENCES polls(id), option_id TEXT NOT NULL REFERENCES poll_options(id),
  vote_count INTEGER NOT NULL, finalized_at TEXT NOT NULL, snapshot_hash TEXT NOT NULL,
  PRIMARY KEY (poll_id, option_id)
);
CREATE TABLE buildings (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL, x INTEGER NOT NULL, y INTEGER NOT NULL,
  width INTEGER NOT NULL, height INTEGER NOT NULL, color TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned','built')), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE residents (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, x INTEGER NOT NULL, y INTEGER NOT NULL,
  color TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE town_events (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
  occurred_at TEXT NOT NULL, payload TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE town_snapshots (
  id TEXT PRIMARY KEY, show_id TEXT REFERENCES shows(id), version INTEGER NOT NULL UNIQUE,
  state_json TEXT NOT NULL, state_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ideas (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, credit_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  consent_version TEXT NOT NULL, browser_hash TEXT NOT NULL, network_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, moderated_at TEXT
);
CREATE TABLE credits (
  id TEXT PRIMARY KEY, show_id TEXT REFERENCES shows(id), display_name TEXT NOT NULL,
  contribution TEXT NOT NULL, idea_id TEXT REFERENCES ideas(id), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE releases (
  id TEXT PRIMARY KEY, version TEXT NOT NULL UNIQUE, title TEXT NOT NULL, summary TEXT NOT NULL,
  published_at TEXT NOT NULL
);
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY, action TEXT NOT NULL, subject_type TEXT NOT NULL, subject_id TEXT NOT NULL,
  actor_email TEXT, metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_polls_show_status ON polls(show_id, status);
CREATE INDEX idx_ideas_status_created ON ideas(status, created_at);
CREATE INDEX idx_events_time ON town_events(occurred_at DESC);
