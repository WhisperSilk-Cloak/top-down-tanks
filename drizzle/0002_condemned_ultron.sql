CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`messages` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visitors` (
	`token` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `rooms` ADD `last_active` integer DEFAULT 0 NOT NULL;