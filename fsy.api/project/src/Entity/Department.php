<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\DepartmentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DepartmentRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getDepartments' => [
            'path' => '',
            'method' => 'GET',
            'pagination_enabled' => false,
            'normalization_context' => ['groups' => 'department:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'department:read_full'],
            'denormalization_context' => ['groups' => 'department:read_full'],
        ]
    ],
    itemOperations: [
        'getDepartment' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'department:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'department:write'],
            'denormalization_context' => ['groups' => 'department:write'],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/department',
    securityMessage: "You don't have permission to access this resource"
)]
class Department
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['department:read', 'department:write', 'department:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['department:read', 'department:write', 'department:read_full'])]
    private string $label;

    #[ORM\Column(unique: true, nullable: true)]
    #[Groups(['department:read', 'department:write', 'department:read_full'])]
    private ?string $number = null;

    #[ORM\Column(nullable: false)]
    #[Groups(['department:read', 'department:write', 'department:read_full'])]
    private bool $active = false;

    #[ORM\ManyToMany(targetEntity: Region::class, inversedBy: 'departments')]
    #[Groups(['department:read_full'])]
    private Collection $linkedRegions;

    public function __construct()
    {
        $this->linkedRegions = new ArrayCollection();
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
     * @return Collection<int, Region>
     */
    public function getLinkedRegions(): Collection
    {
        return $this->linkedRegions;
    }

    public function addLinkedRegion(Region $region): self
    {
        if (!$this->linkedRegions->contains($region)) {
            $this->linkedRegions->add($region);
            $region->addDepartment($this);
        }
        return $this;
    }

    public function removeLinkedRegion(Region $region): self
    {
        if ($this->linkedRegions->removeElement($region)) {
            $region->removeDepartment($this);
        }
        return $this;
    }
}
