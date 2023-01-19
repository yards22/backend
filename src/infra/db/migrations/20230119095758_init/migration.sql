-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_triggered_by_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` MODIFY `triggered_by_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_triggered_by_id_fkey` FOREIGN KEY (`triggered_by_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
