/*
  Warnings:

  - You are about to drop the column `profile_id` on the `interests` table. All the data in the column will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `interests` DROP FOREIGN KEY `interests_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `profile_user_id_fkey`;

-- AlterTable
ALTER TABLE `interests` DROP COLUMN `profile_id`;

-- DropTable
DROP TABLE `profile`;

-- CreateTable
CREATE TABLE `profiles` (
    `user_id` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email_id` VARCHAR(191) NULL,
    `profile_image_uri` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `cric_index` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
