<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230503075805 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE question_dependency (id INT AUTO_INCREMENT NOT NULL, origin_id INT NOT NULL, target_id INT NOT NULL, type VARCHAR(255) NOT NULL, value JSON NOT NULL, value_min DOUBLE PRECISION NULL, value_max DOUBLE PRECISION NULL, INDEX IDX_488CCA8D56A273CC (origin_id), INDEX IDX_488CCA8D158E0B66 (target_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE question_dependency ADD CONSTRAINT FK_488CCA8D56A273CC FOREIGN KEY (origin_id) REFERENCES question (id)');
        $this->addSql('ALTER TABLE question_dependency ADD CONSTRAINT FK_488CCA8D158E0B66 FOREIGN KEY (target_id) REFERENCES question (id)');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE question ADD mandatory TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE question_dependency DROP FOREIGN KEY FK_488CCA8D56A273CC');
        $this->addSql('ALTER TABLE question_dependency DROP FOREIGN KEY FK_488CCA8D158E0B66');
        $this->addSql('DROP TABLE question_dependency');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE question DROP mandatory');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE `user` CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
