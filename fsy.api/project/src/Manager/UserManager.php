<?php

namespace App\Manager;

use App\Entity\Organization;
use App\Entity\Profile;
use App\Entity\User;
use App\Enum\HttpCodes;
use App\Enum\LogsType;
use App\Exception\BaseException;
use App\Exception\MailException;
use App\Exception\SecurityException;
use App\Exception\UserException;
use App\Repository\UserRepository;
use App\Services\Logger;
use App\Services\Utils;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Exception;
use Gesdinet\JWTRefreshTokenBundle\Generator\RefreshTokenGeneratorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use stdClass;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\ExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Exception\ExceptionInterface as SerializerException;

/**
 * UserManager class
 */
class UserManager extends BaseManager
{
    private UserRepository|EntityRepository $userRepository;
    private MailerInterface $mailer;
    private UserPasswordHasherInterface $passwordHasher;
    private JWTTokenManagerInterface $JWTManager;
    private RefreshTokenGeneratorInterface $refreshTokenGenerator;
    private ParameterBagInterface $parameters;

    /**
     * @param EntityManagerInterface $entityManager
     * @param MailerInterface $mailer
     * @param UserPasswordHasherInterface $passwordHasher
     * @param JWTTokenManagerInterface $JWTManager
     * @param RefreshTokenGeneratorInterface $refreshTokenGenerator
     * @param ParameterBagInterface $parameters
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $JWTManager,
        RefreshTokenGeneratorInterface $refreshTokenGenerator,
        ParameterBagInterface $parameters,
        Logger $logger,
        Security $security
    ) {
        parent::__construct($entityManager, User::class, $logger, $security);
        $this->userRepository = $this->repository;
        $this->mailer = $mailer;
        $this->passwordHasher = $passwordHasher;
        $this->JWTManager = $JWTManager;
        $this->refreshTokenGenerator = $refreshTokenGenerator;
        $this->parameters = $parameters;
    }

    /**
     * Between 8 and 20 characters, with lowercase, uppercase, number and symbols
     *
     * @param string $password
     * @return bool
     */
    public function verifyPassword(string $password): bool
    {
        return (bool)preg_match("#^(?=.{8,20})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$#", $password);
    }

