<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidComplexityRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidComplexityRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAidComplexities' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidComplexity:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidComplexity:read'],
            'denormalization_context' => ['groups' => 'aidComplexity:read'],
        ]
    ],
    itemOperations: [
        'getAidComplexity' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidComplexity:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-complexity',
    securityMessage: "You don't have permission to access this resource"
)]
class AidComplexity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidComplexity:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidComplexity:read', 'aid:read'])]
    private string $name;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }
}
