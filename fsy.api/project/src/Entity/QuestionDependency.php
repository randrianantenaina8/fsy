<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\QuestionDependencyRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuestionDependencyRepository::class)]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => ''
        ],
        'GET' => [
            'path' => ''
        ]
    ],
    itemOperations: [
        'GET' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/question-dependency',
    securityMessage: "You don't have permission to access this resource"
)]
#[ApiFilter(SearchFilter::class)]
class QuestionDependency
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['questionDependency:read', 'questionDependency:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['questionDependency:read', 'questionDependency:write'])]
    private ?string $type = null;

    #[ORM\Column]
    #[Groups(['questionDependency:read', 'questionDependency:write'])]
    private array $value = [];

    #[ORM\Column(nullable: true)]
    #[Groups(['questionDependency:read', 'questionDependency:write'])]
    private ?float $valueMin = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['questionDependency:read', 'questionDependency:write'])]
    private ?float $valueMax = null;

    #[ORM\ManyToOne(inversedBy: 'questionDependencies')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['questionDependency:read'])]
    private ?Question $origin = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['questionDependency:read'])]
    private ?Question $target = null;

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

    public function getOrigin(): ?Question
    {
        return $this->origin;
    }

    public function setOrigin(Question $origin): self
    {
        $this->origin = $origin;

        return $this;
    }

    public function getTarget(): ?Question
    {
        return $this->target;
    }

    public function setTarget(Question $target): self
    {
        $this->target = $target;

        return $this;
    }
}
