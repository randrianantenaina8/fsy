<?php

namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use App\Exception\BaseException;
use App\Manager\UserManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Class NotificationCreatedSubscriber
 * @package App\Subscriber
 */
class UserCreatedSubscriber implements EventSubscriberInterface
{
    private UserManager $userManager;

    /**
     * KernelResponseListener constructor.
     *
     * @param UserManager $userManager
     */
    public function __construct(UserManager $userManager)
    {
        $this->userManager = $userManager;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['sendMailNotification', EventPriorities::POST_WRITE],
        ];
    }

    /**
     * @throws BaseException
     */
    public function sendMailNotification(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        /* Check if the request is a post of a User Entity */
        if (!$user instanceof User || Request::METHOD_POST !== $method) {
            return;
        }

        if ($user->isStatus()) {
            $this->userManager->generateTokenAndSendCreationMail($user);
        }
    }
}
