<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Profile\GetProfileAction;
use App\Controller\Profile\UpdateProfilesAction;
use App\Controller\Profile\DeleteProfileAction;
use App\Repository\ProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProfileRepository::class)]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => '',
            'normalization_context' => ['groups' => 'profile:read'],
            'denormalization_context' => ['groups' => 'profile:read'],
        ],
        'getProfilesCount' => [
            'path' => '/count',
            'method' => 'GET',
            'controller' => GetProfileAction::class,
            'normalization_context' => ['groups' => ['profile:read']],
            'defaults' => ["_api_receive" => false],
        ],
        'getAllProfiles' => [
            'path' => '',
            'method' => 'GET',
            'controller' => GetProfileAction::class,
            'normalization_context' => ['groups' => 'profile:read_full']
        ],
        'updateProfiles' => [
            'path' => '/update',
            'method' => 'PUT',
            'controller' => UpdateProfilesAction::class,
            'normalization_context' => ['groups' => 'profile:read'],
            'denormalization_context' => ['groups' => 'profile:read'],
        ],
    ],
    itemOperations: [
        'getProfile' => [
            'method' => 'GET',
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'profile:read'],
        ],
        'PUT' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'normalization_context' => ['groups' => 'profile:read'],
            'denormalization_context' => ['groups' => 'profile:read'],
        ],
        'DELETE' => [
            'path' => '/{id}',
            'requirements' => ['id' => '\d+'],
            'controller' => DeleteProfileAction::class
        ]
    ],
    attributes: ["security" => "is_granted('ROLE_ADMIN')"],
    routePrefix: '/profile',
    securityMessage: "You don't have permission to access this resource"
)]
class Profile
{
    public final const NOACCESS = 0;
    public final const READ = 1;
    public final const WRITE = 2;

    public final const ALLOWED_FUNCTIONS = [
        "aidEntry",
        "aidValidation",
        "aidSimulation",
        "requestSupport",
        "aidCatalog",
        "reporting",
        "userManagement",
        "criterion",
        "organization",
        "simulator"
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['profile:read', 'profile:read_full', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 3, unique: true, nullable: false)]
    #[Groups(['profile:read', 'profile:read_full', 'user:read'])]
    private string $trigram;

    #[ORM\Column(length: 255, unique: true, nullable: false)]
    #[Groups(['profile:read', 'profile:read_full', 'user:read'])]
    private string $label;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $aidEntry = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $aidValidation = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $aidSimulation = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $requestSupport = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $aidCatalog = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $reporting = 0;

    #[ORM\Column(nullable: false)]
    #[Groups(['profile:read', 'profile:read_full'])]
    private int $userManagement = 0;

    #[ORM\Column]
    #[Groups(['profile:read', 'profile:read_full'])]
    private ?int $criterion = 0;

    #[ORM\Column]
    #[Groups(['profile:read', 'profile:read_full'])]
    private ?int $simulator = 0;

    #[ORM\Column]
    #[Groups(['profile:read', 'profile:read_full'])]
    private ?int $organization = 0;

    #[ORM\OneToMany(mappedBy: 'profile', targetEntity: User::class)]
    #[Groups(['profile:read_full'])]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrigram(): string
    {
        return $this->trigram;
    }

    public function setTrigram(string $trigram): self
    {
        $this->trigram = $trigram;

        return $this;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function getAidEntry(): int
    {
        return $this->aidEntry;
    }

    public function setAidEntry(int $aidEntry): self
    {
        $this->aidEntry = $aidEntry;

        return $this;
    }

    public function getAidValidation(): int
    {
        return $this->aidValidation;
    }

    public function setAidValidation(int $aidValidation): self
    {
        $this->aidValidation = $aidValidation;

        return $this;
    }

    public function getAidSimulation(): int
    {
        return $this->aidSimulation;
    }

    public function setAidSimulation(int $aidSimulation): self
    {
        $this->aidSimulation = $aidSimulation;

        return $this;
    }

    public function getRequestSupport(): int
    {
        return $this->requestSupport;
    }

    public function setRequestSupport(int $requestSupport): self
    {
        $this->requestSupport = $requestSupport;

        return $this;
    }

    public function getAidCatalog(): int
    {
        return $this->aidCatalog;
    }

    public function setAidCatalog(int $aidCatalog): self
    {
        $this->aidCatalog = $aidCatalog;

        return $this;
    }

    public function getReporting(): int
    {
        return $this->reporting;
    }

    public function setReporting(int $reporting): self
    {
        $this->reporting = $reporting;

        return $this;
    }

    public function getUserManagement(): int
    {
        return $this->userManagement;
    }

    public function setUserManagement(int $userManagement): self
    {
        $this->userManagement = $userManagement;

        return $this;
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
            $user->setProfile($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        // set the owning side to null (unless already changed)
        if ($this->users->removeElement($user) && $user->getProfile() === $this) {
            $user->setProfile(null);
        }

        return $this;
    }

    /**
     * @param string $functionName
     * @param int $access
     * @return bool
     */
    public function setAccess(string $functionName, int $access): bool
    {
        if (in_array($functionName, self::ALLOWED_FUNCTIONS) && $this->isValidAccess($access)) {
            $this->{"set" . ucfirst($functionName)}($access);
            return true;
        }
        return false;
    }

    /**
     * @param int $access
     * @return bool
     */
    public function isValidAccess(int $access): bool
    {
        return $access === self::NOACCESS || $access === self::READ || $access === self::WRITE;
    }

    public function getCriterion(): ?int
    {
        return $this->criterion;
    }

    public function setCriterion(int $criterion): self
    {
        $this->criterion = $criterion;

        return $this;
    }

    public function getSimulator(): ?int
    {
        return $this->simulator;
    }

    public function setSimulator(int $simulator): self
    {
        $this->simulator = $simulator;

        return $this;
    }

    public function getOrganization(): ?int
    {
        return $this->organization;
    }

    public function setOrganization(int $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    /**
     * @param string $functionName
     * @return bool
     */
    public function getAccess(string $functionName): int|null
    {
        if (in_array($functionName, self::ALLOWED_FUNCTIONS)) {
            return $this->{"get" . ucfirst($functionName)}();
        }
        return null;
    }

    /**
     * @return bool
     */
    public function getAllAccess(): array
    {
        $return = [];
        foreach (self::ALLOWED_FUNCTIONS as $functionName) {
            $return[$functionName] = $this->{"get" . ucfirst($functionName)}();
        }
        return $return;
    }
}
