<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AidFundingFixedAmountRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingFixedAmountRepository::class)]
#[ApiResource]
class AidFundingFixedAmount
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'aidFundingFixedAmounts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Aid $aid = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $amount = null;

    #[ORM\OneToMany(
        mappedBy: 'aidFundingFixedAmount',
        targetEntity: AidFundingFixedAmountCriterion::class,
        cascade: ['persist'],
        orphanRemoval: true
    )]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $criteria;

    public function __construct()
    {
        $this->criteria = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, AidFundingFixedAmountCriterion>
     */
    public function getCriteria(): Collection
    {
        return $this->criteria;
    }

    public function addCriterion(AidFundingFixedAmountCriterion $criterion): self
    {
        if (!$this->criteria->contains($criterion)) {
            $this->criteria->add($criterion);
            $criterion->setAidFundingFixedAmount($this);
        }

        return $this;
    }

    public function removeCriterion(AidFundingFixedAmountCriterion $criterion): self
    {
        if ($this->criteria->removeElement($criterion)) {
            // set the owning side to null (unless already changed)
            if ($criterion->getAidFundingFixedAmount() === $this) {
                $criterion->setAidFundingFixedAmount(null);
            }
        }

        return $this;
    }
}
