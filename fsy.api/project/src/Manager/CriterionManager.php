<?php

namespace App\Manager;

use App\Entity\AidCriterion;
use App\Entity\Criterion;
use App\Exception\BaseException;
use App\Repository\AidCriterionRepository;
use App\Repository\CriterionRepository;
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
 * CriterionManager class
 */
class CriterionManager extends BaseManager
{
    private CriterionRepository|EntityRepository $criterionRepository;
    private AidCriterionRepository $aidCriterionRepository;

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
        parent::__construct($entityManager, Criterion::class, $logger, $security);
        $this->criterionRepository = $this->repository;
        $this->aidCriterionRepository = $entityManager->getRepository(AidCriterion::class);
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllCriterion(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $criterion = $this->criterionRepository->findAllFiltered($filters, $page, $perPage);

            if (isset($filters['groupBy']['theme']) && $filters['groupBy']['theme']) {
                $criterion = $this->groupCriterionByTheme($criterion);
            }

            return $serializer->normalize(
                $criterion,
                'json',
                Utils::setContext(['criterion:read', 'criterionType:read', 'criteriaValue:read', 'criterionTheme:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Criterion request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param Criterion[] $criterion
     * @return array
     */
    private function groupCriterionByTheme(array $criterion): array
    {
        $result = [];
        foreach ($criterion as $criteria) {
            if (!isset($result[$criteria->getTheme()->getPosition()])) {
                $result[$criteria->getTheme()->getPosition()] = [];
            }
            $result[$criteria->getTheme()->getPosition()][] = $criteria;
        }
        ksort($result);
        return $result;
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getCriterionCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->criterionRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["criterion:read"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Criterion request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param int $id
     * @param string $name
     * @return bool
     * @throws BaseException
     */
    public function checkUniqueName(int $id, string $name): bool
    {
        try {
            return $this->criterionRepository->checkUniqueName($id, $name);
        } catch (Exception $e) {
            throw new BaseException(
                $e,
                "An error occured on Criterion name request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    /* ====================================== PRIVATE FUNCTIONS ====================================== */
}
