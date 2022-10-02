-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `followers` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `following` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `networks` (
    `follower` INTEGER NOT NULL,
    `following` INTEGER NOT NULL,

    UNIQUE INDEX `networks_follower_following_key`(`follower`, `following`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
