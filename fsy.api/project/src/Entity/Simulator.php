<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Simulator\GetSimulatorAction;
use App\Repository\SimulatorRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SimulatorRepository::class)]
#[ORM\UniqueConstraint(columns: ['version_number', 'parent_id'])]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'simulator:read'],
            'denormalization_context' => ['groups' => 'simulator:read'],
        ],
        'getSimulatorCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetSimulatorAction::class,
            'normalization_context' => ['groups' => ['simulator:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAllSimulators' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetSimulatorAction::class,
            'normalization_context' => ['groups' => 'simulator:read_full', 'step:read', 'question:read', 'user:read'],
            'defaults' => ["_api_receive" => false]
        ]
    ],
    itemOperations: [
        'getSimulator' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'simulator:read_full'],
        ],
        'getSimulatorDetails' => [
            'method' => 'GET',
            'path' => '/{id}/details',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' =>
                ['simulator:read_details', 'step:read', 'question:read', 'user:read']
            ],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'simulator:read'],
            'denormalization_context' => ['groups' => 'simulator:write'],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/simulator',
    securityMessage: "You don't have permission to access this resource"
)]
class Simulator
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private int $versionNumber = 1;

    #[ORM\Column]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private bool $published = false;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'childVersions')]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private ?self $parent = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private ?User $createdBy = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['simulator:read', 'simulator:read_full', 'simulator:read_details'])]
    private ?DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    #[Groups(['simulator:read_full', 'simulator:read_details'])]
    private Collection $childVersions;

    #[ORM\OneToMany(mappedBy: 'simulator', targetEntity: Step::class, orphanRemoval: true)]
    #[Groups(['simulator:read_details'])]
    private Collection $steps;

    #[ORM\OneToMany(mappedBy: 'simulator', targetEntity: Simulation::class)]
    #[Groups(['simulator:read_details'])]
    private Collection $simulations;

    public function __construct()
    {
        $this->childVersions = new ArrayCollection();
        $this->steps = new ArrayCollection();
        $this->simulations = new ArrayCollection();
        $this->createdAt = new DateTimeImmutable();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVersionNumber(): int
    {
        return $this->versionNumber;
    }

    public function setVersionNumber(int $versionNumber): self
    {
        $this->versionNumber = $versionNumber;

        return $this;
    }

    public function isPublished(): bool
    {
        return $this->published;
    }

    public function setPublished(bool $published): self
    {
        $this->published = $published;

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
     * @return User|null
     */
    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    /**
     * @param User|null $createdBy
     */
    public function setCreatedBy(?User $createdBy): void
    {
        $this->createdBy = $createdBy;
    }

    /**
     * @return DateTimeImmutable
     */
    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * @param DateTimeImmutable $createdAt
     */
    public function setCreatedAt(DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
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

    /**
     * @return Collection<int, Step>
     */
    public function getSteps(): Collection
    {
        return $this->steps;
    }

    public function addStep(Step $step): self
    {
        if (!$this->steps->contains($step)) {
            $this->steps->add($step);
            $step->setSimulator($this);
        }

        return $this;
    }

    public function removeStep(Step $step): self
    {
        // set the owning side to null (unless already changed)
        if ($this->steps->removeElement($step) && $step->getSimulator() === $this) {
            $step->setSimulator(null);
        }

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
            $simulation->setSimulator($this);
        }

        return $this;
    }

    public function removeSimulation(Simulation $simulation): self
    {
        // set the owning side to null (unless already changed)
        if ($this->simulations->removeElement($simulation) && $simulation->getSimulator() === $this) {
            $simulation->setSimulator(null);
        }

        return $this;
    }
}
