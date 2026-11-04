CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`p0` text NOT NULL,
	`p1` text,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
