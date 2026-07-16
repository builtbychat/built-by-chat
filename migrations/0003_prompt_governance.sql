ALTER TABLE prompt_runs ADD COLUMN context_manifest TEXT NOT NULL DEFAULT '[]';
ALTER TABLE prompt_runs ADD COLUMN git_commit TEXT;
ALTER TABLE prompt_runs ADD COLUMN tool_permissions TEXT NOT NULL DEFAULT '[]';
ALTER TABLE prompt_runs ADD COLUMN cost_ceiling_cents INTEGER CHECK (cost_ceiling_cents IS NULL OR cost_ceiling_cents >= 0);
ALTER TABLE prompt_runs ADD COLUMN actual_cost_cents INTEGER CHECK (actual_cost_cents IS NULL OR actual_cost_cents >= 0);
ALTER TABLE prompt_runs ADD COLUMN retention_class TEXT NOT NULL DEFAULT 'operational' CHECK (retention_class IN ('ephemeral','operational','permanent-summary'));
ALTER TABLE prompt_runs ADD COLUMN public_summary TEXT;
ALTER TABLE prompt_runs ADD COLUMN public_summary_approved_at TEXT;
ALTER TABLE prompt_runs ADD COLUMN correction_of_run_id TEXT REFERENCES prompt_runs(id);
