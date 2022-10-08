/*
  Warnings:

  - You are about to drop the `recommendations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `recommendations` DROP FOREIGN KEY `recommendations_user_id_fkey`;

-- DropTable
DROP TABLE `recommendations`;

-- CreateTable
CREATE TABLE `user_recommendations` (
    `user_id` INTEGER NOT NULL,
    `recommend` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_recommendations_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_recommendations` ADD CONSTRAINT `user_recommendations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
