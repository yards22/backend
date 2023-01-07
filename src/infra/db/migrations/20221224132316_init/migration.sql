-- CreateTable
CREATE TABLE `stories` (
    `story_id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `story_img_uri` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`story_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
