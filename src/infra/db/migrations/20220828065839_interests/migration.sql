/*
  Warnings:

  - You are about to drop the column `profile_id` on the `interests` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `interests` table. All the data in the column will be lost.
  - The primary key for the `profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,interest]` on the table `interests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `interests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `interests` DROP FOREIGN KEY `interests_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `interests` DROP FOREIGN KEY `interests_usersId_fkey`;

-- DropIndex
DROP INDEX `interests_profile_id_interest_key` ON `interests`;

-- AlterTable
ALTER TABLE `interests` DROP COLUMN `profile_id`,
    DROP COLUMN `usersId`,
    ADD COLUMN `profileUser_id` BIGINT NULL,
    ADD COLUMN `user_id` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `profile` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `interests_user_id_interest_key` ON `interests`(`user_id`, `interest`);

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_profileUser_id_fkey` FOREIGN KEY (`profileUser_id`) REFERENCES `profile`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
