/*
  Warnings:

  - The primary key for the `polls_reaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reaction_id` on the `polls_reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[poll_id,user_id]` on the table `polls_reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `polls_reaction` DROP PRIMARY KEY,
    DROP COLUMN `reaction_id`;

-- CreateIndex
CREATE UNIQUE INDEX `polls_reaction_poll_id_user_id_key` ON `polls_reaction`(`poll_id`, `user_id`);
