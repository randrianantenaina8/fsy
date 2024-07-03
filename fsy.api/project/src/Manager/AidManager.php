<?php

namespace App\Manager;

use App\Entity\Aid;
use App\Entity\AidHistory;
use App\Exception\BaseException;
use App\Repository\AidRepository;
use App\Services\AidHistoryLogger;
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
 * AidManager class
 */
class AidManager extends BaseManager
{
    private AidRepository|EntityRepository $aidRepository;
    private AidHistoryLogger $aidHistoryLogger;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Logger $logger
     * @param Security $security
     * @param AidHistoryLogger $aidHistoryLogger
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        Logger $logger,
        Security $security,
        AidHistoryLogger $aidHistoryLogger
    ) {
        parent::__construct($entityManager, Aid::class, $logger, $security);
        $this->aidRepository = $this->repository;
        $this->aidHistoryLogger = $aidHistoryLogger;
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllAids(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $filters['aidVersion'] =  1;
            $aids = $this->aidRepository->findAllFiltered($filters, $page, $perPage);

            $finalAids = [];

            // versions management
            foreach ($aids as $aid) {
                $childVersions = $aid->getChildVersions()->getValues();
                // si on a de nouvelles versions
                if (!empty($childVersions)) {
                    $final = $childVersions[0];
                    $activeVersion = $aid->isActive() ? $aid->getVersion() : 0;
                    foreach ($childVersions as $childVersion) {
                        // rechercher la dernière version
                        if ($childVersion->getVersion() > $final->getVersion()) {
                            $final = $childVersion;
                        }
                        // rechercher la version publiée
                        if ($childVersion->isActive()) {
                            $activeVersion = $childVersion->getVersion();
                        }
                    }
                    $finalAids[] = array(
                        'aid' => $final,
                        'activeVersion' => $activeVersion
                    );
                } elseif (is_null($aid->getParent())) {
                    $finalAids[] = array(
                        'aid' => $aid,
                        'activeVersion' => $aid->isActive() ? $aid->getVersion() : 0
                    );
                }
            }
            return $serializer->normalize(
                $finalAids,
                'json',
                Utils::setContext(['aid:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param int $aidId
     * @return array
     * @throws BaseException
     */
    public function getAid(int $aidId): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $aid = $this->aidRepository->find($aidId);
            return $serializer->normalize(
                $aid,
                'json',
                Utils::setContext(['aid:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getAidsCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $filters['aidVersion'] =  1;
            $count = $this->aidRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["aid:read"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getAidsCountStatus(): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->aidRepository->findCountStatus();

            return $serializer->normalize(
                $count,
                'json',
                Utils::setContext(["aid:read"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @throws BaseException
     */
    public function getAidVersions(int $id, $last = false)
    {
        $serializer = Utils::getJsonSerializer();
        $aid = $this->find($id);
        $versions = $this->aidRepository->getVersions(
            $aid?->getParent() ? $aid?->getParent()->getId() : $aid?->getId(),
            $last
        );

        try {
            return $serializer->normalize(
                $versions,
                'json',
                Utils::setContext(["aid:read"])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @throws BaseException
     */
    public function createAid(Aid $aid): Aid
    {
        if ($aid->getParent()) {
            $lastVersion = $this->getAidVersions(
                $aid->getParent()->getId(),
                true
            )[0];
            $aid->setVersion((int)$lastVersion["version"] + 1);
            $this->aidHistoryLogger->addHistory(AidHistory::VERSION_CREATION, $aid->getParent());
        } else {
            $this->aidHistoryLogger->addHistory(AidHistory::AID_CREATION, $aid);
        }

        $this->persistAndFlush($aid);
        return $aid;
    }

    public function disableAllPreviousVersions(Aid $aid): Aid
    {
        $id = $aid?->getParent() ? $aid?->getParent()?->getId() : $aid?->getId();
        /** @var Aid $aidVersion */
        foreach ($this->aidRepository->getVersions($id) as $aidVersion) {
            if ($aidVersion->getId() !== $aid->getId()) {
                if ($aidVersion->isActive()) { //log only if version was active and changed to unactive
                    $this->aidHistoryLogger->addHistory(AidHistory::STATUS_CHANGED_TO_UNPUBLISHED, $aidVersion);
                }
                $aidVersion->setActive(false);
            }
        }
        $this->flush();

        return $aid;
    }
}
