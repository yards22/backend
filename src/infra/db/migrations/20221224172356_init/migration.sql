/*
  Warnings:

  - Added the required column `user_id` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stories` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `stories` ADD CONSTRAINT `stories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
