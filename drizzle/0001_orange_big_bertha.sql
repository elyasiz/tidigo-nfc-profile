CREATE INDEX `idx_profile_events_profile` ON `profile_events` (`profile_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_profiles_coach_updated` ON `profiles` (`coach_id`,`updated_at`);
