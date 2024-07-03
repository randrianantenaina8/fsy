<?php

namespace App\Manager;

use App\Entity\Simulator;
use App\Exception\BaseException;
use App\Repository\SimulatorRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

class SimulatorManager extends BaseManager
{
    private SimulatorRepository|EntityRepository $simulatorRepository;

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
        parent::__construct($entityManager, Simulator::class, $logger, $security);
        $this->simulatorRepository = $this->repository;
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllSimulators(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $criterion = $this->simulatorRepository->findAllFiltered($filters, $page, $perPage);
            return $serializer->normalize(
                $criterion,
                'json',
                Utils::setContext(['simulator:read_details', 'step:read', 'question:read', 'user:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Simulator request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getSimulatorCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->simulatorRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["simulator:read"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Simulator request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
