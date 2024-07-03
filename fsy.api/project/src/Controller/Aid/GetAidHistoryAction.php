<?php

namespace App\Controller\Aid;

use App\Exception\BaseException;
use App\Manager\AidHistoryManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetAidHistoryAction extends AbstractController
{
    public function __invoke(
        Request $request,
        AidHistoryManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $query = $request->query;
        if ($query->get("aid_id") === null) {
            return $this->json(
                Utils::formatErrorResponse("`aid_id` parameter must be set", 400, $query->all()),
                400
            );
        }

        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;

        try {
            if (str_contains($haystack, "GetHistoryByAidId")) {
                $result = $manager->getHistoryByAidId($query->get("aid_id"));
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
