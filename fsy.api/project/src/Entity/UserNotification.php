<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\UserNotificationRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserNotificationRepository::class)]
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
    routePrefix: '/user-notification',
    securityMessage: "You don't have permission to access this resource"
)]
#[ApiFilter(SearchFilter::class)]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(DateFilter::class, properties: ['createdAt', 'updatedAt'])]
class UserNotification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['userNotification:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['userNotification:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['userNotification:read'])]
    private ?string $content = null;

    #[ORM\Column]
    #[Groups(['userNotification:read'])]
    private bool $seen = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['userNotification:read'])]
    private ?string $path = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['userNotification:read'])]
    private DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    #[Groups(['userNotification:read'])]
    private DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function isSeen(): bool
    {
        return $this->seen;
    }

    public function setSeen(bool $seen): self
    {
        $this->seen = $seen;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(?string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
