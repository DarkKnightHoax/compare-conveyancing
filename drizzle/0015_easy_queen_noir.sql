CREATE TABLE `platform_settings` (
	`id` int NOT NULL DEFAULT 1,
	`remortgageLegalFee` int NOT NULL DEFAULT 150,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_id` PRIMARY KEY(`id`)
);
