<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230509113440 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_funding_fixed_amount_criterion (id INT AUTO_INCREMENT NOT NULL, aid_funding_fixed_amount_id INT NOT NULL, criterion_value_id INT DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_3CB4C341DBD0BB02 (aid_funding_fixed_amount_id), INDEX IDX_3CB4C341E8027A1E (criterion_value_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount_criterion ADD CONSTRAINT FK_3CB4C341DBD0BB02 FOREIGN KEY (aid_funding_fixed_amount_id) REFERENCES aid_funding_fixed_amount (id)');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount_criterion ADD CONSTRAINT FK_3CB4C341E8027A1E FOREIGN KEY (criterion_value_id) REFERENCES criterion_value (id)');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount ADD amount DOUBLE PRECISION DEFAULT NULL, DROP value');
        $this->addSql('ALTER TABLE aid_funding_plan ADD specie_group_id INT DEFAULT NULL, ADD specie_id INT DEFAULT NULL, ADD amount DOUBLE PRECISION DEFAULT NULL, DROP value');
        $this->addSql('ALTER TABLE aid_funding_plan ADD CONSTRAINT FK_356F5B3A4C4738C2 FOREIGN KEY (specie_group_id) REFERENCES species_group (id)');
        $this->addSql('ALTER TABLE aid_funding_plan ADD CONSTRAINT FK_356F5B3AD5436AB7 FOREIGN KEY (specie_id) REFERENCES species (id)');
        $this->addSql('CREATE INDEX IDX_356F5B3A4C4738C2 ON aid_funding_plan (specie_group_id)');
        $this->addSql('CREATE INDEX IDX_356F5B3AD5436AB7 ON aid_funding_plan (specie_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_fixed_amount_criterion DROP FOREIGN KEY FK_3CB4C341DBD0BB02');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount_criterion DROP FOREIGN KEY FK_3CB4C341E8027A1E');
        $this->addSql('DROP TABLE aid_funding_fixed_amount_criterion');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount ADD value JSON NOT NULL, DROP amount');
        $this->addSql('ALTER TABLE aid_funding_plan DROP FOREIGN KEY FK_356F5B3A4C4738C2');
        $this->addSql('ALTER TABLE aid_funding_plan DROP FOREIGN KEY FK_356F5B3AD5436AB7');
        $this->addSql('DROP INDEX IDX_356F5B3A4C4738C2 ON aid_funding_plan');
        $this->addSql('DROP INDEX IDX_356F5B3AD5436AB7 ON aid_funding_plan');
        $this->addSql('ALTER TABLE aid_funding_plan ADD value JSON NOT NULL, DROP specie_group_id, DROP specie_id, DROP amount');
    }
}
