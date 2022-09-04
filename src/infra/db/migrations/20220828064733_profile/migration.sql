/*
  Warnings:

  - You are about to drop the column `user_id` on the `interests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profile_id,interest]` on the table `interests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profile_id` to the `interests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `interests` DROP FOREIGN KEY `interests_user_id_fkey`;

-- DropIndex
DROP INDEX `interests_user_id_interest_key` ON `interests`;

-- AlterTable
ALTER TABLE `interests` DROP COLUMN `user_id`,
    ADD COLUMN `profile_id` BIGINT NOT NULL,
    ADD COLUMN `usersId` BIGINT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `interests_profile_id_interest_key` ON `interests`(`profile_id`, `interest`);

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interests` ADD CONSTRAINT `interests_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
