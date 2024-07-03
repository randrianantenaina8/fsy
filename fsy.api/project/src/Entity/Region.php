<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RegionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RegionRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getRegions' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => ['region:read_full', 'department:read']],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'region:read_full'],
            'denormalization_context' => ['groups' => 'region:read_full'],
        ]
    ],
    itemOperations: [
        'getRegion' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['region:read_full', 'department:read']],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['region:write', 'region:read_full', 'department:write']],
            'denormalization_context' => ['groups' => ['region:write', 'region:read_full', 'department:write']],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/region',
    securityMessage: "You don't have permission to access this resource"
)]
class Region
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['region:read', 'region:write', 'region:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['region:read', 'region:write', 'region:read_full'])]
    private string $label;

    #[ORM\Column(unique: true, nullable: true)]
    #[Groups(['region:read', 'region:write', 'region:read_full'])]
    private ?string $number = null;

    #[ORM\Column(nullable: false)]
    #[Groups(['region:read', 'region:write', 'region:read_full'])]
    private bool $active = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['region:read', 'region:write', 'region:read_full'])]
    private bool $custom = true;

    #[ORM\ManyToMany(targetEntity: Department::class, mappedBy: 'linkedRegions')]
    #[Groups(['region:read_full'])]
    private Collection $departments;

    public function __construct()
    {
        $this->departments = new ArrayCollection();
    }

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

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function setNumber(?string $number): self
    {
        $this->number = $number;

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
    public function isCustom(): bool
    {
        return $this->custom;
    }

    /**
     * @param bool $custom
     */
    public function setCustom(bool $custom): void
    {
        $this->custom = $custom;
    }

    /**
     * @return Collection<int, Department>
     */
    public function getDepartments(): Collection
    {
        return $this->departments;
    }

    public function addDepartment(Department $department): self
    {
        if (!$this->departments->contains($department)) {
            $this->departments->add($department);
            $department->addLinkedRegion($this);
        }
        return $this;
    }

    public function removeDepartment(Department $department): self
    {
        if ($this->departments->removeElement($department)) {
            $department->removeLinkedRegion($this);
        }
        return $this;
    }
}
