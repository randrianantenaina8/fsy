<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AidCriterionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidCriterionRepository::class)]
#[ORM\UniqueConstraint(columns: ['aid_id', 'criterion_id'])]
#[ApiResource(
    collectionOperations: [
        'getAidCriterion' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'aidCriterion:read'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'aidCriterion:read'],
            'denormalization_context' => ['groups' => 'aidCriterion:read'],
        ]
    ],
    itemOperations: [
        'getAidCriteria' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'aidCriterion:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-criterion',
    securityMessage: "You don't have permission to access this resource",
)]
class AidCriterion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidCriterion:read', 'aidCriterion:read_full', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 3, nullable: false)]
    #[Groups(['aidCriterion:read', 'aid:read', 'aid:write'])]
    private string $type;

    #[ORM\Column(nullable: false)]
    #[Groups(['aidCriterion:read', 'aid:read', 'aid:write'])]
    private array $value = [];

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['aidCriterion:read_full', 'aid:read', 'aid:write'])]
    private Criterion $criterion;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'aidCriterions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Aid $aid = null;

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

    /**
     * @return Criterion
     */
    public function getCriterion(): Criterion
    {
        return $this->criterion;
    }

    /**
     * @param Criterion $criterion
     */
    public function setCriterion(Criterion $criterion): void
    {
        $this->criterion = $criterion;
    }

    public function getAid(): ?Aid
    {
        return $this->aid;
    }

    public function setAid(?Aid $aid): self
    {
        $this->aid = $aid;

        return $this;
    }
}
