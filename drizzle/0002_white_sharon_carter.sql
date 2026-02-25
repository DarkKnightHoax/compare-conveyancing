CREATE TABLE `firm_fee_structures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firmId` int NOT NULL,
	`transactionType` enum('purchase','sale','sale_purchase','remortgage') NOT NULL,
	`minValue` int NOT NULL DEFAULT 0,
	`maxValue` int NOT NULL DEFAULT 9999999,
	`legalFee` decimal(10,2) NOT NULL DEFAULT '0',
	`searchFee` decimal(10,2) DEFAULT '0',
	`landRegistryFee` decimal(10,2) DEFAULT '0',
	`electronicTransferFee` decimal(10,2) DEFAULT '30',
	`bankTransferFee` decimal(10,2) DEFAULT '0',
	`antiMoneyLaunderingFee` decimal(10,2) DEFAULT '6',
	`officialCopiesFee` decimal(10,2) DEFAULT '0',
	`leaseholdSupplement` decimal(10,2) DEFAULT '0',
	`newBuildSupplement` decimal(10,2) DEFAULT '0',
	`sharedOwnershipSupplement` decimal(10,2) DEFAULT '0',
	`giftedDepositSupplement` decimal(10,2) DEFAULT '0',
	`platformCommission` decimal(10,2) DEFAULT '0',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `firm_fee_structures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `firm_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firmId` int NOT NULL,
	`authorId` int,
	`authorName` varchar(200),
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `firm_notes_id` PRIMARY KEY(`id`)
);
