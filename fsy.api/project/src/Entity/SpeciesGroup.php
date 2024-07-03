<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SpeciesGroupRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SpeciesGroupRepository::class)]
#[ApiResource(
    collectionOperations: [
        "getAllSpeciesGroup" => [
            "path" => "",
            'method' => 'GET',
            'normalization_context' => ['groups' => ['speciesGroup:read_full']],
        ]
    ],
    itemOperations: [
        'getSpeciesGroup' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['speciesGroup:read_full']],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/species-group',
    securityMessage: "You don't have permission to access this resource"
)]
class SpeciesGroup
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["speciesGroup:read_full", "aid:read", "aid:write"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['speciesGroup:read_full'])]
    private ?string $label = null;

    #[ORM\Column(length: 10)]
    #[Groups(['speciesGroup:read_full'])]
    private ?string $shortName = null;

    #[ORM\OneToMany(mappedBy: 'speciesGroup', targetEntity: Species::class, orphanRemoval: true)]
    #[Groups(['speciesGroup:read_full'])]
    private Collection $species;

    public function __construct()
    {
        $this->species = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getShortName(): ?string
    {
        return $this->shortName;
    }

    public function setShortName(string $shortName): self
    {
        $this->shortName = $shortName;

        return $this;
    }

    /**
     * @return Collection<int, Species>
     */
    public function getSpecies(): Collection
    {
        return $this->species;
    }

    public function addSpecies(Species $species): self
    {
        if (!$this->species->contains($species)) {
            $this->species->add($species);
            $species->setSpeciesGroup($this);
        }

        return $this;
    }

    public function removeSpecies(Species $species): self
    {
        if ($this->species->removeElement($species)) {
            // set the owning side to null (unless already changed)
            if ($species->getSpeciesGroup() === $this) {
                $species->setSpeciesGroup(null);
            }
        }

        return $this;
    }
}
