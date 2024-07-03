<?php

namespace App\Services;

use App\Entity\Logs;
use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

/**
 * LogManager class
 */
class Logger
{
    private EntityManagerInterface $entityManager;

    /**
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param string $type
     * @param string $info
     * @param User|null $user
     */
    public function log(string $type, string $info, ?User $user = null): void
    {
        $log = new Logs();

        $log->setType($type);
        $log->setInfo($info);
        $log->setTimeStamp(new DateTime());
        $log->setUser(
            ($user === null) ? null : sprintf(
                "%s %s (%s)",
                $user->getName(),
                $user->getSurname(),
                $user->getId()
            )
        );

        $this->entityManager->persist($log);
        $this->entityManager->flush();
    }
}
