<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230330141231 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE criterion_theme (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, position INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (1, \'Global\', 1);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (2, \'Localisation\', 2);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (3, \'General\', 3);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (4, \'Description\', 4);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (5, \'Cumul\', 5);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (6, \'Plantation\', 6);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (7, \'Technique\', 7);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (8, \'Travaux\', 8);');
        $this->addSql('INSERT INTO criterion_theme (id, name, position) VALUES (9, \'Financement\', 9);');
        $this->addSql('ALTER TABLE criterion ADD theme_id INT NOT NULL default 1, DROP theme');
        $this->addSql('ALTER TABLE criterion ADD CONSTRAINT FK_7C82227159027487 FOREIGN KEY (theme_id) REFERENCES criterion_theme (id)');
        $this->addSql('CREATE INDEX IDX_7C82227159027487 ON criterion (theme_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE criterion DROP FOREIGN KEY FK_7C82227159027487');
        $this->addSql('DROP TABLE criterion_theme');
        $this->addSql('DROP INDEX IDX_7C82227159027487 ON criterion');
        $this->addSql('ALTER TABLE criterion ADD theme VARCHAR(50) NOT NULL, DROP theme_id');
    }
}
