-- AlterTable
ALTER TABLE `journals` MODIFY `journal` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `prompts` MODIFY `description` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `self_reflection` MODIFY `self_reflection` LONGTEXT NOT NULL;
