<?php

namespace App\Controller\User;

use App\Exception\BaseException;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetUserAuthorizationAction extends AbstractController
{
    public function __invoke(
        Request $request,
        UserManager $manager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $result = [];
        $responseCode = Response::HTTP_OK;
        try {
            $dataRequest = json_decode($request->getContent());
            $user = $manager->find($dataRequest->id);
            $result = $user->getProfile()->getAllAccess();

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
