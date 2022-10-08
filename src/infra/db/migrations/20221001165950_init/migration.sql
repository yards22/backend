-- DropForeignKey
ALTER TABLE `child_comments` DROP FOREIGN KEY `child_comments_parent_comment_id_fkey`;

-- DropForeignKey
ALTER TABLE `parent_comments` DROP FOREIGN KEY `parent_comments_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `parent_comments` DROP FOREIGN KEY `parent_comments_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `parent_comments` ADD CONSTRAINT `parent_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_comments` ADD CONSTRAINT `parent_comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `child_comments` ADD CONSTRAINT `child_comments_parent_comment_id_fkey` FOREIGN KEY (`parent_comment_id`) REFERENCES `parent_comments`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;
