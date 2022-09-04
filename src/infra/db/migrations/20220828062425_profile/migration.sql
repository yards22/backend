/*
  Warnings:

  - You are about to drop the column `interests` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` DROP COLUMN `interests`;

-- CreateTable
CREATE TABLE `interests` (
    `user_id` BIGINT NOT NULL,
    `interest` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `interests_user_id_interest_key`(`user_id`, `interest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
