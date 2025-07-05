/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `self_reflection` DROP FOREIGN KEY `self_reflection_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_mood` DROP FOREIGN KEY `user_mood_user_id_fkey`;

-- DropIndex
DROP INDEX `journals_user_id_fkey` ON `journals`;

-- DropIndex
DROP INDEX `self_reflection_user_id_fkey` ON `self_reflection`;

-- DropIndex
DROP INDEX `task_user_id_fkey` ON `task`;

-- DropIndex
DROP INDEX `user_mood_user_id_fkey` ON `user_mood`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `profile_photo` VARCHAR(191) NOT NULL,
    `xp` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_login` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_prompts` (
    `user_prompt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `prompt_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_prompt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mood` ADD CONSTRAINT `user_mood_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_prompts` ADD CONSTRAINT `user_prompts_prompt_id_fkey` FOREIGN KEY (`prompt_id`) REFERENCES `prompts`(`prompt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_prompts` ADD CONSTRAINT `user_prompts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `self_reflection` ADD CONSTRAINT `self_reflection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
