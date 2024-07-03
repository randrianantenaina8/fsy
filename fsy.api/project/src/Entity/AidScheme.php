<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidSchemeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidSchemeRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAidSchemes' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidScheme:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidScheme:read'],
            'denormalization_context' => ['groups' => 'aidScheme:read'],
        ]
    ],
    itemOperations: [
        'getAidScheme' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidScheme:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-scheme',
    securityMessage: "You don't have permission to access this resource"
)]
class AidScheme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidScheme:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['aidScheme:read', 'aid:read', 'aid:write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['aidScheme:read', 'aid:read', 'aid:write'])]
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
