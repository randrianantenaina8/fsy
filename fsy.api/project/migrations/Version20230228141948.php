<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230228141948 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_form (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid ADD form_id INT DEFAULT NULL, ADD contract_duration INT DEFAULT NULL, ADD tax_credit_percent DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA5FF69B7D FOREIGN KEY (form_id) REFERENCES aid_form (id)');
        $this->addSql('CREATE INDEX IDX_48B40DAA5FF69B7D ON aid (form_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA5FF69B7D');
        $this->addSql('DROP TABLE aid_form');
        $this->addSql('DROP INDEX IDX_48B40DAA5FF69B7D ON aid');
        $this->addSql('ALTER TABLE aid DROP form_id, DROP contract_duration, DROP tax_credit_percent');
    }
}
