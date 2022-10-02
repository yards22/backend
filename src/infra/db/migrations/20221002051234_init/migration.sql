-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_follower_fkey` FOREIGN KEY (`follower`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
