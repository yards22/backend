/*
  Warnings:

  - Made the column `email_id` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `email_id` VARCHAR(191) NOT NULL;
