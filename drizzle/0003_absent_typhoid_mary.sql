ALTER TABLE `law_firms` ADD `speciality` varchar(255);--> statement-breakpoint
ALTER TABLE `law_firms` ADD `yearsEstablished` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `law_firms` ADD `accreditations` text;