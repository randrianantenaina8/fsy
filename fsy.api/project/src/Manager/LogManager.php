<?php

namespace App\Manager;

use App\Entity\Logs;
use App\Exception\BaseException;
use App\Repository\LogsRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface;

/**
 * LogManager class
 */
class LogManager extends BaseManager
{
    private LogsRepository|EntityRepository $logsRepository;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager, Logger $logger, Security $security)
    {
        parent::__construct($entityManager, Logs::class, $logger, $security);
        $this->logsRepository = $this->repository;
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllLogs(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $logs = $this->logsRepository->findAllFiltered($filters, $page, $perPage);
            return $serializer->normalize(
                $logs,
                'json',
                Utils::setContext(["logs:read", "user:read_strict"])
            );
        } catch (ExceptionInterface $e) {
            throw new BaseException(
                $e,
                "An error occured on logs request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
