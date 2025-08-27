/*
  Warnings:

  - You are about to drop the column `self_reflection` on the `self_reflection` table. All the data in the column will be lost.
  - Added the required column `ciphertext` to the `self_reflection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `self_reflection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `self_reflection` DROP COLUMN `self_reflection`,
    ADD COLUMN `ciphertext` LONGBLOB NOT NULL,
    ADD COLUMN `iv` LONGBLOB NOT NULL;
