<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230508073655 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_scale ADD specie_group_id INT DEFAULT NULL, ADD specie_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE aid_funding_scale ADD CONSTRAINT FK_416C4B74C4738C2 FOREIGN KEY (specie_group_id) REFERENCES species_group (id)');
        $this->addSql('ALTER TABLE aid_funding_scale ADD CONSTRAINT FK_416C4B7D5436AB7 FOREIGN KEY (specie_id) REFERENCES species (id)');
        $this->addSql('CREATE INDEX IDX_416C4B74C4738C2 ON aid_funding_scale (specie_group_id)');
        $this->addSql('CREATE INDEX IDX_416C4B7D5436AB7 ON aid_funding_scale (specie_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_scale DROP FOREIGN KEY FK_416C4B74C4738C2');
        $this->addSql('ALTER TABLE aid_funding_scale DROP FOREIGN KEY FK_416C4B7D5436AB7');
        $this->addSql('DROP INDEX IDX_416C4B74C4738C2 ON aid_funding_scale');
        $this->addSql('DROP INDEX IDX_416C4B7D5436AB7 ON aid_funding_scale');
        $this->addSql('ALTER TABLE aid_funding_scale DROP specie_group_id, DROP specie_id');
    }
}
