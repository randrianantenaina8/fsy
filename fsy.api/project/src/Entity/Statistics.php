<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\GetStatsAction;

#[ApiResource(
    collectionOperations: [
        'getStatistics' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetStatsAction::class,
            'defaults' => ["_api_receive" => false]
        ]
    ],
    itemOperations: [],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/stats',
    securityMessage: "You don't have permission to access this resource"
)]
class Statistics
{
    private ?int $id = null;
    private int $criterionCount = 0;
    private int $userCount = 0;
    private int $aidCount = 0;
    private int $simulationCount = 0;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getCriterionCount(): int
    {
        return $this->criterionCount;
    }

    public function setCriterionCount(int $criterionCount): self
    {
        $this->criterionCount = $criterionCount;

        return $this;
    }

    public function getUserCount(): int
    {
        return $this->userCount;
    }

    public function setUserCount(int $userCount): self
    {
        $this->userCount = $userCount;

        return $this;
    }

    /**
     * @return int
     */
    public function getAidCount(): int
    {
        return $this->aidCount;
    }

    /**
     * @param int $aidCount
     */
    public function setAidCount(int $aidCount): void
    {
        $this->aidCount = $aidCount;
    }

    /**
     * @return int
     */
    public function getSimulationCount(): int
    {
        return $this->simulationCount;
    }

    /**
     * @param int $simulationCount
     */
    public function setSimulationCount(int $simulationCount): void
    {
        $this->simulationCount = $simulationCount;
    }
}
