<?php

namespace App\Controller\Profile;

use App\Exception\BaseException;
use App\Manager\ProfileManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class DeleteProfileAction extends AbstractController
{
    public function __invoke(
        Request $request,
        ProfileManager $manager
    ): JsonResponse {
        try {
            $id = $request->attributes->get('id');
            $profile = $manager->find($id);
            $users = $manager->getUsersCount($profile);
            if ($users['count'] > 0) {
                return $this->json(
                    Utils::formatErrorResponse(
                        "Avant de supprimer un profil, assurez-vous de réattribuer les utilisateurs " .
                        "associés à ce profil à d'autres profils",
                        Response::HTTP_BAD_REQUEST,
                        null
                    ),
                    Response::HTTP_BAD_REQUEST
                );
            }

            $response = $manager->remove($profile);
            return new JsonResponse($response, Response::HTTP_OK);
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