    /**
     * @param string $email
     * @return bool
     */
    public function verifyEmail(string $email): bool
    {
        return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * @param string $email
     * @return bool
     */
    public function isEmailAlreadyExist(string $email): bool
    {
        $users = $this->findAll();

        foreach ($users as $user) {
            if ($email === $user->getEmail()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param User $user
     * @param string $email
     * @return bool
     */
    public function isEmailAlreadyExistOutOfSelf(User $user, string $email): bool
    {
        $users = $this->findAll();

        foreach ($users as $anotherUser) {
            if ($email === $anotherUser->getEmail() && $user->getId() !== $anotherUser->getId()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param User $user
     * @return void
     * @throws BaseException
     * @throws Exception
     */
    public function generateTokenAndSendActivationMail(User $user): void
    {
        $this->generateActivationToken($user);
        $this->sendMail(
            $user,
            'emails/activation.html.twig',
            '[' . $this->parameters->get('app.name') . '] Activation de votre compte',
            'Activation mail'
        );
    }

    /**
     * @param User $user
     * @return void
     * @throws BaseException
     * @throws Exception
     */
    public function generateTokenAndSendCreationMail(User $user): void
    {
        $this->generateActivationToken($user);
        $this->sendMail(
            $user,
            'emails/creation.html.twig',
            '[' . $this->parameters->get('app.name') . '] Votre compte a été créé',
            'Creation mail'
        );
    }

    /**
     * @param User $user
     * @return void
     * @throws BaseException
     * @throws Exception
     */
    public function generateTokenAndSendResetPasswordMail(User $user): void
    {
        $this->generateActivationToken($user);
        $this->sendMail(
            $user,
            'emails/resetPassword.html.twig',
            '[' . $this->parameters->get('app.name') . '] Réinitialisation de votre mot de passe',
            'Reset password mail'
        );
    }

    /**
     * @param User $user
     * @param string $password
     * @throws BaseException
     */
    public function activateUserAndUpdatePassword(User $user, string $password): void
    {
        $newHashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($newHashedPassword);
        $user->setActive(true);
        $this->persistAndFlush($user);
        $this->sendMail(
            $user,
            'emails/passwordChanged.html.twig',
            '[' . $this->parameters->get('app.name') . '] Votre mot de passe a été modifié',
            'Change password mail'
        );
    }

    /**
     * @param string $identifier
     * @param string $password
     * @return array
     * @throws BaseException
     */
    public function authenticateAndGenerateToken(string $identifier, string $password): array
    {
        $user = $this->findUserByIdentifier($identifier);

        if (!isset($user)) {
            $this->log(
                LogsType::USER_ERROR->value,
                "Echec de connexion : l'identifiant '$identifier' n'existe pas"
            );
            throw new BaseException(
                ['identifier' => $identifier],
                "Wrong credentials. identifier unknown",
                HttpCodes::USER_NOT_FOUND->value
            );
        }

        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            $this->log(
                LogsType::USER_ERROR->value,
                "Echec de connexion : mot de passe invalide pour l'identifiant '$identifier'"
            );
            throw new BaseException(
                ['identifier' => $identifier, 'password' => $password],
                "Wrong credentials. Invalid password",
                HttpCodes::INVALID_PASSWORD->value
            );
        }

        if (!$user->isStatus()) {
            $this->log(
                LogsType::USER_ERROR->value,
                "Echec de connexion : l'utilisateur '{$identifier}' a tenté de se connecter mais son compte est " .
                "en cours de validation"
            );
            throw new BaseException(
                ['identifier' => $identifier, 'password' => $password],
                "Compte en attente de validation par l'administrateur. Veuillez réessayer plus tard ou " .
                "contacter l'administrateur pour plus d'informations.",
                HttpCodes::INVALID_TOKEN->value
            );
        }

        if (!$user->isActive()) {
            $this->log(
                LogsType::USER_ERROR->value,
                "Echec de connexion : l'utilisateur '$identifier' a tenté de se connecter mais son compte est désactivé"
            );
            throw new BaseException(
                ['identifier' => $identifier, 'password' => $password],
                "Ce compte est verrouillé. Réinitialisez votre mot de passe ou contactez l'administrateur.",
                HttpCodes::INVALID_TOKEN->value
            );
        }

        $token = $this->JWTManager->create($user);
        $expirationDate = $this->JWTManager->parse($token)['exp'];
        $refreshToken = $this->refreshTokenGenerator->createForUserWithTtl(
            $user,
            $this->parameters->get('gesdinet_jwt_refresh_token.ttl')
        );
        //        $this->refreshTokenManager->save($refreshToken);

        $user->setApiRefreshToken($refreshToken->getRefreshToken());
        $user->setApiRefreshTokenExpiration($refreshToken->getValid());
        $this->persistAndFlush($user);

        $this->log(
            LogsType::USER_ACTION->value,
            "Utilisateur '{$user->getName()} {$user->getSurname()}' (id: {$user->getId()}) s'est connecté",
            $user
        );

        $profile = new stdClass();
        $profile->trigram = $user->getProfile()->getTrigram();
        $profile->label = $user->getProfile()->getLabel();
        $organization = new stdClass();
        $organization->id = $user->getOrganization()->getId();
        $organization->name = $user->getOrganization()->getName();
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'surname' => $user->getSurname(),
            'roles' => $user->getRoles(),
            'profile' => $profile,
            'organization' => $organization,
            'token' => $token,
            'expiration' => $expirationDate,
            'refreshToken' => $user->getApiRefreshToken(),
            'refreshTokenExpiration' => $user->getApiRefreshTokenExpiration()?->getTimestamp()
        ];
    }

    /**
     * @param User $user
     * @return array
     */
    public function refreshToken(User $user): array
    {
        $token = $this->JWTManager->create($user);
        $expirationDate = $this->JWTManager->parse($token)['exp'];
        //
        //$this->log(
        //  LogsType::API_INFO->value,
        //  "Token rafraîchi pour l'utilisateur '{$user->getName()} {$user->getSurname()}' (id: {$user->getId()})"
        //);

        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'token' => $token,
            'expiration' => $expirationDate
        ];
    }

    /**
     * @param User $user
     * @return void
     */
    public function invalidateRefreshToken(User $user): void
    {
        $user->setApiRefreshToken(null);
        $user->setApiRefreshTokenExpiration(null);
        $this->persistAndFlush($user);
    }

    /**
     * @param User $user
     * @param string $email
     * @param string $name
     * @param string $surname
     * @param Profile $profile
     * @param Organization $organization
     * @param bool $status
     * @param bool $active
     * @return User
     * @throws BaseException
     * @throws UserException
     */
    public function updateProfil(
        User $user,
        string $email,
        string $name,
        string $surname,
        Profile $profile,
        Organization $organization,
        bool $status,
        bool $active
    ): User {
        /* @var $userToUpdate null|User */
        $userToUpdate = $this->find($user->getId());

        if (is_null($userToUpdate)) {
            $this->log(
                LogsType::API_ERROR->value,
                sprintf(
                    "Impossible de mettre à jour l'utilisateur : utilisateur '%s' (id: %s) inconnu",
                    $user->getName() . " " . $user->getSurname(),
                    $user->getId()
                )
            );
            throw new UserException(
                $user,
                "Impossible de mettre à jour l'utilisateur : utilisateur inconnu",
                Response::HTTP_BAD_REQUEST
            );
        }

        //        $this->log(
        //            LogsType::USER_ACTION->value,
        //            "Utilisateur '{$user->getName()} {$user->getSurname()}' (id: {$user->getId()}) mis à jour"
        //        );

        if ($status === true && $userToUpdate->isStatus() === false) {
            $this->generateTokenAndSendActivationMail($userToUpdate);
        }

        $userToUpdate->setEmail($email);
        $userToUpdate->setName($name);
        $userToUpdate->setSurname($surname);
        $userToUpdate->setProfile($profile);
        $userToUpdate->setOrganization($organization);
        $userToUpdate->setStatus($status);
        $userToUpdate->setActive($active);

        $this->persistAndFlush($userToUpdate);

        return $userToUpdate;
    }


    /**
     * @param User $user
     * @param bool $active
     * @return User
     * @throws UserException
     */
    public function updateActiveToggle(User $user, bool $active): User
    {
        /* @var $userToUpdate null|User */
        $userToUpdate = $this->find($user->getId());

        if (is_null($userToUpdate)) {
            $this->log(
                LogsType::API_ERROR->value,
                sprintf(
                    "Impossible de mettre à jour l'utilisateur : utilisateur '%s' (id: %s) inconnu",
                    $user->getName() . " " . $user->getSurname(),
                    $user->getId()
                )
            );
            throw new UserException(
                $user,
                "Impossible de mettre à jour l'utilisateur : utilisateur inconnu",
                Response::HTTP_BAD_REQUEST
            );
        }

        $this->log(
            LogsType::USER_ACTION->value,
            "Utilisateur '{$user->getName()} {$user->getSurname()}' (id: {$user->getId()}) " .
            ($active ? 'activé' : 'désactivé')
        );

        $userToUpdate->setActive($active);
        $userToUpdate->setactivationDate(new DateTimeImmutable());

        $this->persistAndFlush($userToUpdate);

        return $userToUpdate;
    }

    /**
     * @param User $user
     * @param string $currentPassword
     * @param string $newPassword
     * @return User
     * @throws SecurityException
     * @throws BaseException
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): User
    {
        if (!$this->passwordHasher->isPasswordValid($user, $currentPassword)) {
            throw new SecurityException(
                $currentPassword,
                "Password provide does not match with the current password",
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!$this->verifyPassword($newPassword)) {
            throw new SecurityException($newPassword, "Paswword complexity is too weak", Response::HTTP_BAD_REQUEST);
        }

        $newHashedPassword = $this->passwordHasher->hashPassword($user, $newPassword);
        $user->setPassword($newHashedPassword);

        $this->persistAndFlush($user);

        $this->sendMail(
            $user,
            'emails/passwordChanged.html.twig',
            '[' . $this->parameters->get('app.name') . '] Votre mot de passe a été modifié',
            'Change password mail'
        );

        // $this->log(
        //  LogsType::USER_ACTION->value,
        //  "Utilisateur '{$user->getName()} {$user->getSurname()}' (id: {$user->getId()}) a changé son mot de passe"
        // );

        return $user;
    }

    /**
     * @param string $identifier
     * @return User|null
     */
    public function findUserByIdentifier(string $identifier): ?object
    {
        return $this->findOneBy(["email" => $identifier]);
    }

    /**
     * @param array|null $filters
     * @param string|null $page
     * @param string|null $perPage
     * @return array
     * @throws BaseException
     */
    public function getAllUsers(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $users = $this->userRepository->findAllFiltered($filters, $page, $perPage);
            return $serializer->normalize(
                $users,
                'json',
                Utils::setContext(['user:read', 'stats:read', 'language:read', 'society:read', 'level:read'])
            );
        } catch (SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on question request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * @param array|null $filters
     * @return array
     * @throws BaseException
     */
    public function getUsersCount(?array $filters = null): array
    {
        $serializer = Utils::getJsonSerializer();
        try {
            $count = $this->userRepository->findCount($filters);

            return $serializer->normalize(
                ['count' => $count],
                'json',
                Utils::setContext(["user:read"])
            );
        } catch (NoResultException | NonUniqueResultException | SerializerException $e) {
            throw new BaseException(
                $e,
                "An error occured on question request, see logs for more details",
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /* ====================================== PRIVATE FUNCTIONS ====================================== */

    /**
     * @param User $user
     * @param bool $resetActivation
     * @return void
     * @throws Exception
     */
    private function generateActivationToken(User $user, bool $resetActivation = true): void
    {
        $token = bin2hex(random_bytes(20));
        $user->setLastPasswordToken($token);
        $user->setTokenGeneratedAt(new DateTime(datetime: 'now'));

        if ($resetActivation) {
            $user->setActive(false);
        }

        $this->persistAndFlush($user);
        $this->log(
            LogsType::API_INFO->value,
            sprintf(
                "Nouveau token d'activation généré pour l'utilisateur '%s %s' (id: %s)",
                $user->getName(),
                $user->getSurname(),
                $user->getId()
            )
        );
    }

    /**
     * @param User $user
     * @param string $template
     * @param string $subject
     * @param string $mailType
     * @return void
     * @throws BaseException
     */
    private function sendMail(User $user, string $template, string $subject, string $mailType = "Email"): void
    {
        if ($user->getEmail() === "" || !filter_var($user->getEmail(), FILTER_VALIDATE_EMAIL)) {
            $this->log(
                LogsType::GENERAL_ERROR->value,
                sprintf(
                    "Envoi d'email echoué, " .
                    "l'adresse mail du destinataire n'est pas valide : '%s' (id: %s) | mail : '%s'",
                    $user->getName() . " " . $user->getSurname(),
                    $user->getId(),
                    $user->getEmail()
                )
            );
            throw new MailException($user, "User email address must be valid", Response::HTTP_BAD_REQUEST);
        }

        //TODO: gérer la traducation en fonction de la langue de l'utilisateur ?
        $email = (new TemplatedEmail())
            ->to(new Address($user->getEmail()))
            ->subject($subject)
            ->htmlTemplate($template)
            ->context(['user' => $user]);

        try {
            $this->mailer->send($email);
        } catch (ExceptionInterface $e) {
            $this->log(
                LogsType::GENERAL_ERROR->value,
                sprintf(
                    "Envoi d'email echoué, type: '%s', destinataire : '%s %s' (id: %s)",
                    $mailType,
                    $user->getName(),
                    $user->getSurname(),
                    $user->getId()
                )
            );
            throw new MailException(
                $user,
                sprintf(
                    "%s for user %s(id:%s) has not been sent. Reason : %s",
                    $mailType,
                    $user->getName() . " " . $user->getSurname(),
                    $user->getId(),
                    mb_convert_encoding(trim($e->getMessage()), 'UTF-8')
                ),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $this->log(
            LogsType::API_INFO->value,
            sprintf(
                "Email envoyé, type: '%s', destinataire : '%s %s' (id: %s)",
                $mailType,
                $user->getName(),
                $user->getSurname(),
                $user->getId()
            )
        );
    }
}
