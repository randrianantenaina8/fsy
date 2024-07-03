<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230418150756 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_funding (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, short_name VARCHAR(10) NOT NULL, UNIQUE INDEX UNIQ_14C7E8C43EE4B093 (short_name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('INSERT INTO aid_funding VALUES (1,\'Financement sur devis-facture\',\'estimBill\')');
        $this->addSql('INSERT INTO aid_funding VALUES (2,\'Financement sur montant fixe\',\'fixedAmoun\')');
        $this->addSql('INSERT INTO aid_funding VALUES (3,\'Financement au barème\',\'scale\')');
        $this->addSql('INSERT INTO aid_funding VALUES (4,\'Financement au plan\',\'plan\')');

        $this->addSql('CREATE TABLE species (id INT AUTO_INCREMENT NOT NULL, species_group_id INT NOT NULL, label VARCHAR(255) NOT NULL, short_name VARCHAR(10) NOT NULL, UNIQUE INDEX UNIQ_A50FF7123EE4B093 (short_name), INDEX IDX_A50FF71218951B37 (species_group_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE species_group (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, short_name VARCHAR(10) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE species ADD CONSTRAINT FK_A50FF71218951B37 FOREIGN KEY (species_group_id) REFERENCES species_group (id)');
        $this->addSql('INSERT INTO species_group VALUES (1,\'Feuillus\',\'hardwood\')');
        $this->addSql('INSERT INTO species_group VALUES (2,\'Résineux\',\'softwood\')');
        $this->addSql('INSERT INTO species_group VALUES (3,\'Essence précieuse\',\'precious\')');
        $this->addSql('INSERT INTO species_group VALUES (4,\'Peuplier\',\'poplar\')');

        $this->addSql('INSERT INTO species VALUES (1,1,\'Chêne\',\'oak\')');
        $this->addSql('INSERT INTO species VALUES (2,1,\'Hêtre\',\'beech\')');
        $this->addSql('INSERT INTO species VALUES (3,2,\'Épicéa\',\'spruce\')');
        $this->addSql('INSERT INTO species VALUES (4,2,\'Pin\',\'pine\')');
        $this->addSql('INSERT INTO species VALUES (5,3,\'Frêne\',\'ash\')');
        $this->addSql('INSERT INTO species VALUES (6,3,\'Érable\',\'maple\')');
        $this->addSql('INSERT INTO species VALUES (7,4,\'Bouleau\',\'birch\')');
        $this->addSql('INSERT INTO species VALUES (8,4,\'Aulne\',\'alder\')');

        $this->addSql('ALTER TABLE aid ADD funding_value JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE aid_form ADD short_name VARCHAR(10) NOT NULL');

        $this->addSql('UPDATE aid_form SET short_name=\'refundable\', name="Avance remboursable" where id = 1');
        $this->addSql('UPDATE aid_form SET short_name=\'grant\', name="Subvention" where id = 2');
        $this->addSql('UPDATE aid_form SET short_name=\'investment\', name="Prêt à l\'investissement" where id = 3');
        $this->addSql('DELETE FROM aid_form WHERE id > 3');

        $this->addSql('CREATE UNIQUE INDEX UNIQ_3DA7417F3EE4B093 ON aid_form (short_name)');
        $this->addSql('ALTER TABLE criterion ADD simulator_only TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE species DROP FOREIGN KEY FK_A50FF71218951B37');
        $this->addSql('DROP TABLE aid_funding');
        $this->addSql('DROP TABLE species');
        $this->addSql('DROP TABLE species_group');
        $this->addSql('ALTER TABLE aid DROP funding_value');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('DROP INDEX UNIQ_3DA7417F3EE4B093 ON aid_form');
        $this->addSql('ALTER TABLE aid_form DROP short_name');
        $this->addSql('ALTER TABLE criterion DROP simulator_only');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE `user` CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
