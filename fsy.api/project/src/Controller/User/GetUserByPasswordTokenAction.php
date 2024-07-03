<?php

namespace App\Controller\User;

use App\Enum\HttpCodes;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class GetUserByPasswordTokenAction extends AbstractController
{
    use UserTrait;

    public function __invoke(
        Request $request,
        UserManager $userManager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $dataRequest = json_decode($request->getContent(), true);
        $token = $dataRequest['token'] ?? null;

        if ($token === null) {
            return $this->json(
                Utils::formatErrorResponse(
                    "`token` key must be set",
                    Response::HTTP_BAD_REQUEST,
                    $dataRequest
                ),
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = $userManager->findOneBy(['lastPasswordToken' => $token]);

        if ($user === null) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Invalid token. No user was found for this token",
                    HttpCodes::INVALID_TOKEN->value,
                    $dataRequest
                ),
                HttpCodes::INVALID_TOKEN->value
            );
        }

        $userOutput = $this->formatUserOutput($user);

        $diff = (new \DateTime())->getTimestamp() - $user->getTokenGeneratedAt()->getTimestamp();

        if ($diff / 3600 > 24) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Invalid token. This token has expired",
                    HttpCodes::TOKEN_EXPIRED->value,
                    ['request' => $dataRequest, 'user' => $userOutput]
                ),
                HttpCodes::TOKEN_EXPIRED->value
            );
        }

        $userOutput = $this->formatUserOutput($user);

        return $this->json($userOutput);
    }
}
