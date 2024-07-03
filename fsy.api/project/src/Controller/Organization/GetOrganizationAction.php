<?php

namespace App\Controller\Organization;

use App\Exception\BaseException;
use App\Manager\OrganizationManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetOrganizationAction extends AbstractController
{
    public function __invoke(
        Request $request,
        OrganizationManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = null;
        $responseCode = Response::HTTP_OK;
        $query = $request->query;
        try {
            if (str_contains($haystack, "getAllOrganization")) {
                $result = $manager->getAllOrganizations($query->all(), $query->get("page"), $query->get("per_page"));
            } elseif (str_contains($haystack, "getOrganizationsCount")) {
                $result = $manager->getOrganizationsCount($query->all());
            } elseif (str_contains($haystack, "getOrganizationByUuid")) {
                $result = $manager->getOrganizationsByUuid($query->get("uuid"));
            }
            return new JsonResponse($result, $responseCode);
        } catch (BaseException $e) {
            $responseCode = $e->getStatusCode() ?? Response::HTTP_INTERNAL_SERVER_ERROR;

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
