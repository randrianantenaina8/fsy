<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230216084815 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE parameter (prop_key VARCHAR(255) NOT NULL, prop_value VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_2A979110544ABFF4 (prop_key), PRIMARY KEY(prop_key)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE simulator ADD created_by_id INT DEFAULT NULL, ADD created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE simulator ADD CONSTRAINT FK_81C34CA7B03A8386 FOREIGN KEY (created_by_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_81C34CA7B03A8386 ON simulator (created_by_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE parameter');
        $this->addSql('ALTER TABLE simulator DROP FOREIGN KEY FK_81C34CA7B03A8386');
        $this->addSql('DROP INDEX IDX_81C34CA7B03A8386 ON simulator');
        $this->addSql('ALTER TABLE simulator DROP created_by_id, DROP created_at');
    }
}
