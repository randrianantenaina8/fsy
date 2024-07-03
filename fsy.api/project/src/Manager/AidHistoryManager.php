<?php

namespace App\Manager;

use App\Entity\AidHistory;
use App\Exception\BaseException;
use App\Repository\AidHistoryRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

class AidHistoryManager extends BaseManager
{
    private AidHistoryRepository|EntityRepository $aidHistoryRepository;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager, Logger $logger, Security $security)
    {
        parent::__construct($entityManager, AidHistory::class, $logger, $security);
        $this->aidHistoryRepository = $this->repository;
    }

    /**
     * @param int $aidId
     * @return array
     * @throws BaseException
     */
    public function getHistoryByAidId(int $aidId): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $aid = $this->aidHistoryRepository->findBy(['aid' => $aidId]);
            return $serializer->normalize(
                $aid,
                'json',
                Utils::setContext(['aidHistory:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Aid history request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
