/*
  Warnings:

  - You are about to drop the column `prompt_id` on the `self_reflection` table. All the data in the column will be lost.
  - You are about to drop the `user_prompts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `self_reflection` DROP FOREIGN KEY `self_reflection_prompt_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_prompts` DROP FOREIGN KEY `user_prompts_prompt_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_prompts` DROP FOREIGN KEY `user_prompts_user_id_fkey`;

-- DropIndex
DROP INDEX `self_reflection_prompt_id_fkey` ON `self_reflection`;

-- AlterTable
ALTER TABLE `self_reflection` DROP COLUMN `prompt_id`;

-- DropTable
DROP TABLE `user_prompts`;
