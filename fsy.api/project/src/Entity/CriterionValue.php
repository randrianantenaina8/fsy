<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Repository\CriterionValueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

#[ORM\Entity(repositoryClass: CriterionValueRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getCriteriaValues' => [
            'path' => '',
            'method' => 'GET',
            'normalization_context' => ['groups' => 'criteriaValue:read_full'],
        ],
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'criteriaValue:read_full'],
            'denormalization_context' => ['groups' => 'criteriaValue:read_full'],
        ]
    ],
    itemOperations: [
        'getCriteriaValue' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'criteriaValue:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'criteriaValue:write'],
            'denormalization_context' => ['groups' => 'criteriaValue:write'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/criteria-value',
    securityMessage: "You don't have permission to access this resource"
)]
/**
 * @ApiFilter(SearchFilter::class, properties={"criterion.shortName": "exact"})
 */
class CriterionValue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['criteriaValue:read', 'criteriaValue:write', 'criteriaValue:read_full', 'aid:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['criteriaValue:read', 'criteriaValue:write', 'criteriaValue:read_full'])]
    private string $value;

    #[ORM\Column(nullable: false)]
    #[Groups(['criteriaValue:read', 'criteriaValue:write', 'criteriaValue:read_full'])]
    private bool $active = true;

    #[ORM\ManyToOne(inversedBy: 'criterionValues')]
    #[ORM\JoinColumn(nullable: true, onDelete: "cascade")]
    #[Groups(['criteriaValue:read_full'])]
    private ?Criterion $criterion;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     */
    public function setActive(bool $active): void
    {
        $this->active = $active;
    }

    public function getCriterion(): ?Criterion
    {
        return $this->criterion;
    }

    public function setCriterion(?Criterion $criterion): self
    {
        $this->criterion = $criterion;

        return $this;
    }
}
