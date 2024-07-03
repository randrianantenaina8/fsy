<?php

namespace App\Controller\Simulator;

use App\Exception\BaseException;
use App\Manager\SimulatorManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetSimulatorAction extends AbstractController
{
    public function __invoke(
        Request $request,
        SimulatorManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;
        $query = $request->query;
        try {
            if (str_contains($haystack, "getAllSimulators")) {
                $result = $manager->getAllSimulators($query->all(), $query->get("page"), $query->get("per_page"));
            } elseif (str_contains($haystack, "getSimulatorCount")) {
                $result = $manager->getSimulatorCount($query->all());
            }
            return new JsonResponse($result, $responseCode);
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
    }
}
