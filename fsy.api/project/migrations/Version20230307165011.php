<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230307165011 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_criterion ADD type VARCHAR(3) NOT NULL, CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE simulation_answers ADD type VARCHAR(3) NOT NULL, CHANGE value value JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_criterion DROP type, CHANGE value value DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE simulation_answers DROP type, CHANGE value value DOUBLE PRECISION DEFAULT NULL');
    }
}
