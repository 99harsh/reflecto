/*
  Warnings:

  - You are about to drop the column `journal` on the `journals` table. All the data in the column will be lost.
  - Added the required column `ciphertext` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `journals` DROP COLUMN `journal`,
    ADD COLUMN `ciphertext` LONGBLOB NOT NULL,
    ADD COLUMN `iv` LONGBLOB NOT NULL;
