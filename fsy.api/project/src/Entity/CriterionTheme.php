<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CriterionThemeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CriterionThemeRepository::class)]
#[ApiResource(
    collectionOperations: [
        'GET' => [
            'path' => '',
            'normalization_context' => ['groups' => ['criterionTheme:read']]
        ]
    ],
    itemOperations: [
        'GET' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => ['criterionTheme:read']]
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/criteria-theme',
    securityMessage: "You don't have permission to access this resource"
)]
class CriterionTheme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['criterionTheme:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['criterionTheme:read'])]
    private string $name;

    #[ORM\Column(nullable: false)]
    #[Groups(['criterionTheme:read'])]
    private int $position = 1;

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

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }
}
