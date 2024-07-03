<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AidFundingPlanRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingPlanRepository::class)]
#[ApiResource]
class AidFundingPlan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'aidFundingPlans')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Aid $aid = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $amount = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?SpeciesGroup $specieGroup = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?Species $specie = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAid(): ?Aid
    {
        return $this->aid;
    }

    public function setAid(?Aid $aid): self
    {
        $this->aid = $aid;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(?float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSpecieGroup(): ?SpeciesGroup
    {
        return $this->specieGroup;
    }

    public function setSpecieGroup(?SpeciesGroup $specieGroup): self
    {
        $this->specieGroup = $specieGroup;

        return $this;
    }

    public function getSpecie(): ?Species
    {
        return $this->specie;
    }

    public function setSpecie(?Species $specie): self
    {
        $this->specie = $specie;

        return $this;
    }
}
