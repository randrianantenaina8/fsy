<?php

namespace App\Controller;

use App\Exception\BaseException;
use App\Manager\LogManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetLogsAction extends AbstractController
{
    public function __invoke(
        $data,
        Request $request,
        LogManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {

        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;
        $query = $request->query;
        try {
            if (str_contains($haystack, "getLogs")) {
                $result = $manager->getAllLogs($query->all(), $query->get("page"), $query->get("per_page"));
            }
        } catch (BaseException $e) {
            $responseCode = Response::HTTP_INTERNAL_SERVER_ERROR;

            return $this->json(
                Utils::formatErrorResponse(
                    $e->getMessage(),
                    $e->getCode(),
                    $data
                ),
                $responseCode
            );
        }

        return new JsonResponse($result, $responseCode);
    }
}
