-- CreateTable
CREATE TABLE `feedback` (
    `user_id` INTEGER NOT NULL,
    `image_uri` VARCHAR(191) NULL DEFAULT 'https://22yards-image-bucket.s3.ap-south-1.amazonaws.com/sjFmewfzjI.webp',
    `content` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `feedback_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
