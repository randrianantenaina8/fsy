<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\StepRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: StepRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getSimulatorSteps' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'step:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'step:read_full'],
            'denormalization_context' => ['groups' => 'step:read_full'],
        ]
    ],
    itemOperations: [
        'getSimulatorStep' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'step:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['step:write', 'step:read_full', 'department:write']],
            'denormalization_context' => ['groups' => ['step:write', 'step:read_full', 'department:write']],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/step',
    securityMessage: "You don't have permission to access this resource"
)]
class Step
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['step:read', 'step:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['step:read', 'step:read_full'])]
    private string $name;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['step:read', 'step:read_full'])]
    private string $icon;

    #[ORM\Column(nullable: false)]
    #[Groups(['step:read', 'step:read_full'])]
    private int $position;

    #[ORM\ManyToOne(inversedBy: 'steps')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['step:read_full'])]
    private Simulator $simulator;

    #[ORM\OneToMany(mappedBy: 'step', targetEntity: Question::class, orphanRemoval: true)]
    #[Groups(['step:read', 'step:read_full'])]
    private Collection $questions;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
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

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function setIcon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

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

    /**
     * @return Collection<int, Question>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setStep($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        // set the owning side to null (unless already changed)
        if ($this->questions->removeElement($question) && $question->getStep() === $this) {
            $question->setStep(null);
        }

        return $this;
    }
}
