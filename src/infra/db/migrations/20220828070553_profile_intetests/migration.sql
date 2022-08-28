/*
  Warnings:

  - You are about to drop the column `profileUser_id` on the `interests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `interests` DROP FOREIGN KEY `interests_profileUser_id_fkey`;

-- AlterTable
ALTER TABLE `interests` DROP COLUMN `profileUser_id`,
    ADD COLUMN `profile_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profile`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
