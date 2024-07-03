<?php

namespace App\Controller;

use App\Exception\BaseException;
use App\Manager\StatisticsManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetStatsAction extends AbstractController
{
    public function __invoke(
        Request $request,
        StatisticsManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $responseCode = Response::HTTP_OK;
        try {
            $result = $manager->getAllStats();
        } catch (BaseException $e) {
            $responseCode = Response::HTTP_INTERNAL_SERVER_ERROR;

            return $this->json(
                Utils::formatErrorResponse(
                    $e->getMessage(),
                    $e->getCode(),
                    null
                ),
                $responseCode
            );
        }

        return new JsonResponse($result, $responseCode);
    }
}
