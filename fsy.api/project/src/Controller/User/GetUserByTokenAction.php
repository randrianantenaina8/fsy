<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Enum\HttpCodes;
use App\Manager\UserManager;
use App\Services\Utils;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[AsController]
class GetUserByTokenAction extends AbstractController
{
    use UserTrait;

    /**
     * @throws Exception
     */
    public function __invoke(
        Request $request,
        UserManager $userManager,
        ParameterBagInterface $parameterBag,
        TokenStorageInterface $tokenStorageInterface,
        JWTTokenManagerInterface $jwtManager
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
        /* @var $user User|null */
        $user = $tokenStorageInterface->getToken()?->getUser();

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

        //$user = User::constructFromUserObject($user);

        $userOutput = $this->formatUserOutput($user);

        if ($this->refreshTokenExpired($user, $parameterBag->get('tokenTTL'))) {
            return $this->json(
                Utils::formatErrorResponse(
                    "Invalid token. This token has expired",
                    HttpCodes::TOKEN_EXPIRED->value,
                    ['request' => $dataRequest, 'user' => $userOutput]
                ),
                HttpCodes::TOKEN_EXPIRED->value
            );
        }

        return $this->json($userOutput);
    }
}
