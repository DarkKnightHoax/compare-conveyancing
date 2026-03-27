ALTER TABLE `leads` ADD `salePropertyValue` int;--> statement-breakpoint
ALTER TABLE `leads` ADD `salePostcode` varchar(10);--> statement-breakpoint
ALTER TABLE `leads` ADD `purchasePostcode` varchar(10);--> statement-breakpoint
ALTER TABLE `leads` ADD `saleTenure` enum('freehold','leasehold');--> statement-breakpoint
ALTER TABLE `leads` ADD `purchaseTenure` enum('freehold','leasehold');