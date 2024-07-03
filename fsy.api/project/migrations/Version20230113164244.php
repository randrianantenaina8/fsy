<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230113164244 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid (id INT AUTO_INCREMENT NOT NULL, organization_id INT NOT NULL, nature_id INT NOT NULL, complexity_id INT NOT NULL, name VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, open_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', deposit_date DATETIME NOT NULL, leadtime INT DEFAULT NULL, minimum_rate DOUBLE PRECISION DEFAULT NULL, maximum_rate DOUBLE PRECISION DEFAULT NULL, minimum_amount_per_plant DOUBLE PRECISION DEFAULT NULL, maximum_amount_per_plant DOUBLE PRECISION DEFAULT NULL, description VARCHAR(255) DEFAULT NULL, contact_name VARCHAR(255) DEFAULT NULL, contact_email VARCHAR(255) DEFAULT NULL, document_url VARCHAR(255) DEFAULT NULL, origin_url VARCHAR(255) DEFAULT NULL, request_url VARCHAR(255) DEFAULT NULL, creation_date DATETIME NOT NULL, updated_at DATETIME NOT NULL, status INT NOT NULL, origin VARCHAR(255) DEFAULT NULL, INDEX IDX_48B40DAA32C8A3DE (organization_id), INDEX IDX_48B40DAA3BCB2E4B (nature_id), INDEX IDX_48B40DAADAC7F446 (complexity_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_complexity (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_criterion (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, criterion_id INT NOT NULL, value DOUBLE PRECISION DEFAULT NULL, INDEX IDX_5B731D60CB0C1416 (aid_id), INDEX IDX_5B731D6097766307 (criterion_id), UNIQUE INDEX UNIQ_5B731D60CB0C141697766307 (aid_id, criterion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE aid_nature (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE criterion (id INT AUTO_INCREMENT NOT NULL, type_id INT NOT NULL, name VARCHAR(255) NOT NULL, value_min DOUBLE PRECISION DEFAULT NULL, value_max DOUBLE PRECISION DEFAULT NULL, unit VARCHAR(10) DEFAULT NULL, mandatory TINYINT(1) NOT NULL, active TINYINT(1) NOT NULL, INDEX IDX_7C822271C54C8C93 (type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE criterion_type (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE criterion_value (id INT AUTO_INCREMENT NOT NULL, criterion_id INT NOT NULL, value VARCHAR(255) NOT NULL, INDEX IDX_F68BF92C97766307 (criterion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE logs (id INT AUTO_INCREMENT NOT NULL, time_stamp DATETIME NOT NULL, type VARCHAR(100) NOT NULL, info VARCHAR(255) NOT NULL, user VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE organization (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, organism TINYINT(1) NOT NULL, partner TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_C1EE637C5E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (trigram VARCHAR(3) NOT NULL, label VARCHAR(255) NOT NULL, aid_entry INT NOT NULL, aid_validation INT NOT NULL, aid_simulation INT NOT NULL, request_support INT NOT NULL, aid_catalog INT NOT NULL, reporting INT NOT NULL, user_management INT NOT NULL, UNIQUE INDEX UNIQ_8157AA0FEA750E8 (label), PRIMARY KEY(trigram)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE question (id INT AUTO_INCREMENT NOT NULL, step_id INT NOT NULL, criterion_id INT NOT NULL, question_text VARCHAR(255) NOT NULL, position INT NOT NULL, INDEX IDX_B6F7494E73B21E9C (step_id), INDEX IDX_B6F7494E97766307 (criterion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulation (id INT AUTO_INCREMENT NOT NULL, simulator_id INT NOT NULL, user_id INT DEFAULT NULL, date DATETIME NOT NULL, contact_name VARCHAR(255) DEFAULT NULL, contact_email VARCHAR(255) DEFAULT NULL, INDEX IDX_CBDA467BE4D71D57 (simulator_id), INDEX IDX_CBDA467BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulation_aid (simulation_id INT NOT NULL, aid_id INT NOT NULL, INDEX IDX_BA97F412FEC09103 (simulation_id), INDEX IDX_BA97F412CB0C1416 (aid_id), PRIMARY KEY(simulation_id, aid_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulation_answers (id INT AUTO_INCREMENT NOT NULL, simulation_id INT NOT NULL, question_id INT NOT NULL, value DOUBLE PRECISION DEFAULT NULL, INDEX IDX_DF190C7DFEC09103 (simulation_id), INDEX IDX_DF190C7D1E27F6BF (question_id), UNIQUE INDEX UNIQ_DF190C7DFEC091031E27F6BF (simulation_id, question_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulator (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, version_number INT NOT NULL, published TINYINT(1) NOT NULL, INDEX IDX_81C34CA7727ACA70 (parent_id), UNIQUE INDEX UNIQ_81C34CA7E6FD370F727ACA70 (version_number, parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE step (id INT AUTO_INCREMENT NOT NULL, simulator_id INT NOT NULL, name VARCHAR(255) NOT NULL, icon VARCHAR(255) NOT NULL, position INT NOT NULL, INDEX IDX_43B9FE3CE4D71D57 (simulator_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, organization_id INT NOT NULL, profile_id VARCHAR(3) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL, surname VARCHAR(100) NOT NULL, creation_date DATETIME NOT NULL, active TINYINT(1) NOT NULL, last_password_token VARCHAR(255) DEFAULT NULL, token_generated_at DATETIME DEFAULT NULL, api_refresh_token VARCHAR(255) DEFAULT NULL, api_refresh_token_expiration DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D64932C8A3DE (organization_id), INDEX IDX_8D93D649CCFA12B8 (profile_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAA3BCB2E4B FOREIGN KEY (nature_id) REFERENCES aid_nature (id)');
        $this->addSql('ALTER TABLE aid ADD CONSTRAINT FK_48B40DAADAC7F446 FOREIGN KEY (complexity_id) REFERENCES aid_complexity (id)');
        $this->addSql('ALTER TABLE aid_criterion ADD CONSTRAINT FK_5B731D60CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
        $this->addSql('ALTER TABLE aid_criterion ADD CONSTRAINT FK_5B731D6097766307 FOREIGN KEY (criterion_id) REFERENCES criterion (id)');
        $this->addSql('ALTER TABLE criterion ADD CONSTRAINT FK_7C822271C54C8C93 FOREIGN KEY (type_id) REFERENCES criterion_type (id)');
        $this->addSql('ALTER TABLE criterion_value ADD CONSTRAINT FK_F68BF92C97766307 FOREIGN KEY (criterion_id) REFERENCES criterion (id)');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E73B21E9C FOREIGN KEY (step_id) REFERENCES step (id)');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E97766307 FOREIGN KEY (criterion_id) REFERENCES criterion (id)');
        $this->addSql('ALTER TABLE simulation ADD CONSTRAINT FK_CBDA467BE4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id)');
        $this->addSql('ALTER TABLE simulation ADD CONSTRAINT FK_CBDA467BA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE simulation_aid ADD CONSTRAINT FK_BA97F412FEC09103 FOREIGN KEY (simulation_id) REFERENCES simulation (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE simulation_aid ADD CONSTRAINT FK_BA97F412CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE simulation_answers ADD CONSTRAINT FK_DF190C7DFEC09103 FOREIGN KEY (simulation_id) REFERENCES simulation (id)');
        $this->addSql('ALTER TABLE simulation_answers ADD CONSTRAINT FK_DF190C7D1E27F6BF FOREIGN KEY (question_id) REFERENCES question (id)');
        $this->addSql('ALTER TABLE simulator ADD CONSTRAINT FK_81C34CA7727ACA70 FOREIGN KEY (parent_id) REFERENCES simulator (id)');
        $this->addSql('ALTER TABLE step ADD CONSTRAINT FK_43B9FE3CE4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id)');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D64932C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE `user` ADD CONSTRAINT FK_8D93D649CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (trigram)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA32C8A3DE');
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAA3BCB2E4B');
        $this->addSql('ALTER TABLE aid DROP FOREIGN KEY FK_48B40DAADAC7F446');
        $this->addSql('ALTER TABLE aid_criterion DROP FOREIGN KEY FK_5B731D60CB0C1416');
        $this->addSql('ALTER TABLE aid_criterion DROP FOREIGN KEY FK_5B731D6097766307');
        $this->addSql('ALTER TABLE criterion DROP FOREIGN KEY FK_7C822271C54C8C93');
        $this->addSql('ALTER TABLE criterion_value DROP FOREIGN KEY FK_F68BF92C97766307');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494E73B21E9C');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494E97766307');
        $this->addSql('ALTER TABLE simulation DROP FOREIGN KEY FK_CBDA467BE4D71D57');
        $this->addSql('ALTER TABLE simulation DROP FOREIGN KEY FK_CBDA467BA76ED395');
        $this->addSql('ALTER TABLE simulation_aid DROP FOREIGN KEY FK_BA97F412FEC09103');
        $this->addSql('ALTER TABLE simulation_aid DROP FOREIGN KEY FK_BA97F412CB0C1416');
        $this->addSql('ALTER TABLE simulation_answers DROP FOREIGN KEY FK_DF190C7DFEC09103');
        $this->addSql('ALTER TABLE simulation_answers DROP FOREIGN KEY FK_DF190C7D1E27F6BF');
        $this->addSql('ALTER TABLE simulator DROP FOREIGN KEY FK_81C34CA7727ACA70');
        $this->addSql('ALTER TABLE step DROP FOREIGN KEY FK_43B9FE3CE4D71D57');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D64932C8A3DE');
        $this->addSql('ALTER TABLE `user` DROP FOREIGN KEY FK_8D93D649CCFA12B8');
        $this->addSql('DROP TABLE aid');
        $this->addSql('DROP TABLE aid_complexity');
        $this->addSql('DROP TABLE aid_criterion');
        $this->addSql('DROP TABLE aid_nature');
        $this->addSql('DROP TABLE criterion');
        $this->addSql('DROP TABLE criterion_type');
        $this->addSql('DROP TABLE criterion_value');
        $this->addSql('DROP TABLE logs');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE question');
        $this->addSql('DROP TABLE simulation');
        $this->addSql('DROP TABLE simulation_aid');
        $this->addSql('DROP TABLE simulation_answers');
        $this->addSql('DROP TABLE simulator');
        $this->addSql('DROP TABLE step');
        $this->addSql('DROP TABLE `user`');
    }
}
