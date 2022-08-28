-- CreateTable
CREATE TABLE `profile` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email_id` VARCHAR(191) NOT NULL,
    `profile_image` VARCHAR(191) NOT NULL,
    `registered_date` DATETIME(3) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,
    `cric_index` BIGINT NOT NULL,

    UNIQUE INDEX `profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
