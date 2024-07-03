<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidFundingRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAidFundings' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidFunding:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidFunding:read'],
            'denormalization_context' => ['groups' => 'aidFunding:read'],
        ]
    ],
    itemOperations: [
        'getAidFunding' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidFunding:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-funding',
    securityMessage: "You don't have permission to access this resource"
)]
class AidFunding
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidFunding:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidFunding:read', 'aid:read'])]
    private string $label;

    #[ORM\Column(length: 10, unique: true, nullable: false)]
    #[Groups(['aidFunding:read', 'aid:read'])]
    private string $shortName;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getShortName(): string
    {
        return $this->shortName;
    }

    public function setShortName(string $shortName): self
    {
        $this->shortName = $shortName;

        return $this;
    }
}
