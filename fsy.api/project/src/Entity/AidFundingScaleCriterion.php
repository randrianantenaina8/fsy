<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidFundingScaleCriterionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingScaleCriterionRepository::class)]
#[ApiResource]
class AidFundingScaleCriterion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'criteria')]
    #[ORM\JoinColumn(nullable: false)]
    private ?AidFundingScale $aidFundingScale = null;

    #[ORM\ManyToOne(cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?CriterionValue $criterionValue = null;

    #[ORM\Column(length: 255)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAidFundingScale(): ?AidFundingScale
    {
        return $this->aidFundingScale;
    }

    public function setAidFundingScale(?AidFundingScale $aidFundingScale): self
    {
        $this->aidFundingScale = $aidFundingScale;

        return $this;
    }

    public function getCriterionValue(): ?CriterionValue
    {
        return $this->criterionValue;
    }

    public function setCriterionValue(?CriterionValue $criterionValue): self
    {
        $this->criterionValue = $criterionValue;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
