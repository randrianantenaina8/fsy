<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\Parameter\SearchParameterAction;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ParameterRepository;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ParameterRepository::class)]
#[ORM\UniqueConstraint(columns: ['prop_key', 'organization_id'])]
#[ApiResource(
    collectionOperations: [
        'POST' => [
            'path' => ''
        ],
        'GET' => [
            'path' => ''
        ],
        'getParameter' => [
            'method' => 'GET',
            'path' => '/search',
            'normalization_context' => ['groups' => ['parameter:read', 'organization:read']],
            'controller' => SearchParameterAction::class,
            'defaults' => ["_api_receive" => false]
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
    routePrefix: '/parameter',
    securityMessage: "You don't have permission to access this resource"
)]
class Parameter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['parameter:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['parameter:read'])]
    private string $propKey;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['parameter:read'])]
    private ?string $propValue = null;

    #[ORM\ManyToOne]
    #[Groups(['parameter:read'])]
    private ?Organization $organization = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPropKey(): string
    {
        return $this->propKey;
    }

    public function setPropKey(string $propKey): self
    {
        $this->propKey = $propKey;

        return $this;
    }

    public function getPropValue(): ?string
    {
        return $this->propValue;
    }

    public function setPropValue(?string $propValue): self
    {
        $this->propValue = $propValue;

        return $this;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }
}
