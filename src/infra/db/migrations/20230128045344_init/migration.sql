-- DropForeignKey
ALTER TABLE `favourites` DROP FOREIGN KEY `favourites_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `trending_posts` DROP FOREIGN KEY `trending_posts_post_id_fkey`;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favourites` ADD CONSTRAINT `favourites_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trending_posts` ADD CONSTRAINT `trending_posts_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
