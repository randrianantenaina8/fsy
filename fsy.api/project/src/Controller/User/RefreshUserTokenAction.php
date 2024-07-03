<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Enum\HttpCodes;
use App\Manager\UserManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class RefreshUserTokenAction extends AbstractController
{
    use UserTrait;

    public function __invoke(
        Request $request,
        UserManager $userManager,
        ParameterBagInterface $parameterBag
    ): JsonResponse {
        $dataRequest = json_decode($request->getContent(), true);

        $refreshToken = $dataRequest['refreshToken'] ?? null;

        if ($refreshToken === null) {
            return $this->json(
                Utils::formatErrorResponse(
                    "`refreshToken` key must be set",
                    Response::HTTP_BAD_REQUEST,
                    $dataRequest
                ),
                Response::HTTP_BAD_REQUEST
            );
        }

        /* @var $user User|null */
        $user = $userManager->findOneBy(['apiRefreshToken' => $refreshToken]);

        if ($user === null) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Invalid refresh token. No user was found for this token",
                    HttpCodes::INVALID_TOKEN->value,
                    $dataRequest
                ),
                HttpCodes::INVALID_TOKEN->value
            );
        }

        $userOutput = $this->formatUserOutput($user);

        if ($this->refreshTokenExpired($user, $parameterBag->get('gesdinet_jwt_refresh_token.ttl'))) {
            $userManager->invalidateRefreshToken($user);
            return $this->json(
                Utils::formatErrorResponse(
                    "Invalid token. This token has expired",
                    HttpCodes::TOKEN_EXPIRED->value,
                    ['request' => $dataRequest, 'user' => $userOutput]
                ),
                HttpCodes::TOKEN_EXPIRED->value
            );
        }

        return $this->json($userManager->refreshToken($user));
    }
}
