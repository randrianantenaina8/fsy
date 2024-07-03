<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230419133431 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aid_funding_value (id INT AUTO_INCREMENT NOT NULL, aid_id INT NOT NULL, aid_funding_id INT NOT NULL, INDEX IDX_F527B907CB0C1416 (aid_id), INDEX IDX_F527B9076340D54F (aid_funding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_general_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE aid_funding_value ADD CONSTRAINT FK_F527B907CB0C1416 FOREIGN KEY (aid_id) REFERENCES aid (id)');
        $this->addSql('ALTER TABLE aid_funding_value ADD CONSTRAINT FK_F527B9076340D54F FOREIGN KEY (aid_funding_id) REFERENCES aid_funding (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aid_funding_value DROP FOREIGN KEY FK_F527B907CB0C1416');
        $this->addSql('ALTER TABLE aid_funding_value DROP FOREIGN KEY FK_F527B9076340D54F');
        $this->addSql('DROP TABLE aid_funding_value');
    }
}
