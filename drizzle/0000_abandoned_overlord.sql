CREATE TABLE `chatbotrerun_message` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	`content` text NOT NULL,
	`role` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `chatbotrerun_session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chatbotrerun_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text DEFAULT 'New Chat',
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
