<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Exception\BaseException;
use App\Manager\UserManager;
use App\Services\Utils;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class ForgottenPasswordAction extends AbstractController
{
    public function __invoke(User $data, Request $request, UserManager $userManager): JsonResponse
    {
        try {
            $userManager->generateTokenAndSendResetPasswordMail($data);
            return $this->json(['error' => false, 'result' => "OK", 'message' => "Password reset mail sent"]);
        } catch (BaseException | Exception $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR, $data),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
