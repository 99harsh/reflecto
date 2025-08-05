/*
  Warnings:

  - Added the required column `mood_emoj` to the `all_moods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `all_moods` ADD COLUMN `mood_emoj` VARCHAR(191) NOT NULL;
