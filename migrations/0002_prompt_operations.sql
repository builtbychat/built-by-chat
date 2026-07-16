CREATE TABLE prompt_runs (
  id TEXT PRIMARY KEY,
  show_id TEXT REFERENCES shows(id),
  template_slug TEXT NOT NULL,
  template_version INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('poll_result','approved_idea','host_decision','issue')),
  source_id TEXT NOT NULL,
  purpose TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  prompt_hash TEXT,
  output_hash TEXT,
  input_summary TEXT NOT NULL,
  output_summary TEXT,
  verification_summary TEXT,
  disposition TEXT NOT NULL CHECK (disposition IN ('planned','running','accepted','revised','rejected','failed')) DEFAULT 'planned',
  decision_summary TEXT,
  actor_email TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_prompt_runs_show_created ON prompt_runs(show_id, created_at DESC);
CREATE INDEX idx_prompt_runs_source ON prompt_runs(source_type, source_id);
