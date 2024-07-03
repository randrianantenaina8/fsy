<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230315114822 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE criterion_value DROP FOREIGN KEY FK_F68BF92C97766307');
        $this->addSql('ALTER TABLE criterion_value ADD CONSTRAINT FK_F68BF92C97766307 FOREIGN KEY (criterion_id) REFERENCES criterion (id) ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_CD1DE18AEA750E8 ON department (label)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_CD1DE18A96901F54 ON department (number)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F62F176EA750E8 ON region (label)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F62F17696901F54 ON region (number)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE criterion_value DROP FOREIGN KEY FK_F68BF92C97766307');
        $this->addSql('ALTER TABLE criterion_value ADD CONSTRAINT FK_F68BF92C97766307 FOREIGN KEY (criterion_id) REFERENCES criterion (id)');
        $this->addSql('DROP INDEX UNIQ_CD1DE18AEA750E8 ON department');
        $this->addSql('DROP INDEX UNIQ_CD1DE18A96901F54 ON department');
        $this->addSql('DROP INDEX UNIQ_F62F176EA750E8 ON region');
        $this->addSql('DROP INDEX UNIQ_F62F17696901F54 ON region');
    }
}
