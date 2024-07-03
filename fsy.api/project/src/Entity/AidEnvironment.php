<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidEnvironmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidEnvironmentRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAidEnvironments' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidEnvironment:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidEnvironment:read'],
            'denormalization_context' => ['groups' => 'aidEnvironment:read'],
        ]
    ],
    itemOperations: [
        'getAidEnvironment' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidEnvironment:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-environment',
    securityMessage: "You don't have permission to access this resource"
)]
class AidEnvironment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidEnvironment:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['aidEnvironment:read', 'aid:read', 'aid:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['aidEnvironment:read', 'aid:read', 'aid:write'])]
    private ?string $shortName = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getShortName(): ?string
    {
        return $this->shortName;
    }

    public function setShortName(string $shortName): self
    {
        $this->shortName = $shortName;

        return $this;
    }
}
