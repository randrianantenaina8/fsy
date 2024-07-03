<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230508061958 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_funding_fixed_amount (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, value JSON NOT NULL, INDEX IDX_B55D91B7CB0C1416 (aid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_funding_plan (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, value JSON NOT NULL, INDEX IDX_356F5B3ACB0C1416 (aid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_funding_scale (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, maximum_amount_of_work DOUBLE PRECISION DEFAULT NULL, rate DOUBLE PRECISION NOT NULL, INDEX IDX_416C4B7CB0C1416 (aid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_funding_scale_criterion (id INT AUTO_INCREMENT NOT NULL, aid_funding_scale_id INT NOT NULL, criterion_value_id INT NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_F6845DD7FD128ABA (aid_funding_scale_id), INDEX IDX_F6845DD7E8027A1E (criterion_value_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid_funding_fixed_amount ADD CONSTRAINT FK_B55D91B7CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
        $this->addSql('ALTER TABLE aid_funding_plan ADD CONSTRAINT FK_356F5B3ACB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
        $this->addSql('ALTER TABLE aid_funding_scale ADD CONSTRAINT FK_416C4B7CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
        $this->addSql('ALTER TABLE aid_funding_scale_criterion ADD CONSTRAINT FK_F6845DD7FD128ABA FOREIGN KEY (aid_funding_scale_id) REFERENCES aid_funding_scale (id)');
        $this->addSql('ALTER TABLE aid_funding_scale_criterion ADD CONSTRAINT FK_F6845DD7E8027A1E FOREIGN KEY (criterion_value_id) REFERENCES criterion_value (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_fixed_amount DROP FOREIGN KEY FK_B55D91B7CB0C1416');
        $this->addSql('ALTER TABLE aid_funding_plan DROP FOREIGN KEY FK_356F5B3ACB0C1416');
        $this->addSql('ALTER TABLE aid_funding_scale DROP FOREIGN KEY FK_416C4B7CB0C1416');
        $this->addSql('ALTER TABLE aid_funding_scale_criterion DROP FOREIGN KEY FK_F6845DD7FD128ABA');
        $this->addSql('ALTER TABLE aid_funding_scale_criterion DROP FOREIGN KEY FK_F6845DD7E8027A1E');
        $this->addSql('DROP TABLE aid_funding_fixed_amount');
        $this->addSql('DROP TABLE aid_funding_plan');
        $this->addSql('DROP TABLE aid_funding_scale');
        $this->addSql('DROP TABLE aid_funding_scale_criterion');
    }
}
