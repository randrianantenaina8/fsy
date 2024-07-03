<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230116150854 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE criterion_type ADD short_name VARCHAR(3) NOT NULL, CHANGE name label VARCHAR(255) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7E4970EC3EE4B093 ON criterion_type (short_name)');
        $this->addSql('ALTER TABLE user CHANGE organization_id organization_id INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_7E4970EC3EE4B093 ON criterion_type');
        $this->addSql('ALTER TABLE criterion_type DROP short_name, CHANGE label name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE `user` CHANGE organization_id organization_id INT NOT NULL');
    }
}
