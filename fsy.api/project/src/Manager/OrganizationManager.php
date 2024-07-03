<?php

namespace App\Manager;

use App\Entity\Organization;
use App\Exception\BaseException;
use App\Exception\OrganizationNotFoundException;
use App\Repository\OrganizationRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

/**
 * OrganizationManager class
 */
class OrganizationManager extends BaseManager
{
    private OrganizationRepository|EntityRepository $organizationRepository;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        Logger $logger,
        Security $security
    ) {
        parent::__construct($entityManager, Organization::class, $logger, $security);
        $this->organizationRepository = $this->repository;
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllOrganizations(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $organizations = $this->organizationRepository->findAllFiltered($filters, $page, $perPage);
            return $serializer->normalize(
                $organizations,
                'json',
                Utils::setContext(['organization:read_full'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Organization request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getOrganizationsCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->organizationRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["organization:read_full"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Organization request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param string $uuid
     * @return array
     * @throws BaseException
     */
    public function getOrganizationsByUuid(string $uuid): array
    {
        try {
            /* @var $org array<Organization> */
            $org = $this->organizationRepository->findBy(['uuid' => $uuid]);
            if (empty($org)) {
                throw new OrganizationNotFoundException(
                    [],
                    "No organization found for this uuid",
                    Response::HTTP_NOT_FOUND
                );
            }
            return [
                "name" => $org[0]->getName(),
                "organism" => $org[0]->isOrganism(),
                "partner" => $org[0]->isPartner(),
                "other" => $org[0]->isOther(),
                "uuid" => $org[0]->getUuid()
            ];
        } catch (OrganizationNotFoundException  $e) {
            throw $e;
        } catch (Exception  $e) {
            throw new BaseException(
                $e,
                "An error occured on Organization request, see logs for more details",
                Response::HTTP_NOT_FOUND
            );
        }
    }
}
