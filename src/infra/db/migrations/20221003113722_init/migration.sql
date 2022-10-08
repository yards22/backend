/*
  Warnings:

  - A unique constraint covering the columns `[follower_id,following_id]` on the table `networks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `networks` DROP FOREIGN KEY `networks_follower_id_fkey`;

-- AlterTable
ALTER TABLE `networks` MODIFY `follower_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `recommendations` (
    `user_id` INTEGER NOT NULL,
    `recommend` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `recommendations_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `networks_follower_id_following_id_key` ON `networks`(`follower_id`, `following_id`);

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
