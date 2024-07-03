<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SimulationAnswersRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SimulationAnswersRepository::class)]
#[ORM\UniqueConstraint(columns: ['simulation_id', 'question_id'])]
#[ApiResource(
    collectionOperations: [
        'getSimulationAnswers' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'simulationAnswers:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'simulationAnswers:read'],
            'denormalization_context' => ['groups' => 'simulationAnswers:read'],
        ]
    ],
    itemOperations: [
        'getSimulationAnswer' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'simulationAnswers:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/simulation-answers',
    securityMessage: "You don't have permission to access this resource"
)]
class SimulationAnswers
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['simulationAnswers:read', 'simulationAnswers:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 3, nullable: false)]
    #[Groups(['simulationAnswers:read'])]
    private string $type;

    #[ORM\Column(nullable: false)]
    #[Groups(['simulationAnswers:read'])]
    private array $value = [];

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['simulationAnswers:read_full'])]
    private ?Simulation $simulation = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['simulationAnswers:read_full'])]
    private ?Question $question = null;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getValue(): array
    {
        return $this->value;
    }

    public function setValue(array $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getSimulation(): ?Simulation
    {
        return $this->simulation;
    }

    public function setSimulation(?Simulation $simulation): self
    {
        $this->simulation = $simulation;

        return $this;
    }

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(?Question $question): self
    {
        $this->question = $question;

        return $this;
    }
}
