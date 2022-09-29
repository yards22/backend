-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_original_id_fkey`;
-- AddForeignKey
ALTER TABLE `posts`
ADD CONSTRAINT `posts_original_id_fkey` FOREIGN KEY (`original_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;