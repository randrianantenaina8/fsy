<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SpeciesRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SpeciesRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getAllSpecies' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'species:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'species:read'],
            'denormalization_context' => ['groups' => 'species:read'],
        ]
    ],
    itemOperations: [
        'getSpecies' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'species:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/species',
    securityMessage: "You don't have permission to access this resource"
)]
class Species
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['species:read', 'speciesGroup:read_full', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['species:read', 'speciesGroup:read_full'])]
    private string $label;

    #[ORM\Column(length: 10, unique: true, nullable: false)]
    #[Groups(['species:read', 'speciesGroup:read_full'])]
    private string $shortName;

    #[ORM\ManyToOne(inversedBy: 'species')]
    #[ORM\JoinColumn(nullable: false)]
    private ?SpeciesGroup $speciesGroup = null;

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

    public function getSpeciesGroup(): ?SpeciesGroup
    {
        return $this->speciesGroup;
    }

    public function setSpeciesGroup(?SpeciesGroup $speciesGroup): self
    {
        $this->speciesGroup = $speciesGroup;

        return $this;
    }
}
