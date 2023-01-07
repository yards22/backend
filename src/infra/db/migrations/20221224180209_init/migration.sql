/*
  Warnings:

  - You are about to drop the column `story_img_uri` on the `stories` table. All the data in the column will be lost.
  - Added the required column `media` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stories` DROP COLUMN `story_img_uri`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `media` VARCHAR(191) NOT NULL;
