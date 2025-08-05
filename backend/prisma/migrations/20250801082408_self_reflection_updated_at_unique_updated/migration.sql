/*
  Warnings:

  - A unique constraint covering the columns `[updated_at]` on the table `self_reflection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `self_reflection_updated_at_key` ON `self_reflection`(`updated_at`);
