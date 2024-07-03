<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Odm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Controller\GetLogsAction;
use DateTimeImmutable;
use DateTimeInterface;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\LogsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LogsRepository::class)]
#[ApiResource(
    collectionOperations: [
        'getLogs' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetLogsAction::class
        ]
    ],
    itemOperations: [
        'getLog' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'logs:read'],
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    paginationItemsPerPage: 100,
    routePrefix: '/logs',
    securityMessage: "You don't have permission to access this resource"
)]
#[ApiFilter(OrderFilter::class)]
class Logs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['logs:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['logs:read'])]
    private DateTimeInterface $timeStamp;

    #[ORM\Column(length: 100, nullable: false)]
    #[Groups(['logs:read'])]
    private string $type;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['logs:read'])]
    private string $info;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['logs:read'])]
    private ?string $user;

    public function __construct()
    {
        $this->timeStamp = new DateTimeImmutable();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimeStamp(): DateTimeInterface
    {
        return $this->timeStamp;
    }

    public function setTimeStamp(DateTimeInterface $timeStamp): self
    {
        $this->timeStamp = $timeStamp;

        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getInfo(): string
    {
        return $this->info;
    }

    public function setInfo(string $info): self
    {
        $this->info = $info;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getUser(): ?string
    {
        return $this->user;
    }

    /**
     * @param string|null $user
     */
    public function setUser(?string $user): void
    {
        $this->user = $user;
    }
}
