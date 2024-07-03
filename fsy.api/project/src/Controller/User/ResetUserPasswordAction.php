<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Enum\HttpCodes;
use App\Exception\BaseException;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ResetUserPasswordAction extends AbstractController
{
    public function __invoke(User $data, Request $request, UserManager $userManager): JsonResponse
    {
        $dataRequest = json_decode($request->getContent(), true);

        if (!isset($dataRequest['newPassword'], $dataRequest['passwordConfirmation'])) {
            return $this->json(
                Utils::formatErrorResponse(
                    "`newPassword` and `passwordConfirmation` keys must be set",
                    Response::HTTP_BAD_REQUEST,
                    $dataRequest
                ),
                Response::HTTP_BAD_REQUEST
            );
        }

        $newPassword = $dataRequest['newPassword'];
        $passwordConfirmation = $dataRequest['passwordConfirmation'];

        if ($newPassword !== $passwordConfirmation) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Passwords do not match",
                    HttpCodes::PASSWORD_DO_NOT_MATCH->value,
                    [$newPassword, $passwordConfirmation]
                ),
                HttpCodes::PASSWORD_DO_NOT_MATCH->value
            );
        }

        if (!$userManager->verifyPassword($newPassword)) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Paswword complexity is too weak",
                    HttpCodes::PASSWORD_TOO_WEAK->value,
                    $newPassword
                ),
                HttpCodes::PASSWORD_TOO_WEAK->value
            );
        }

        try {
            $userManager->activateUserAndUpdatePassword($data, $newPassword);
            return $this->json(['error' => false, 'result' => "OK", 'message' => "User successfully activated"]);
        } catch (BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), $e->getStatusCode(), $e->getData()),
                $e->getStatusCode()
            );
        }
    }
}
