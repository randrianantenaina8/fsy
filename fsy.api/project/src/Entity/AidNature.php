<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AidNatureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidNatureRepository::class)]
#[\ApiPlatform\Core\Annotation\ApiResource(
    collectionOperations: [
        'getAidNatures' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidNature:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidNature:read'],
            'denormalization_context' => ['groups' => 'aidNature:read'],
        ]
    ],
    itemOperations: [
        'getAidNature' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidNature:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-nature',
    securityMessage: "You don't have permission to access this resource"
)]
class AidNature
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidNature:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidNature:read', 'aid:read'])]
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
