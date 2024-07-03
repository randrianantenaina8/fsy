<?php

namespace App\Manager;

use App\Entity\Profile;
use App\Exception\BaseException;
use App\Repository\ProfileRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

/**
 * ProfileManager class
 */
class ProfileManager extends BaseManager
{
    private ProfileRepository|EntityRepository $profileRepository;

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
        parent::__construct($entityManager, Profile::class, $logger, $security);
        $this->profileRepository = $this->repository;
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllProfiles(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $profiles = $this->profileRepository->findAllFiltered($filters, $page, $perPage);
            return $serializer->normalize(
                $profiles,
                'json',
                Utils::setContext(['profile:read_full'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Profile request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getProfilesCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->profileRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["profile:read_full"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Profile request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $params
     * @return array
     * @throws BaseException
     */
    public function updateProfiles(?array $params): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $profiles = $this->profileRepository->findAllWithKey();

            foreach ($params as $trigram => $p) {
                $profile = $profiles[$trigram];
                foreach ($p as $function => $access) {
                    $profile->setAccess($function, $access);
                }
                $this->persist($profile);
            }
            $this->flush();

            return $serializer->normalize(
                ['updated' => true],
                'json',
                Utils::setContext(["profile:read_full"])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Profile request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param Profile $profile
     * @return array
     * @throws BaseException
     */
    public function getUsersCount(Profile $profile): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = sizeof($profile->getUsers());

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["profile:read_full"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Profile request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
