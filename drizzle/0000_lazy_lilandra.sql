CREATE TABLE `profile_events` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`event_type` text NOT NULL,
	`actor_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`public_id` text NOT NULL,
	`coach_id` text NOT NULL,
	`display_name` text NOT NULL,
	`age` integer,
	`hobbies` text NOT NULL,
	`dream_job` text NOT NULL,
	`learning_interest` text NOT NULL,
	`fun_fact` text NOT NULL,
	`icon` text NOT NULL,
	`theme` text NOT NULL,
	`project_message` text NOT NULL,
	`is_active` integer NOT NULL,
	`consent_checked` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_public_id_unique` ON `profiles` (`public_id`);
