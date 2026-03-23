ALTER TABLE `leads` ADD `utmSource` varchar(100);--> statement-breakpoint
ALTER TABLE `leads` ADD `utmMedium` varchar(100);--> statement-breakpoint
ALTER TABLE `leads` ADD `utmCampaign` varchar(255);--> statement-breakpoint
ALTER TABLE `leads` ADD `utmContent` varchar(255);--> statement-breakpoint
ALTER TABLE `leads` ADD `utmTerm` varchar(255);--> statement-breakpoint
ALTER TABLE `leads` ADD `referrerUrl` varchar(1000);--> statement-breakpoint
ALTER TABLE `leads` ADD `landingPage` varchar(500);