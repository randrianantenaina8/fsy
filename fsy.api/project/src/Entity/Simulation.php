<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SimulationRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SimulationRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getSimulations' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'simulation:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'simulation:read'],
            'denormalization_context' => ['groups' => 'simulation:read'],
        ]
    ],
    itemOperations: [
        'getSimulation' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'simulation:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/simulation',
    securityMessage: "You don't have permission to access this resource"
)]
class Simulation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private DateTimeInterface $date;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private ?string $contactName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private ?string $contactEmail = null;

    #[ORM\ManyToOne(inversedBy: 'simulations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private Simulator $simulator;

    #[ORM\ManyToOne(inversedBy: 'simulations')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['simulation:read', 'simulation:read_full'])]
    private ?User $user = null;

    #[ORM\ManyToMany(targetEntity: Aid::class, inversedBy: 'simulations')]
    #[Groups(['simulation:read_full'])]
    private Collection $suggestedAids;

    public function __construct()
    {
        $this->date = new DateTime();
        $this->suggestedAids = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(DateTimeInterface $date): self
    {
        $this->date = $date;

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

    public function getSimulator(): Simulator
    {
        return $this->simulator;
    }

    public function setSimulator(Simulator $simulator): self
    {
        $this->simulator = $simulator;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Aid>
     */
    public function getSuggestedAids(): Collection
    {
        return $this->suggestedAids;
    }

    public function addSuggestedAid(Aid $suggestedAid): self
    {
        if (!$this->suggestedAids->contains($suggestedAid)) {
            $this->suggestedAids->add($suggestedAid);
        }

        return $this;
    }

    public function removeSuggestedAid(Aid $suggestedAid): self
    {
        $this->suggestedAids->removeElement($suggestedAid);

        return $this;
    }
}
