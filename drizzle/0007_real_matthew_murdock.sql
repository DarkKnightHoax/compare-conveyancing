ALTER TABLE `leads` ADD `referenceNumber` varchar(30);--> statement-breakpoint
ALTER TABLE `leads` ADD `quoteSnapshot` text;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_referenceNumber_unique` UNIQUE(`referenceNumber`);