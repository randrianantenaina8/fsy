<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Organization\GetOrganizationAction;
use App\Repository\OrganizationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: OrganizationRepository::class)]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'organization:read'],
            'denormalization_context' => ['groups' => 'organization:read'],
        ],
        'getOrganizationsCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetOrganizationAction::class,
            'normalization_context' => ['groups' => ['organization:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAllOrganizations' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetOrganizationAction::class,
            'normalization_context' => ['groups' => 'organization:read'],
            'defaults' => ["_api_receive" => false]
        ]
    ],
    itemOperations: [
        'getOrganization' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'organization:read'],
        ],
        'getOrganizationByUuid' => [
            'method' => 'GET',
            'path' => '/uuid',
            'controller' => GetOrganizationAction::class,
            'normalization_context' => ['groups' => 'organization:read'],
            'defaults' => ["_api_receive" => false],
            'security' => "is_granted('PUBLIC_ACCESS')"
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'organization:read'],
            'denormalization_context' => ['groups' => 'organization:read'],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+']
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/organization',
    securityMessage: "You don't have permission to access this resource"
)]
class Organization
{
    public final const TYPE_ORGANISM = "Organisme";
    public final const TYPE_PARTNER = "Partenaire";
    public final const TYPE_FSY = "Fransylva";
    public final const TYPE_OTHER = "Autre";

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['organization:read', 'organization:read_full', 'user:read', 'aid:read', 'aid:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true, nullable: false)]
    #[Groups(['organization:read', 'organization:read_full', 'user:read', 'aid:read'])]
    private string $name;

    #[ORM\Column(nullable: false)]
    #[Groups(['organization:read', 'organization:read_full', 'user:read', 'aid:read'])]
    private bool $organism = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['organization:read', 'organization:read_full', 'user:read', 'aid:read'])]
    private bool $partner = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['organization:read', 'organization:read_full', 'user:read', 'aid:read'])]
    private bool $other = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $contactName;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $contactEmail;

    #[ORM\Column(length: 17, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $contactPhone;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $address;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $address2;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $postalCode;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $city;

    #[ORM\Column(length: 100, nullable: false)]
    #[Groups(['organization:read', 'organization:read_full'])]
    private string $uuid;

    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: User::class)]
    #[Groups(['organization:read_full'])]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->uuid = Uuid::v4()->toBase58();
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

    public function isOrganism(): bool
    {
        return $this->organism;
    }

    public function setOrganism(bool $isOrganism): self
    {
        $this->organism = $isOrganism;

        return $this;
    }

    public function isPartner(): bool
    {
        return $this->partner;
    }

    public function setPartner(bool $isPartner): self
    {
        $this->partner = $isPartner;

        return $this;
    }

    /**
     * @return bool
     */
    public function isOther(): bool
    {
        return $this->other;
    }

    /**
     * @param bool $other
     */
    public function setOther(bool $other): void
    {
        $this->other = $other;
    }

    /**
     * @return string
     */
    public function getContactName(): string
    {
        return $this->contactName;
    }

    /**
     * @param string $contactName
     */
    public function setContactName(string $contactName): void
    {
        $this->contactName = $contactName;
    }

    /**
     * @return string
     */
    public function getContactEmail(): string
    {
        return $this->contactEmail;
    }

    /**
     * @param string $contactEmail
     */
    public function setContactEmail(string $contactEmail): void
    {
        $this->contactEmail = $contactEmail;
    }

    /**
     * @return string
     */
    public function getContactPhone(): string
    {
        return $this->contactPhone;
    }

    /**
     * @param string $contactPhone
     */
    public function setContactPhone(string $contactPhone): void
    {
        $this->contactPhone = $contactPhone;
    }

    /**
     * @return string
     */
    public function getAddress(): string
    {
        return $this->address;
    }

    /**
     * @param string $address
     */
    public function setAddress(string $address): void
    {
        $this->address = $address;
    }

    /**
     * @return string
     */
    public function getAddress2(): string
    {
        return $this->address2;
    }

    /**
     * @param string $address2
     */
    public function setAddress2(string $address2): void
    {
        $this->address2 = $address2;
    }

    /**
     * @return string
     */
    public function getPostalCode(): string
    {
        return $this->postalCode;
    }

    /**
     * @param string $postalCode
     */
    public function setPostalCode(string $postalCode): void
    {
        $this->postalCode = $postalCode;
    }

    /**
     * @return string
     */
    public function getCity(): string
    {
        return $this->city;
    }

    /**
     * @param string $city
     */
    public function setCity(string $city): void
    {
        $this->city = $city;
    }

    /**
     * @return string
     */
    public function getUuid(): string
    {
        return $this->uuid;
    }

    /**
     * @param string $uuid
     */
    public function setUuid(string $uuid): void
    {
        $this->uuid = $uuid;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setOrganization($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        // set the owning side to null (unless already changed)
        if ($this->users->removeElement($user) && $user->getOrganization() === $this) {
            $user->setOrganization(null);
        }

        return $this;
    }
}
