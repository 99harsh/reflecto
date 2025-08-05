/*
  Warnings:

  - Added the required column `intensity` to the `user_mood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_mood` ADD COLUMN `intensity` INTEGER NOT NULL;
