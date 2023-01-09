/*
  Warnings:

  - Made the column `poll_question` on table `polls` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `polls` MODIFY `poll_question` VARCHAR(191) NOT NULL;
