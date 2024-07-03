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
class GetUserIdByIdentifier extends AbstractController
{
    public function __invoke(Request $request, UserManager $userManager): JsonResponse
    {
        $dataRequest = json_decode($request->getContent(), true);
        try {
            $user = $userManager->findUserByIdentifier($dataRequest['identifier']);
        } catch (BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), $e->getStatusCode(), $e->getData()),
                $e->getStatusCode()
            );
        }

        return $this->json($user !== null ? ['id' => $user->getId()] : null);
    }
}
