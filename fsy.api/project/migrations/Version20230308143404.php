<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230308143404 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid ADD parent_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA727ACA70 FOREIGN KEY (parent_id) REFERENCES aid (id)');
        $this->addSql('CREATE INDEX IDX_48B40DAA727ACA70 ON aid (parent_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA727ACA70');
        $this->addSql('DROP INDEX IDX_48B40DAA727ACA70 ON aid');
        $this->addSql('ALTER TABLE aid DROP parent_id');
    }
}
