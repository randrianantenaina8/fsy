<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\QuestionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: QuestionRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getQuestions' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'question:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'question:read_full'],
            'denormalization_context' => ['groups' => 'question:read_full'],
        ]
    ],
    itemOperations: [
        'getQuestion' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'question:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['question:read_full', 'department:write']],
            'denormalization_context' => ['groups' => ['question:read_full', 'department:write']],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/question',
    securityMessage: "You don't have permission to access this resource"
)]
class Question
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['question:read', 'question:read_full'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['question:read', 'question:read_full'])]
    private string $questionText;

    #[ORM\Column(nullable: false)]
    #[Groups(['question:read', 'question:read_full'])]
    private int $position = 1;

    #[ORM\Column(nullable: false)]
    #[Groups(['question:read', 'question:read_full'])]
    private bool $mandatory = false;

    #[ORM\ManyToOne(inversedBy: 'questions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['question:read_full'])]
    private Step $step;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['question:read', 'question:read_full'])]
    private Criterion $criterion;

    #[ORM\OneToMany(mappedBy: 'origin', targetEntity: QuestionDependency::class, orphanRemoval: true)]
    #[Groups(['question:read_full'])]
    private Collection $questionDependencies;

    public function __construct()
    {
        $this->questionDependencies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestionText(): string
    {
        return $this->questionText;
    }

    public function setQuestionText(string $questionText): self
    {
        $this->questionText = $questionText;

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

    public function getStep(): Step
    {
        return $this->step;
    }

    public function setStep(Step $step): self
    {
        $this->step = $step;

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

    public function getCriterion(): Criterion
    {
        return $this->criterion;
    }

    public function setCriterion(Criterion $criterion): self
    {
        $this->criterion = $criterion;

        return $this;
    }

    /**
     * @return Collection<int, QuestionDependency>
     */
    public function getQuestionDependencies(): Collection
    {
        return $this->questionDependencies;
    }

    public function addQuestionDependency(QuestionDependency $questionDependency): self
    {
        if (!$this->questionDependencies->contains($questionDependency)) {
            $this->questionDependencies->add($questionDependency);
            $questionDependency->setOrigin($this);
        }

        return $this;
    }

    public function removeQuestionDependency(QuestionDependency $questionDependency): self
    {
        // set the owning side to null (unless already changed)
        if ($this->questionDependencies->removeElement($questionDependency)
            && $questionDependency->getOrigin() === $this
        ) {
            $questionDependency->setOrigin(null);
        }

        return $this;
    }
}
