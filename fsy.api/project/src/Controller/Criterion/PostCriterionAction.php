<?php

namespace App\Controller\Criterion;

use App\Exception\BaseException;
use App\Manager\CriterionManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class PostCriterionAction extends AbstractController
{
    public function __invoke(
        Request $request,
        CriterionManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $itemSource = $request->attributes->get("_api_item_operation_name");
        $collectionSource = $request->attributes->get("_api_collection_operation_name");
        $haystack = $itemSource . "_" . $collectionSource; // merge items/collections names
        $result = [];
        $responseCode = Response::HTTP_OK;
        $dataRequest = json_decode($request->getContent(), true);
        try {
            if (str_contains($haystack, "checkUniqueName")) {
                if (!isset($dataRequest['id'], $dataRequest['name'])) {
                    return $this->json(
                        Utils::formatErrorResponse("`id` and `name` must be set", 400, $dataRequest),
                        400
                    );
                }
                $result = $manager->checkUniqueName($dataRequest['id'], $dataRequest['name']);
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
