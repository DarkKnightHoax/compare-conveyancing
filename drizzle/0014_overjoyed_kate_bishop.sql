ALTER TABLE `firm_fee_structures` MODIFY COLUMN `searchFee` decimal(10,2) DEFAULT '349';--> statement-breakpoint
ALTER TABLE `firm_fee_structures` ADD `saleLegalFee` decimal(10,2) DEFAULT '0';