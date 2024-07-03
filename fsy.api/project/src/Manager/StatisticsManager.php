<?php

namespace App\Manager;

use App\Entity\Aid;
use App\Entity\Criterion;
use App\Entity\Simulation;
use App\Entity\Statistics;
use App\Entity\User;
use App\Exception\BaseException;
use App\Repository\AidRepository;
use App\Repository\CriterionRepository;
use App\Repository\SimulationRepository;
use App\Repository\UserRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface;

/**
 * StatisticsManager class
 */
class StatisticsManager extends BaseManager
{
    private UserRepository|EntityRepository $userRepository;
    /**
     * @param EntityManagerInterface $entityManager
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager, Logger $logger, Security $security)
    {
        parent::__construct($entityManager, User::class, $logger, $security);
        $this->userRepository = $this->repository;
    }

    /**
     * @return array
     * @throws BaseException
     */
    public function getAllStats(): array
    {
        /* @var $simulationRepository SimulationRepository */
        $simulationRepository = $this->entityManager->getRepository(Simulation::class);
        /* @var $aidRepository AidRepository */
        $aidRepository = $this->entityManager->getRepository(Aid::class);
        /* @var $criterionRepository CriterionRepository */
        $criterionRepository = $this->entityManager->getRepository(Criterion::class);

        $serializer = Utils::getJsonSerializer();
        try {
            $simulationCount = $simulationRepository->findCount();
            $userCount = $this->userRepository->findCount();
            $aidCount = $aidRepository->findCount();
            $criterionCount = $criterionRepository->findCount();

            $statistics = new Statistics();
            $statistics->setSimulationCount($simulationCount);
            $statistics->setUserCount($userCount);
            $statistics->setAidCount($aidCount);
            $statistics->setCriterionCount($criterionCount);

            return $serializer->normalize(
                $statistics,
                'json',
                Utils::setContext([])
            );
        } catch (NoResultException | ExceptionInterface | NonUniqueResultException $e) {
            throw new BaseException(
                $e,
                "An error occured on the request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
