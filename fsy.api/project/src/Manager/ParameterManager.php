<?php

namespace App\Manager;

use App\Entity\Parameter;
use App\Exception\BaseException;
use App\Repository\ParameterRepository;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

class ParameterManager extends BaseManager
{
    private ParameterRepository|EntityRepository $parameterRepository;

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
        parent::__construct($entityManager, Parameter::class, $logger, $security);
        $this->parameterRepository = $this->repository;
    }

    /**
     * @param string $propKey
     * @param int $organizationId
     * @return array
     * @throws BaseException
     */
    public function getParameterByKeyAndOrganization(string $propKey, int $organizationId): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $parameter = $this->parameterRepository->findByKeyAndOrganization($propKey, $organizationId);
            if (empty($parameter)) {
                throw new BaseException(
                    [],
                    "Propkey for this organization id does not exist",
                    Response::HTTP_NOT_FOUND
                );
            }
            return $serializer->normalize(
                $parameter,
                'json',
                Utils::setContext(['parameter:read', 'organization:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on Parameter request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }


    /* ====================================== PRIVATE FUNCTIONS ====================================== */
}
