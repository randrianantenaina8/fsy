<?php

namespace App\Controller\User;

use App\Exception\BaseException;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class AuthenticateAction extends AbstractController
{
    public function __invoke(Request $request, UserManager $userManager): JsonResponse
    {
        $dataRequest = json_decode($request->getContent(), true);

        if (!isset($dataRequest['identifier'], $dataRequest['password'])) {
            return $this->json(
                Utils::formatErrorResponse("`identifier` and `password` keys must be set", 400, $dataRequest),
                400
            );
        }
        try {
            return $this->json(
                $userManager->authenticateAndGenerateToken($dataRequest['identifier'], $dataRequest['password'])
            );
        } catch (BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), $e->getStatusCode(), $e->getData()),
                $e->getStatusCode()
            );
        }
    }
}
