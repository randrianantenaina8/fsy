<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\User\ActivateUserAction;
use App\Controller\User\AuthenticateAction;
use App\Controller\User\ChangeUserPasswordAction;
use App\Controller\User\ForgottenPasswordAction;
use App\Controller\User\GetUserAction;
use App\Controller\User\GetUserAuthorizationAction;
use App\Controller\User\GetUserByTokenAction;
use App\Controller\User\GetUserByPasswordTokenAction;
use App\Controller\User\GetUserIdByIdentifier;
use App\Controller\User\RefreshUserTokenAction;
use App\Controller\User\ResetUserPasswordAction;
use App\Controller\User\UpdateUserAction;
use App\Repository\UserRepository;
use DateTime;
use DateTimeImmutable;
use DateTimeInterface;
use DateTimeZone;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource(
    collectionOperations: [
        'identifier' => [
            'path' => '/identifier',
            'method' => 'POST',
            'controller' => GetUserIdByIdentifier::class,
            'normalization_context' => ['groups' => ['user:read', 'profile:read', 'organization:read']]
        ],
        'login' => [
            'path' => '/login',
            'method' => 'POST',
            'controller' => AuthenticateAction::class,
            'normalization_context' => ['groups' => ['user:read', 'profile:read', 'organization:read']],
            'denormalization_context' => ['groups' => ['user:read', 'profile:read', 'organization:read']]
        ],
        'GetUserByToken' => [
            'path' => '/token',
            'method' => 'POST',
            'controller' => GetUserByTokenAction::class,
            'normalization_context' => ['groups' => ['user:read_strict', 'user:token']],
            'denormalization_context' => ['groups' => ['user:read_strict', 'user:token']]
        ],
        'GetUserByPasswordToken' => [
            'path' => '/password-token',
            'method' => 'POST',
            'controller' => GetUserByPasswordTokenAction::class,
            'normalization_context' => ['groups' => ['user:read_strict', 'user:token']],
            'denormalization_context' => ['groups' => ['user:read_strict', 'user:token']]
        ],
        'refreshUserToken' => [
            'path' => '/refresh',
            'method' => 'POST',
            'controller' => RefreshUserTokenAction::class,
            'normalization_context' => ['groups' => ['user:read_strict', 'user:token']],
            'denormalization_context' => ['groups' => ['user:read_strict', 'user:token']]
        ],
        'POST' => [
            'path' => '',
            'security' => "is_granted('ROLE_ADMIN')",
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:read'],
        ],
        'getUserCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetUserAction::class,
            'security' => "is_granted('ROLE_ADMIN')",
            'normalization_context' => ['groups' => ['user:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAllUsers' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetUserAction::class,
            'security' => "is_granted('ROLE_ADMIN')",
            'normalization_context' => ['groups' => ['user:read']],
            'defaults' => ["_api_receive" => false]
        ]
    ],
    itemOperations: [
        'GET' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'security' => "is_granted('ROLE_ADMIN') or object.user == user",
            'normalization_context' => [
                'groups' => ['user:read']
            ],
        ],
        'forgotPassword' => [
            'path' => '/{id}/password-forgotten',
            'method' => 'GET',
            'requirements' => ['id' => '\d+'],
            'controller' => ForgottenPasswordAction::class,
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:write'],
        ],
        'changePassword' => [
            'path' => '/{id}/change-password',
            'method' => 'PUT',
            'requirements' => ['id' => '\d+'],
            'controller' => ChangeUserPasswordAction::class,
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:write'],
        ],
        'resetPassword' => [
            'path' => '/{id}/reset-password',
            'method' => 'PUT',
            'requirements' => ['id' => '\d+'],
            'controller' => ResetUserPasswordAction::class,
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:write'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'method' => 'PUT',
            'requirements' => ['id' => '\d+'],
            'security' => "is_granted('ROLE_ADMIN') or object.user == user",
            'controller' => UpdateUserAction::class,
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:write']
        ],
        'activateUser' => [
            'path' => '/{id}/activate',
            'method' => 'GET',
            'requirements' => ['id' => '\d+'],
            'security' => "is_granted('ROLE_ADMIN') or object.user == user",
            'controller' => ActivateUserAction::class,
            'normalization_context' => ['groups' => 'user:read'],
            'denormalization_context' => ['groups' => 'user:read']
        ],
        'getUserAuthorization' => [
            'path' => '/{id}/authorization',
            'method' => 'POST',
            'requirements' => ['id' => '\d+'],
            'controller' => GetUserAuthorizationAction::class
        ]
    ],
    routePrefix: '/user'
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'user:read_strict',])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true, nullable: false)]
    #[Groups(['user:read', 'user:read_strict', 'user:update', 'user:write'])]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = ['ROLE_USER'];

    #[ORM\Column(nullable: false)]
    #[Groups(['user:write'])]
    private string $password = "password";

    #[ORM\Column(length: 100)]
    #[Groups(['user:read', 'user:read_strict', 'user:update', 'user:write'])]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(length: 100)]
    #[Groups(['user:read', 'user:read_strict', 'user:update', 'user:write'])]
    #[Assert\NotBlank]
    private ?string $surname = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: false)]
    #[Groups(['user:read', 'user:write',])]
    private DateTimeInterface $creationDate;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['user:read', 'user:read_strict',])]
    private DateTimeInterface $activationDate;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read', 'user:read_strict',])]
    private DateTimeInterface $updatedAt;

    #[ORM\Column(nullable: false)]
    #[Groups(['user:read', 'user:read_strict',])]
    private bool $status = false;

    #[ORM\Column(nullable: false)]
    #[Groups(['user:read', 'user:read_strict',])]
    private bool $active = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:token'])]
    private ?string $lastPasswordToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:token'])]
    private ?DateTimeInterface $tokenGeneratedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read_full', 'user:update_full', 'user:write_full'])]
    private ?string $apiRefreshToken = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read_full', 'user:update_full', 'user:write_full'])]
    private ?DateTimeInterface $apiRefreshTokenExpiration = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['user:read', 'user:read_strict'])]
    #[ORM\JoinColumn(nullable: true)]
    private Organization $organization;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Groups(['user:read', 'user:read_strict'])]
    #[ORM\JoinColumn(referencedColumnName: 'id', nullable: false, fieldName: 'profile_id')]
    private Profile $profile;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Simulation::class)]
    private Collection $simulations;


    public function __construct()
    {
        $this->creationDate = new DateTimeImmutable();
        $this->simulations = new ArrayCollection();
    }

    public static function constructFromUserObject(UserInterface $object): User
    {
        $instance = new self();
        // Initializing class properties
        foreach ($object as $property => $value) {
            $instance->$property = $value;
        }
        return $instance;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        if (count($roles) === 0) {
            // guarantee every user at least has ROLE_USER
            $roles[] = 'ROLE_USER';
        }
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): self
    {
        $this->surname = $surname;

        return $this;
    }

    public function getCreationDate(): ?DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    /**
     * @return DateTimeInterface
     */
    public function getActivationDate(): DateTimeInterface
    {
        return $this->activationDate;
    }

    /**
     * @param DateTimeInterface $activationDate
     */
    public function setActivationDate(DateTimeInterface $activationDate): void
    {
        $this->activationDate = $activationDate;
    }

    /**
     * @return DateTimeInterface
     */
    public function getUpdatedAt(): DateTimeInterface
    {
        return $this->updatedAt;
    }

    /**
     * @param DateTimeInterface $updatedAt
     */
    public function setUpdatedAt(DateTimeInterface $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @return bool
     */
    public function isStatus(): bool
    {
        return $this->status;
    }

    /**
     * @param bool $status
     */
    public function setStatus(bool $status): void
    {
        $this->status = $status;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }


    public function getLastPasswordToken(): ?string
    {
        return $this->lastPasswordToken;
    }

    public function setLastPasswordToken(?string $lastPasswordToken): self
    {
        $this->lastPasswordToken = $lastPasswordToken;

        return $this;
    }

    public function getTokenGeneratedAt(): ?DateTimeInterface
    {
        return $this->tokenGeneratedAt;
    }

    public function setTokenGeneratedAt(DateTimeInterface $tokenGeneratedAt): self
    {
        $this->tokenGeneratedAt = $tokenGeneratedAt;

        return $this;
    }

    /**
     * @return string
     */
    public function getApiRefreshToken(): string
    {
        return $this->apiRefreshToken;
    }

    /**
     * @param string|null $apiRefreshToken
     */
    public function setApiRefreshToken(?string $apiRefreshToken): void
    {
        $this->apiRefreshToken = $apiRefreshToken;
    }

    /**
     * @return DateTimeInterface|null
     */
    public function getApiRefreshTokenExpiration(): ?DateTimeInterface
    {
        return $this->apiRefreshTokenExpiration;
    }

    /**
     * @param DateTimeInterface|null $apiRefreshTokenExpiration
     */
    public function setApiRefreshTokenExpiration(?DateTimeInterface $apiRefreshTokenExpiration): void
    {
        $this->apiRefreshTokenExpiration = $apiRefreshTokenExpiration;
    }

    public function getOrganization(): Organization
    {
        return $this->organization;
    }

    public function setOrganization(Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    public function getProfile(): Profile
    {
        return $this->profile;
    }

    public function setProfile(Profile $profile): self
    {
        $this->profile = $profile;

        return $this;
    }

    /**
     * @param string $functionName
     * @param int $accessNeeded
     * @return bool
     */
    public function isGranted(string $functionName, int $accessNeeded = Profile::READ): bool
    {
        if (in_array($functionName, Profile::ALLOWED_FUNCTIONS)) {
            return $this->profile->{"get" . ucfirst($functionName)}() >= $accessNeeded;
        }
        return false;
    }

    /**
     * @param string $functionName
     * @return bool
     */
    public function hasAccess(string $functionName): bool
    {
        if (in_array($functionName, Profile::ALLOWED_FUNCTIONS)) {
            return $this->profile->{"get" . ucfirst($functionName)}() > Profile::NOACCESS;
        }
        return false;
    }

    /**
     * @return Collection<int, Simulation>
     */
    public function getSimulations(): Collection
    {
        return $this->simulations;
    }

    public function addSimulation(Simulation $simulation): self
    {
        if (!$this->simulations->contains($simulation)) {
            $this->simulations->add($simulation);
            $simulation->setUser($this);
        }

        return $this;
    }

    public function removeSimulation(Simulation $simulation): self
    {
        // set the owning side to null (unless already changed)
        if ($this->simulations->removeElement($simulation) && $simulation->getUser() === $this) {
            $simulation->setUser(null);
        }

        return $this;
    }
}
