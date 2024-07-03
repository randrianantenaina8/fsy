<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230303162925 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid CHANGE complexity_id complexity_id INT DEFAULT NULL, CHANGE open_date open_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE deposit_date deposit_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE criterion ADD is_multi TINYINT(1) NOT NULL, ADD `specific` TINYINT(1) NOT NULL, ADD position INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid CHANGE complexity_id complexity_id INT NOT NULL, CHANGE open_date open_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE deposit_date deposit_date DATETIME NOT NULL');
        $this->addSql('ALTER TABLE criterion DROP is_multi, DROP `specific`, DROP position');
    }
}
