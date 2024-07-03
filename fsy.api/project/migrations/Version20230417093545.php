<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230417093545 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_history (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, date DATETIME NOT NULL, user VARCHAR(255) NOT NULL, action VARCHAR(255) NOT NULL, INDEX IDX_E0704959CB0C1416 (aid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid_history ADD CONSTRAINT FK_E0704959CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_history DROP FOREIGN KEY FK_E0704959CB0C1416');
        $this->addSql('DROP TABLE aid_history');
    }
}
