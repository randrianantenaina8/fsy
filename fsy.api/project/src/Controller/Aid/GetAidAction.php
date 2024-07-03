<?php

namespace App\Controller\Aid;

use App\Exception\BaseException;
use App\Manager\AidManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetAidAction extends AbstractController
{
    public function __invoke(
        Request $request,
        AidManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;
        $query = $request->query;
        try {
            if (str_contains($haystack, "getAllAids")) {
                $result = $manager->getAllAids($query->all(), $query->get("page"), $query->get("per_page"));
            } elseif (str_contains($haystack, "getAidCount")) {
                $result = $manager->getAidsCount($query->all());
            } elseif (str_contains($haystack, "getAidStatusCount")) {
                $result = $manager->getAidsCountStatus();
            } elseif (str_contains($haystack, "getAidVersions")) {
                $result = $manager->getAidVersions((int)$request->get('id'));
            } elseif (str_contains($haystack, "getAid")) {
                $result = $manager->getAid($request->get('id'));
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
