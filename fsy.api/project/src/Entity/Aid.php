<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Aid\PostAidAction;
use App\Controller\Aid\GetAidAction;
use App\Repository\AidRepository;
use DateTime;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => '',
            'controller' => PostAidAction::class,
            'normalization_context' => ['groups' => 'aid:write'],
        ],
        'getAidCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetAidAction::class,
            'normalization_context' => ['groups' => ['aid:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAidStatusCount' => [
            'path' => '/count-status',
            'method' => 'GET',
            'controller' => GetAidAction::class,
            'normalization_context' => ['groups' => ['aid:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAllAids' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetAidAction::class,
            'normalization_context' => ['groups' => ['aid:read']],
            'defaults' => ["_api_receive" => false]
        ],
        'getAidVersions' => [
            'path' => '/{id}/versions',
            'method' => 'GET',
            'controller' => GetAidAction::class,
            'defaults' => ["_api_receive" => false]
        ]
    ],
    itemOperations: [
        'getAid' => [
            'method' => 'GET',
            'path' => '/{id}',
            'controller' => GetAidAction::class,
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aid:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['aid:write']],
            'denormalization_context' => ['groups' => 'aid:write'],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    denormalizationContext: ["groups" => ["aid:write"]],
    normalizationContext: ["groups" => ["aid:read"]],
    routePrefix: '/aid',
    securityMessage: "You don't have permission to access this resource"
)]
class Aid
{
    public final const STATUS_DRAFT = 1; // Aid is being written
    public final const STATUS_VALIDATING = 2; // Aid is sent to validation
    public final const STATUS_REFUSED = 3; // aid is refused by Fransylva
    public final const STATUS_VALIDATED = 4; // aid is approved by Fransylva

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $id;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private string $name;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private string $label;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private Organization $organization;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?DateTimeInterface $openDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?DateTimeInterface $depositDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $leadtime = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $minimumRate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $maximumRate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $minimumAmountPerPlant = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $maximumAmountPerPlant = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $contactName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $contactEmail = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $documentUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $originUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?string $requestUrl = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private DateTimeInterface $creationDate;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private DateTimeInterface $updatedAt;

    #[ORM\Column(nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private int $status = self::STATUS_DRAFT;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $origin = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['aid:read', 'aid:write'])]
    private AidNature $nature;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private AidComplexity $complexity;

    #[ORM\ManyToMany(targetEntity: Simulation::class, mappedBy: 'suggestedAids')]
    private Collection $simulations;

    #[ORM\Column]
    #[Groups(['aid:read', 'aid:write'])]
    private ?bool $active = null;

    #[ORM\Column(length: 10, nullable: false)]
    #[Groups(['aid:read'])]
    private string $version = '1';

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private AidForm $form;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?int $contractDuration = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $taxCreditPercent = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'childVersions')]
    #[Groups(['aid:read', 'aid:write'])]
    private ?self $parent = null;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    private Collection $childVersions;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?DateTimeImmutable $activateAt = null;

    #[ORM\OneToMany(mappedBy: 'aid', targetEntity: AidCriterion::class, cascade: ['persist'], orphanRemoval: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $aidCriterions;

    #[ORM\OneToMany(mappedBy: 'aid', targetEntity: AidHistory::class, orphanRemoval: true)]
    private Collection $aidHistories;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?AidFunding $funding = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?AidScheme $scheme = null;

    #[ORM\ManyToOne]
    #[Groups(['aid:read', 'aid:write'])]
    private ?AidEnvironment $environment = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $minimumAmountPerHectare = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private ?float $maximumAmountPerHectare = null;

    #[ORM\OneToMany(mappedBy: 'aid', targetEntity: AidFundingScale::class, cascade: ['persist'], orphanRemoval: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $aidFundingScales;

    #[ORM\OneToMany(mappedBy: 'aid', targetEntity: AidFundingPlan::class, cascade: ['persist'], orphanRemoval: true)]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $aidFundingPlans;

    #[ORM\OneToMany(
        mappedBy: 'aid',
        targetEntity: AidFundingFixedAmount::class,
        cascade: ['persist'],
        orphanRemoval: true
    )]
    #[Groups(['aid:read', 'aid:write'])]
    private Collection $aidFundingFixedAmounts;

    public function __construct()
    {
        $this->creationDate = new DateTimeImmutable();
        $this->updatedAt = new DateTime();
        $this->simulations = new ArrayCollection();
        $this->childVersions = new ArrayCollection();
        $this->aidCriterions = new ArrayCollection();
        $this->aidHistories = new ArrayCollection();
        $this->aidFundingScales = new ArrayCollection();
        $this->aidFundingPlans = new ArrayCollection();
        $this->aidFundingFixedAmounts = new ArrayCollection();
    }

    public function __toString(): string
    {
        return $this->getId() . " - " . $this->getName() . "(" . $this->getCreationDate()?->format(
                "d-m-Y H:i:s"
            ) . ")";
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

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getOrganization(): Organization
    {
        return $this->organization;
    }

    public function setOrganization(Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    public function getOpenDate(): ?DateTimeInterface
    {
        return $this->openDate;
    }

    public function setOpenDate(?DateTimeInterface $openDate): self
    {
        $this->openDate = $openDate;

        return $this;
    }

    public function getDepositDate(): ?DateTimeInterface
    {
        return $this->depositDate;
    }

    public function setDepositDate(?DateTimeInterface $depositDate): self
    {
        $this->depositDate = $depositDate;

        return $this;
    }

    public function getLeadtime(): ?int
    {
        return $this->leadtime;
    }

    public function setLeadtime(int $leadtime): self
    {
        $this->leadtime = $leadtime;

        return $this;
    }

    public function getMinimumRate(): ?float
    {
        return $this->minimumRate;
    }

    public function setMinimumRate(?float $minimumRate): self
    {
        $this->minimumRate = $minimumRate;

        return $this;
    }

    public function getMaximumRate(): ?float
    {
        return $this->maximumRate;
    }

    public function setMaximumRate(?float $maximumRate): self
    {
        $this->maximumRate = $maximumRate;

        return $this;
    }

    public function getMinimumAmountPerPlant(): ?float
    {
        return $this->minimumAmountPerPlant;
    }

    public function setMinimumAmountPerPlant(?float $minimumAmountPerPlant): self
    {
        $this->minimumAmountPerPlant = $minimumAmountPerPlant;

        return $this;
    }

    public function getMaximumAmountPerPlant(): ?float
    {
        return $this->maximumAmountPerPlant;
    }

    public function setMaximumAmountPerPlant(?float $maximumAmountPerPlant): self
    {
        $this->maximumAmountPerPlant = $maximumAmountPerPlant;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getContactName(): ?string
    {
        return $this->contactName;
    }

    public function setContactName(?string $contactName): self
    {
        $this->contactName = $contactName;

        return $this;
    }

    public function getContactEmail(): ?string
    {
        return $this->contactEmail;
    }

    public function setContactEmail(?string $contactEmail): self
    {
        $this->contactEmail = $contactEmail;

        return $this;
    }

    public function getDocumentUrl(): ?string
    {
        return $this->documentUrl;
    }

    public function setDocumentUrl(?string $documentUrl): self
    {
        $this->documentUrl = $documentUrl;

        return $this;
    }

    public function getOriginUrl(): ?string
    {
        return $this->originUrl;
    }

    public function setOriginUrl(?string $originUrl): self
    {
        $this->originUrl = $originUrl;

        return $this;
    }

    public function getRequestUrl(): ?string
    {
        return $this->requestUrl;
    }

    public function setRequestUrl(?string $requestUrl): self
    {
        $this->requestUrl = $requestUrl;

        return $this;
    }

    public function getCreationDate(): ?DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = new DateTimeImmutable();

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getOrigin(): ?string
    {
        return $this->origin;
    }

    public function setOrigin(?string $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function getNature(): ?AidNature
    {
        return $this->nature;
    }

    public function setNature(?AidNature $nature): self
    {
        $this->nature = $nature;

        return $this;
    }

    public function getComplexity(): ?AidComplexity
    {
        return $this->complexity;
    }

    public function setComplexity(?AidComplexity $complexity): self
    {
        $this->complexity = $complexity;

        return $this;
    }

    /**
     * @return Collection<int, Simulation>
     */
    public function getSimulations(): Collection
    {
        return $this->simulations;
    }

    public function addSimulation(Simulation $simulation): self
    {
        if (!$this->simulations->contains($simulation)) {
            $this->simulations->add($simulation);
            $simulation->addSuggestedAid($this);
        }

        return $this;
    }

    public function removeSimulation(Simulation $simulation): self
    {
        if ($this->simulations->removeElement($simulation)) {
            $simulation->removeSuggestedAid($this);
        }

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        if ($this->active !== $active && $active === true) {
            $this->setActivateAt(new DateTimeImmutable());
        }

        $this->active = $active;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): self
    {
        $this->version = $version;

        return $this;
    }

    public function getForm(): ?AidForm
    {
        return $this->form;
    }

    public function setForm(?AidForm $form): self
    {
        $this->form = $form;

        return $this;
    }

    public function getContractDuration(): ?int
    {
        return $this->contractDuration;
    }

    public function setContractDuration(?int $contractDuration): self
    {
        $this->contractDuration = $contractDuration;

        return $this;
    }

    public function getTaxCreditPercent(): ?float
    {
        return $this->taxCreditPercent;
    }

    public function setTaxCreditPercent(?float $taxCreditPercent): self
    {
        $this->taxCreditPercent = $taxCreditPercent;

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildVersions(): Collection
    {
        return $this->childVersions;
    }

    public function addChildVersion(self $childVersion): self
    {
        if (!$this->childVersions->contains($childVersion)) {
            $this->childVersions->add($childVersion);
            $childVersion->setParent($this);
        }

        return $this;
    }

    public function removeChildVersion(self $childVersion): self
    {
        // set the owning side to null (unless already changed)
        if ($this->childVersions->removeElement($childVersion) && $childVersion->getParent() === $this) {
            $childVersion->setParent(null);
        }

        return $this;
    }

    public function getActivateAt(): ?DateTimeImmutable
    {
        return $this->activateAt;
    }

    public function setActivateAt(?DateTimeImmutable $activateAt): self
    {
        $this->activateAt = $activateAt;

        return $this;
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->updatedAt = new DateTime();
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new DateTime();
    }

    /**
     * @return Collection<int, AidCriterion>
     */
    public function getAidCriterions(): Collection
    {
        return $this->aidCriterions;
    }

    public function addAidCriterion(AidCriterion $aidCriterion): self
    {
        if (!$this->aidCriterions->contains($aidCriterion)) {
            $this->aidCriterions->add($aidCriterion);
            $aidCriterion->setAid($this);
        }

        return $this;
    }

    public function removeAidCriterion(AidCriterion $aidCriterion): self
    {
        if ($this->aidCriterions->removeElement($aidCriterion)) {
            // set the owning side to null (unless already changed)
            if ($aidCriterion->getAid() === $this) {
                $aidCriterion->setAid(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AidHistory>
     */
    public function getAidHistories(): Collection
    {
        return $this->aidHistories;
    }

    public function addAidHistory(AidHistory $aidHistory): self
    {
        if (!$this->aidHistories->contains($aidHistory)) {
            $this->aidHistories->add($aidHistory);
            $aidHistory->setAid($this);
        }

        return $this;
    }

    public function removeAidHistory(AidHistory $aidHistory): self
    {
        // set the owning side to null (unless already changed)
        if ($this->aidHistories->removeElement($aidHistory) && $aidHistory->getAid() === $this) {
            $aidHistory->setAid(null);
        }

        return $this;
    }

    /**
     * @param int $status
     * @return string
     */
    public static function getStatusText(int $status): string
    {
        return match ($status) {
            self::STATUS_DRAFT => "Brouillon",
            self::STATUS_VALIDATING => "A valider",
            self::STATUS_REFUSED => "Refusée",
            self::STATUS_VALIDATED => "Validée",
            default => "Statut inconnu"
        };
    }

    public function getFunding(): ?AidFunding
    {
        return $this->funding;
    }

    public function setFunding(?AidFunding $funding): self
    {
        $this->funding = $funding;

        return $this;
    }

    public function getScheme(): ?AidScheme
    {
        return $this->scheme;
    }

    public function setScheme(?AidScheme $scheme): self
    {
        $this->scheme = $scheme;

        return $this;
    }

    public function getEnvironment(): ?AidEnvironment
    {
        return $this->environment;
    }

    public function setEnvironment(?AidEnvironment $environment): self
    {
        $this->environment = $environment;

        return $this;
    }

    public function getMinimumAmountPerHectare(): ?float
    {
        return $this->minimumAmountPerHectare;
    }

    public function setMinimumAmountPerHectare(?float $minimumAmountPerHectare): self
    {
        $this->minimumAmountPerHectare = $minimumAmountPerHectare;

        return $this;
    }

    public function getMaximumAmountPerHectare(): ?float
    {
        return $this->maximumAmountPerHectare;
    }

    public function setMaximumAmountPerHectare(?float $maximumAmountPerHectare): self
    {
        $this->maximumAmountPerHectare = $maximumAmountPerHectare;

        return $this;
    }

    /**
     * @return Collection<int, AidFundingScale>
     */
    public function getAidFundingScales(): Collection
    {
        return $this->aidFundingScales;
    }

    public function addAidFundingScale(AidFundingScale $aidFundingScale): self
    {
        if (!$this->aidFundingScales->contains($aidFundingScale)) {
            $this->aidFundingScales->add($aidFundingScale);
            $aidFundingScale->setAid($this);
        }

        return $this;
    }

    public function removeAidFundingScale(AidFundingScale $aidFundingScale): self
    {
        if ($this->aidFundingScales->removeElement($aidFundingScale)) {
            // set the owning side to null (unless already changed)
            if ($aidFundingScale->getAid() === $this) {
                $aidFundingScale->setAid(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AidFundingPlan>
     */
    public function getAidFundingPlans(): Collection
    {
        return $this->aidFundingPlans;
    }

    public function addAidFundingPlan(AidFundingPlan $aidFundingPlan): self
    {
        if (!$this->aidFundingPlans->contains($aidFundingPlan)) {
            $this->aidFundingPlans->add($aidFundingPlan);
            $aidFundingPlan->setAid($this);
        }

        return $this;
    }

    public function removeAidFundingPlan(AidFundingPlan $aidFundingPlan): self
    {
        if ($this->aidFundingPlans->removeElement($aidFundingPlan)) {
            // set the owning side to null (unless already changed)
            if ($aidFundingPlan->getAid() === $this) {
                $aidFundingPlan->setAid(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AidFundingFixedAmount>
     */
    public function getAidFundingFixedAmounts(): Collection
    {
        return $this->aidFundingFixedAmounts;
    }

    public function addAidFundingFixedAmount(AidFundingFixedAmount $aidFundingFixedAmount): self
    {
        if (!$this->aidFundingFixedAmounts->contains($aidFundingFixedAmount)) {
            $this->aidFundingFixedAmounts->add($aidFundingFixedAmount);
            $aidFundingFixedAmount->setAid($this);
        }

        return $this;
    }

    public function removeAidFundingFixedAmount(AidFundingFixedAmount $aidFundingFixedAmount): self
    {
        if ($this->aidFundingFixedAmounts->removeElement($aidFundingFixedAmount)) {
            // set the owning side to null (unless already changed)
            if ($aidFundingFixedAmount->getAid() === $this) {
                $aidFundingFixedAmount->setAid(null);
            }
        }

        return $this;
    }
}
