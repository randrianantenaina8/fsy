<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use App\Repository\CriterionTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CriterionTypeRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getCriterionTypes' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'criterionType:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'criterionType:read'],
            'denormalization_context' => ['groups' => 'criterionType:read'],
        ]
    ],
    itemOperations: [
        'getCriterionType' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'criterionType:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/criterion-type',
    securityMessage: "You don't have permission to access this resource"
)]
class CriterionType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['criterionType:read', 'criterionType:read_full'])]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['criterionType:read', 'criterionType:read_full'])]
    private string $label;

    #[ORM\Column(length: 3, unique: true, nullable: false)]
    #[Groups(['criterionType:read', 'criterionType:read_full'])]
    #[ApiProperty(identifier: true)]
    private string $shortName;

    #[ORM\OneToMany(mappedBy: 'type', targetEntity: Criterion::class)]
    #[Groups(['criterionType:read_full'])]
    private Collection $criteria;

    public function __construct()
    {
        $this->criteria = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel(string $label): void
    {
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getShortName(): string
    {
        return $this->shortName;
    }

    /**
     * @param string $shortName
     */
    public function setShortName(string $shortName): void
    {
        $this->shortName = $shortName;
    }

    /**
     * @return Collection<int, Criterion>
     */
    public function getCriteria(): Collection
    {
        return $this->criteria;
    }

    public function addCriterion(Criterion $criterion): self
    {
        if (!$this->criteria->contains($criterion)) {
            $this->criteria->add($criterion);
            $criterion->setType($this);
        }

        return $this;
    }

    public function removeCriterion(Criterion $criterion): self
    {
        // set the owning side to null (unless already changed)
        if ($this->criteria->removeElement($criterion) && $criterion->getType() === $this) {
            $criterion->setType(null);
        }

        return $this;
    }
}
