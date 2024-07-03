<?php

namespace App\Controller\Parameter;

use App\Exception\BaseException;
use App\Manager\OrganizationManager;
use App\Manager\ParameterManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class SearchParameterAction extends AbstractController
{
    public function __invoke(
        Request $request,
        ParameterManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;
        try {
            if (str_contains($haystack, "getParameter")) {
                $result = $manager->getParameterByKeyAndOrganization(
                    $request->query->get("propKey"),
                    $request->query->get("organizationId")
                );
            }
            return new JsonResponse($result, $responseCode);
        } catch (BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse(
                    $e->getMessage(),
                    $e->getCode(),
                    null
                ),
                $e->getCode()
            );
        }
    }
}
