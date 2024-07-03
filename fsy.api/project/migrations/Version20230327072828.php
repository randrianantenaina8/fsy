<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230327072828 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE department_region (department_id INT NOT NULL, region_id INT NOT NULL, INDEX IDX_1B780E86AE80F5DF (department_id), INDEX IDX_1B780E8698260155 (region_id), PRIMARY KEY(department_id, region_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE department_region ADD CONSTRAINT FK_1B780E86AE80F5DF FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE department_region ADD CONSTRAINT FK_1B780E8698260155 FOREIGN KEY (region_id) REFERENCES region (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE department DROP FOREIGN KEY FK_CD1DE18A98260155');
        $this->addSql('DROP INDEX IDX_CD1DE18A98260155 ON department');
        $this->addSql('ALTER TABLE department DROP region_id');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value JSON NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE department_region DROP FOREIGN KEY FK_1B780E86AE80F5DF');
        $this->addSql('ALTER TABLE department_region DROP FOREIGN KEY FK_1B780E8698260155');
        $this->addSql('DROP TABLE department_region');
        $this->addSql('ALTER TABLE aid_criterion CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE department ADD region_id INT NOT NULL');
        $this->addSql('ALTER TABLE department ADD CONSTRAINT FK_CD1DE18A98260155 FOREIGN KEY (region_id) REFERENCES region (id)');
        $this->addSql('CREATE INDEX IDX_CD1DE18A98260155 ON department (region_id)');
        $this->addSql('ALTER TABLE simulation_answers CHANGE value value LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE `user` CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
