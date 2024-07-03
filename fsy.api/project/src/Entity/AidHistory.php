<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Aid\GetAidHistoryAction;
use App\Repository\AidHistoryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AidHistoryRepository::class)]
#[ApiResource(
    collectionOperations: [
        'GetHistoryByAidId' => [
            'method' => 'GET',
            'path' => '',
            'requirements' => ['aid_id' => '\d+'],
            'controller' => GetAidHistoryAction::class,
            'normalization_context' => ['groups' => ['aidHistory:read']],
            'defaults' => ["_api_receive" => false],
        ]
    ],
    itemOperations: [
        'GET' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/aid-history',
    securityMessage: "You don't have permission to access this resource"
)]
class AidHistory
{
    public final const AID_CREATION = 0;
    public final const VERSION_CREATION = 1;
    public final const CONTENT_EDIT = 2;
    public final const STATUS_EDIT = 3;
    public final const STATUS_CHANGED_TO_DRAFT = 4;
    public final const STATUS_CHANGED_TO_VALIDATING = 5;
    public final const STATUS_CHANGED_TO_REFUSED = 6;
    public final const STATUS_CHANGED_TO_VALIDATED = 7;
    public final const STATUS_CHANGED_TO_PUBLISHED = 8;
    public final const STATUS_CHANGED_TO_UNPUBLISHED = 9;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['aidHistory:read', 'aidHistory:write'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['aidHistory:read', 'aidHistory:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidHistory:read', 'aidHistory:write'])]
    private ?string $user = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['aidHistory:read', 'aidHistory:write'])]
    private ?string $action = null;

    #[ORM\ManyToOne(inversedBy: 'aidHistories')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['aidHistory:write'])]
    private ?Aid $aid = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getUser(): ?string
    {
        return $this->user;
    }

    public function setUser(string $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): self
    {
        $this->action = $action;

        return $this;
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
