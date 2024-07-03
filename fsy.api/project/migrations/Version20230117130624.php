<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230117130624 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE organization ADD contact_name VARCHAR(255) DEFAULT NULL, ADD contact_email VARCHAR(255) DEFAULT NULL, ADD contact_phone VARCHAR(17) DEFAULT NULL, ADD address VARCHAR(255) DEFAULT NULL, ADD address2 VARCHAR(255) DEFAULT NULL, ADD postal_code VARCHAR(10) DEFAULT NULL, ADD city VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD activation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME DEFAULT NULL, ADD status TINYINT(1) NOT NULL, CHANGE creation_date creation_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE organization DROP contact_name, DROP contact_email, DROP contact_phone, DROP address, DROP address2, DROP postal_code, DROP city');
        $this->addSql('ALTER TABLE `user` DROP activation_date, DROP updated_at, DROP status, CHANGE creation_date creation_date DATETIME NOT NULL');
    }
}
