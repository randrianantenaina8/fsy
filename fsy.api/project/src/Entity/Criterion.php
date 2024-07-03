<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Criterion\GetCriterionAction;
use App\Controller\Criterion\PostCriterionAction;
use App\Repository\CriterionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CriterionRepository::class)]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => ['criterion:read', 'criterionType:read']],
            'denormalization_context' => ['groups' => ['criterion:read', 'criterionType:read']],
        ],
        'getAllCriterion' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetCriterionAction::class,
            'normalization_context' => ['groups' => [
                'criterion:read',
                'criterionType:read',
                'criteriaValue:read',
                'criterionTheme:read'
            ]],
            'defaults' => ["_api_receive" => false]
        ],
    ],
    itemOperations: [
        'checkUniqueName' => [
            'path' => '/check',
            'method' => 'POST',
            'controller' => PostCriterionAction::class,
            'normalization_context' => ['groups' => ['criterion:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'GET' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => [
                'criterion:read',
                'criterionType:read',
                'criteriaValue:read',
                'criterionTheme:read'
            ]]
        ],
        'getCriterionCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetCriterionAction::class,
            'normalization_context' => ['groups' => ['criterion:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'updateCriteria' => [
            'method' => 'PUT',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['criterion:read', 'criteriaValue:read']],
            'denormalization_context' => ['groups' => ['criterion:write', 'criteriaValue:write']],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/criteria',
    securityMessage: "You don't have permission to access this resource"
)]
class Criterion
{
    public final const DISPLAY_NOT_SPECIFIED = 0; // Criteria values display not specified
    public final const DISPLAY_CHECKBOX = 1; // criteria values are display as a list of checkbox
    public final const DISPLAY_SELECT = 2; // critera values are display in a select

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['criterion:read', 'criterion:write', 'aid:read', 'aid:write', 'criteriaValue:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private string $name;

    #[ORM\Column(length: 10, unique: true, nullable: false)]
    #[Groups(['criterion:read', 'criteriaValue:read_full'])]
    private string $shortName;

    #[ORM\Column(nullable: true)]
    #[Groups(['criterion:read', 'criterion:write', 'aid:read'])]
    private ?float $valueMin = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['criterion:read', 'criterion:write', 'aid:read'])]
    private ?float $valueMax = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private ?string $unit = null;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private bool $multi = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read', 'criterion:write', 'aid:read'])]
    private bool $mandatory = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private bool $active = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read'])]
    private bool $specific = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read'])]
    private bool $financial = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read'])]
    private bool $simulatorOnly = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private int $position = 1;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterion:read', 'criterion:write'])]
    private int $displayMode = 1;

    #[ORM\ManyToOne(inversedBy: 'criteria')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['criterion:read'])]
    private CriterionType $type;

    #[ORM\OneToMany(
        mappedBy: 'criterion',
        targetEntity: CriterionValue::class,
        cascade: ["persist", "remove"],
        orphanRemoval: true
    )]
    #[Groups(['criterion:read', 'criterion:write'])]
    private Collection $criterionValues;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['criterion:read'])]
    private CriterionTheme $theme;

    #[ORM\Column(nullable: false, options: ["default" => 1])]
    #[Groups(['criterion:read', 'criterion:write'])]
    private ?float $step = 1;

    public function __construct()
    {
        $this->criterionValues = new ArrayCollection();
    }

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

    public function getValueMin(): ?float
    {
        return $this->valueMin;
    }

    public function setValueMin(?float $valueMin): self
    {
        $this->valueMin = $valueMin;

        return $this;
    }

    public function getValueMax(): ?float
    {
        return $this->valueMax;
    }

    public function setValueMax(?float $valueMax): self
    {
        $this->valueMax = $valueMax;

        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): self
    {
        $this->unit = $unit;

        return $this;
    }

    public function isMulti(): bool
    {
        return $this->multi;
    }

    public function setMulti(bool $multi): self
    {
        $this->multi = $multi;
        return $this;
    }

    public function isMandatory(): bool
    {
        return $this->mandatory;
    }

    public function setMandatory(bool $mandatory): self
    {
        $this->mandatory = $mandatory;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return bool
     */
    public function isSpecific(): bool
    {
        return $this->specific;
    }

    /**
     * @param bool $specific
     */
    public function setSpecific(bool $specific): void
    {
        $this->specific = $specific;
    }

    /**
     * @return int
     */
    public function getPosition(): int
    {
        return $this->position;
    }

    /**
     * @param int $position
     */
    public function setPosition(int $position): void
    {
        $this->position = $position;
    }

    /**
     * @return int
     */
    public function getDisplayMode(): int
    {
        return $this->displayMode;
    }

    /**
     * @param int $displayMode
     */
    public function setDisplayMode(int $displayMode): void
    {
        $this->displayMode = $displayMode;
    }

    public function getType(): CriterionType
    {
        return $this->type;
    }

    public function setType(CriterionType $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection<int, CriterionValue>
     */
    public function getCriterionValues(): Collection
    {
        return $this->criterionValues;
    }

    public function addCriterionValue(CriterionValue $criterionValue): self
    {
        if (!$this->criterionValues->contains($criterionValue)) {
            $this->criterionValues->add($criterionValue);
            $criterionValue->setCriterion($this);
        }

        return $this;
    }

    public function removeCriterionValue(CriterionValue $criterionValue): self
    {
        // set the owning side to null (unless already changed)
        if ($this->criterionValues->removeElement($criterionValue) && $criterionValue->getCriterion() === $this) {
            $criterionValue->setCriterion(null);
        }

        return $this;
    }

    public function getTheme(): CriterionTheme
    {
        return $this->theme;
    }

    public function setTheme(CriterionTheme $theme): self
    {
        $this->theme = $theme;

        return $this;
    }

    public function isFinancial(): bool
    {
        return $this->financial;
    }

    public function setFinancial(bool $financial): self
    {
        $this->financial = $financial;

        return $this;
    }

    public function isSimulatorOnly(): bool
    {
        return $this->simulatorOnly;
    }

    public function setSimulatorOnly(bool $simulatorOnly): self
    {
        $this->simulatorOnly = $simulatorOnly;

        return $this;
    }

    public function getStep(): ?float
    {
        return $this->step;
    }

    public function setStep(?float $step): self
    {
        $this->step = $step;

        return $this;
    }
}
