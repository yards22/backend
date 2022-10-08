-- CreateTable
CREATE TABLE `parent_comments` (
    `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `post_id` BIGINT NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `child_comments` (
    `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `parent_comment_id` BIGINT NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parent_comments` ADD CONSTRAINT `parent_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_comments` ADD CONSTRAINT `parent_comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `child_comments` ADD CONSTRAINT `child_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `child_comments` ADD CONSTRAINT `child_comments_parent_comment_id_fkey` FOREIGN KEY (`parent_comment_id`) REFERENCES `parent_comments`(`comment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
