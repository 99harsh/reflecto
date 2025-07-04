/*
  Warnings:

  - You are about to drop the column `goal` on the `task` table. All the data in the column will be lost.
  - Added the required column `task` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `goal`,
    ADD COLUMN `task` VARCHAR(191) NOT NULL;
