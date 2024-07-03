<?php

namespace App\Controller\User;

use App\Entity\User;
use App\Exception\BaseException;
use App\Exception\SecurityException;
use App\Manager\OrganizationManager;
use App\Manager\ProfileManager;
use App\Manager\UserManager;
use App\Services\Logger;
use App\Services\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Security;

#[AsController]
class UpdateUserAction extends AbstractController
{
    public function __invoke(
        User $data,
        Request $request,
        UserManager $userManager,
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ): JsonResponse {
        $dataRequest = json_decode($request->getContent(), true);

        $id = $dataRequest['id'] ?? $data->getId();
        $name = $dataRequest['name'] ?? $data->getName();
        $surname = $dataRequest['surname'] ?? $data->getSurname();
        $status = $dataRequest['status'] ?? $data->isStatus();
        $active = $dataRequest['active'] ?? $data->isActive();

        $userManager->clear();

        $originalEmail = $userManager->find($id)->getUserIdentifier();
        $logger->warning("By Identifier $originalEmail");

        if (isset($dataRequest['email'])) {
            $email = $dataRequest['email'];

            if (!$userManager->verifyEmail($email)) {
                return $this->json(Utils::formatErrorResponse("Email incorret", 400, $email), 400);
            }

            if ($userManager->isEmailAlreadyExistOutOfSelf($data, $email)) {
                return $this->json(Utils::formatErrorResponse("Email $email Already exist", 400, $email), 409);
            }

            $active = false;
        } else {
            $email = $data->getEmail();
        }

        // profile
        if (isset($dataRequest['profile'])) {
            $profileId = $dataRequest['profile'];
            $profileManager = new ProfileManager(
                $entityManager,
                new Logger($entityManager),
                new Security($this->container)
            );
            $profile = $profileManager->find($profileId);
        } else {
            $profile = $data->getProfile();
        }

        // organization
        if (isset($dataRequest['organization'])) {
            $organizationId = $dataRequest['organization'];
            $organizationManager = new OrganizationManager(
                $entityManager,
                new Logger($entityManager),
                new Security($this->container)
            );
            $organization = $organizationManager->find($organizationId);
        } else {
            $organization = $data->getorganization();
        }

        $user = $userManager->updateProfil($data, $email, $name, $surname, $profile, $organization, $status, $active);

        if (isset($dataRequest['currentPassword'], $dataRequest['newPassword'])) {
            try {
                $user = $userManager->changePassword(
                    $user,
                    $dataRequest['currentPassword'],
                    $dataRequest['newPassword']
                );
            } catch (SecurityException $e) {
                return $this->json(
                    Utils::formatErrorResponse($e->getMessage(), $e->getStatusCode(), $e->getData()),
                    $e->getStatusCode()
                );
            }
        }

        if (isset($dataRequest['active'])) {
            $active = $dataRequest['active'] ?? $data->isActive();
            $user = $userManager->updateActiveToggle($data, $active);
        }

        $logger->warning("Original $originalEmail");
        $logger->warning("New $email");

        if ($originalEmail && $originalEmail !== $email && $user->isActive()) {
            try {
                $user = $userManager->updateActiveToggle($user, false);
                $userManager->generateTokenAndSendActivationMail($user);
            } catch (BaseException | Exception $e) {
                if ($e instanceof BaseException) {
                    $statusCode = $e->getStatusCode();
                    $exceptionData = $e->getData();
                } else {
                    $statusCode = $e->getCode();
                    $exceptionData = null;
                }
                return $this->json(
                    Utils::formatErrorResponse($e->getMessage(), $statusCode, $exceptionData),
                    $statusCode
                );
            }
        }

        return $this->json($user);
    }
}
