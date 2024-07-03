<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230425081806 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_value ADD specie_group_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE aid_funding_value ADD CONSTRAINT FK_F527B9074C4738C2 FOREIGN KEY (specie_group_id) REFERENCES species_group (id)');
        $this->addSql('CREATE INDEX IDX_F527B9074C4738C2 ON aid_funding_value (specie_group_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_value DROP FOREIGN KEY FK_F527B9074C4738C2');
        $this->addSql('DROP INDEX IDX_F527B9074C4738C2 ON aid_funding_value');
        $this->addSql('ALTER TABLE aid_funding_value DROP specie_group_id');
    }
}
