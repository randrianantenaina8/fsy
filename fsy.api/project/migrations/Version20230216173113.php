<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230216173113 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE parameter ADD organization_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE parameter ADD CONSTRAINT FK_2A97911032C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('CREATE INDEX IDX_2A97911032C8A3DE ON parameter (organization_id)');
        $this->addSql('DROP INDEX UNIQ_2A979110544ABFF4 ON parameter');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2A979110544ABFF432C8A3DE ON parameter (prop_key, organization_id)');
        $this->addSql('ALTER TABLE parameter ADD id INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2A979110544ABFF4 ON parameter (prop_key)');
        $this->addSql('DROP INDEX UNIQ_2A979110544ABFF4 ON parameter');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE parameter DROP FOREIGN KEY FK_2A97911032C8A3DE');
        $this->addSql('DROP INDEX IDX_2A97911032C8A3DE ON parameter');
        $this->addSql('ALTER TABLE parameter DROP organization_id');
        $this->addSql('DROP INDEX UNIQ_2A979110544ABFF432C8A3DE ON parameter');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2A979110544ABFF4 ON parameter (prop_key)');
        $this->addSql('ALTER TABLE parameter MODIFY id INT NOT NULL');
        $this->addSql('DROP INDEX UNIQ_2A979110544ABFF4 ON parameter');
        $this->addSql('DROP INDEX `PRIMARY` ON parameter');
        $this->addSql('ALTER TABLE parameter DROP id');
        $this->addSql('ALTER TABLE parameter ADD PRIMARY KEY (prop_key)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_2A979110544ABFF4 ON parameter (prop_key)');
    }
}
