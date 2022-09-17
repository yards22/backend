/*
  Warnings:

  - You are about to drop the column `interests` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `interests` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `interests`;
