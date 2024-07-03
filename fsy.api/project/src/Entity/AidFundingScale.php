<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidFundingScaleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidFundingScaleRepository::class)]
class AidFundingScale
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'aidFundingScales')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Aid $aid = null;

    #[ORM\OneToMany(
        mappedBy: 'aidFundingScale',
        targetEntity: AidFundingScaleCriterion::class,
        cascade: ['persist'],
        orphanRemoval: true
    )]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $criteria;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $maximumAmountOfWork = null;

    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $rate = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?SpeciesGroup $specieGroup = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?Species $specie = null;

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

    /**
     * @return Collection<int, AidFundingScaleCriterion>
     */
    public function getCriteria(): Collection
    {
        return $this->criteria;
    }

    public function addCriterion(AidFundingScaleCriterion $criterion): self
    {
        if (!$this->criteria->contains($criterion)) {
            $this->criteria->add($criterion);
            $criterion->setAidFundingScale($this);
        }

        return $this;
    }

    public function removeCriterion(AidFundingScaleCriterion $criterion): self
    {
        if ($this->criteria->removeElement($criterion)) {
            // set the owning side to null (unless already changed)
            if ($criterion->getAidFundingScale() === $this) {
                $criterion->setAidFundingScale(null);
            }
        }

        return $this;
    }

    public function getMaximumAmountOfWork(): ?float
    {
        return $this->maximumAmountOfWork;
    }

    public function setMaximumAmountOfWork(?float $maximumAmountOfWork): self
    {
        $this->maximumAmountOfWork = $maximumAmountOfWork;

        return $this;
    }

    public function getRate(): ?float
    {
        return $this->rate;
    }

    public function setRate(float $rate): self
    {
        $this->rate = $rate;

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
