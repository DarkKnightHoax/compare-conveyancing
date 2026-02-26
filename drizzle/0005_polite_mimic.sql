CREATE TABLE `firm_lender_panels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firmId` int NOT NULL,
	`lenderName` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `firm_lender_panels_id` PRIMARY KEY(`id`)
);
