<?php

namespace App\Controller\User;

use App\Entity\User;
use DateInterval;
use DateTimeImmutable;
use Exception;

trait UserTrait
{
    /**
     * @throws Exception
     */
    private function refreshTokenExpired(User $user, int $ttl): bool
    {
        // compare token date to now minus (x)hours (x is get from tokenTTL param)
        $currentDate = new DateTimeImmutable('now');
        return $user->getApiRefreshTokenExpiration() < ($currentDate)->sub(new DateInterval('PT' . $ttl . 'H'));
    }

    private function formatUserOutput(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'surname' => $user->getSurname(),
            'creationDate' => $user->getCreationDate(),
            'active' => $user->isActive(),
            'lastPasswordToken' => $user->getLastPasswordToken(),
            'tokenGeneratedAt' => $user->getTokenGeneratedAt()
        ];
    }
}
