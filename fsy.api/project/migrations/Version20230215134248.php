<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215134248 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649CCFA12B8');
        $this->addSql('ALTER TABLE profile ADD id INT AUTO_INCREMENT NOT NULL FIRST, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE user CHANGE profile_id profile_id INT NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8157AA0FE9E2A637 ON profile (trigram)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE profile MODIFY id INT NOT NULL');
        $this->addSql('DROP INDEX UNIQ_8157AA0FE9E2A637 ON profile');
        $this->addSql('DROP INDEX `PRIMARY` ON profile');
        $this->addSql('ALTER TABLE profile DROP id');
        $this->addSql('ALTER TABLE profile ADD PRIMARY KEY (trigram)');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649CCFA12B8');
        $this->addSql('ALTER TABLE `user` CHANGE profile_id profile_id VARCHAR(3) NOT NULL');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D649CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (trigram)');
    }
}
