<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidFormRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFormRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAidForms' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidForm:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidForm:read'],
            'denormalization_context' => ['groups' => 'aidForm:read'],
        ]
    ],
    itemOperations: [
        'getAidForm' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidForm:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-form',
    securityMessage: "You don't have permission to access this resource"
)]
class AidForm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidForm:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidForm:read', 'aid:read'])]
    private string $name = "-";

    #[ORM\Column(length: 10, unique: true, nullable: false)]
    #[Groups(['aidForm:read', 'aid:read'])]
    private string $shortName;

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
    public function getShortName(): string
    {
        return $this->shortName;
    }

    public function setShortName(string $shortName): void
    {
        $this->shortName = $shortName;
    }
}
