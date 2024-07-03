<?php

namespace App\Entity;

use App\Repository\AidFundingFixedAmountCriterionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingFixedAmountCriterionRepository::class)]
class AidFundingFixedAmountCriterion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'aidFundingFixedAmountCriteria')]
    #[ORM\JoinColumn(nullable: false)]
    private ?AidFundingFixedAmount $aidFundingFixedAmount = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?CriterionValue $criterionValue = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAidFundingFixedAmount(): ?AidFundingFixedAmount
    {
        return $this->aidFundingFixedAmount;
    }

    public function setAidFundingFixedAmount(?AidFundingFixedAmount $aidFundingFixedAmount): self
    {
        $this->aidFundingFixedAmount = $aidFundingFixedAmount;

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

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
