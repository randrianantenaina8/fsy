<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230428083432 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_environment (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, short_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_scheme (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, short_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid ADD scheme_id INT DEFAULT NULL, ADD environment_id INT DEFAULT NULL, ADD minimum_amount_per_hectare DOUBLE PRECISION DEFAULT NULL, ADD maximum_amount_per_hectare DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA65797862 FOREIGN KEY (scheme_id) REFERENCES aid_scheme (id)');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA903E3A94 FOREIGN KEY (environment_id) REFERENCES aid_environment (id)');
        $this->addSql('CREATE INDEX IDX_48B40DAA65797862 ON aid (scheme_id)');
        $this->addSql('CREATE INDEX IDX_48B40DAA903E3A94 ON aid (environment_id)');

        $this->addSql('INSERT INTO aid_scheme (name, short_name) VALUES (\'Plan Forêt Bois Dordogne\',\'PFBD\')');
        $this->addSql('INSERT INTO aid_scheme (name, short_name) VALUES (\'Plan Forêt Bois Gironde\',\'PFBG\')');
        $this->addSql('INSERT INTO aid_scheme (name, short_name) VALUES ("Opération programmée d\'amélioration forestière et environnementale",\'OPAFE\')');

        $this->addSql('INSERT INTO aid_environment (name, short_name) VALUES (\'Forêt\',\'F\')');
        $this->addSql('INSERT INTO aid_environment (name, short_name) VALUES (\'Agricole\',\'A\')');
        $this->addSql('INSERT INTO aid_environment (name, short_name) VALUES (\'Urbain\',\'U\')');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA903E3A94');
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA65797862');
        $this->addSql('DROP TABLE aid_environment');
        $this->addSql('DROP TABLE aid_scheme');
        $this->addSql('DROP INDEX IDX_48B40DAA65797862 ON aid');
        $this->addSql('DROP INDEX IDX_48B40DAA903E3A94 ON aid');
        $this->addSql('ALTER TABLE aid DROP scheme_id, DROP environment_id, DROP minimum_amount_per_hectare, DROP maximum_amount_per_hectare');
    }
}
