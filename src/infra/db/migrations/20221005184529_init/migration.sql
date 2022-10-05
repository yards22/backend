-- CreateTable
CREATE TABLE `postRecommendations` (
    `user_id` INTEGER NOT NULL,
    `post_recommendations` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `postRecommendations_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `networks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `follower_id` INTEGER NOT NULL,
    `following_id` INTEGER NOT NULL,

    UNIQUE INDEX `networks_follower_id_following_id_key`(`follower_id`, `following_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `postRecommendations` ADD CONSTRAINT `postRecommendations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
