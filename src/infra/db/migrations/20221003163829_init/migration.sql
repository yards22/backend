/*
  Warnings:

  - Made the column `follower_id` on table `networks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `following_id` on table `networks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `networks` DROP FOREIGN KEY `networks_follower_id_fkey`;

-- DropForeignKey
ALTER TABLE `networks` DROP FOREIGN KEY `networks_following_id_fkey`;

-- AlterTable
ALTER TABLE `networks` MODIFY `follower_id` INTEGER NOT NULL,
    MODIFY `following_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
