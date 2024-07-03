<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Exception\BaseException;
use App\Exception\SecurityException;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ChangeUserPasswordAction extends AbstractController
{
    public function __invoke(User $data, Request $request, UserManager $userManager): JsonResponse
    {
        $dataRequest = json_decode($request->getContent(), true);

        if (!isset($dataRequest['currentPassword'], $dataRequest['newPassword'])) {
            return $this->json(
                Utils::formatErrorResponse("`currentPassword` and `newPassword` keys must be set", 400, $dataRequest),
                400
            );
        }

        try {
            $user = $userManager->changePassword($data, $dataRequest['currentPassword'], $dataRequest['newPassword']);
        } catch (SecurityException | BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), $e->getStatusCode(), $e->getData()),
                $e->getStatusCode()
            );
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'surname' => $user->getSurname()
        ]);
    }
}
