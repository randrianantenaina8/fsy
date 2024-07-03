<?php

namespace App\Services;

use App\Entity\Aid;
use App\Entity\AidHistory;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class AidHistoryLogger
{
    private EntityManagerInterface $entityManager;
    protected Security $security;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param int $type
     * @param Aid $aid
     * @param int|null $lastStatus
     */
    public function addHistory(int $type, Aid $aid, ?int $lastStatus = null): void
    {
        $user = $this->security->getUser();
        if ($user === null) {
            $userName = "Système";
        } else {
            $userName = sprintf("%s %s (%s)", $user->getName(), $user->getSurname(), $user->getId());
        }

        $ah = new AidHistory();
        $ah->setAid($aid);
        $ah->setDate(new DateTime());
        $ah->setUser($userName);

        $ah->setAction(self::generateActionText($type, $aid, $lastStatus));

        $this->entityManager->persist($ah);
        $this->entityManager->flush();
    }

    /**
     * @param int $type
     * @param Aid $aid
     * @param int|null $lastStatus
     * @return string
     */
    private static function generateActionText(int $type, Aid $aid, ?int $lastStatus = null): string
    {
        return match ($type) {
            AidHistory::AID_CREATION => "Création de l'aide",
            AidHistory::VERSION_CREATION => "Création d'une nouvelle version : version {$aid->getVersion()}",
            AidHistory::CONTENT_EDIT => "Version {$aid->getVersion()} : Modification du contenu de l'aide",
            AidHistory::STATUS_EDIT => sprintf(
                "Version %s : Changement de statut: passage de '%s' à '%s'",
                $aid->getVersion(),
                Aid::getStatusText($lastStatus),
                Aid::getStatusText($aid->getStatus())
            ),
            AidHistory::STATUS_CHANGED_TO_DRAFT => "Version {$aid->getVersion()} : Passage de l'aide en brouillon",
            AidHistory::STATUS_CHANGED_TO_VALIDATING => "Version {$aid->getVersion()} : Envoi de l'aide en validation",
            AidHistory::STATUS_CHANGED_TO_REFUSED => "Version {$aid->getVersion()} : Refus de l'aide",
            AidHistory::STATUS_CHANGED_TO_VALIDATED => "Version {$aid->getVersion()} : Validation de l'aide",
            AidHistory::STATUS_CHANGED_TO_PUBLISHED => "Version {$aid->getVersion()} : Publication de l'aide",
            AidHistory::STATUS_CHANGED_TO_UNPUBLISHED => "Version {$aid->getVersion()} : Dépublication de l'aide",
        };
    }
}
