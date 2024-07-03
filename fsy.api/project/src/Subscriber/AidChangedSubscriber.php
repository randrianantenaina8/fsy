<?php

namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Aid;
use App\Entity\AidHistory;
use App\Exception\BaseException;
use App\Manager\AidManager;
use App\Services\AidHistoryLogger;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Class AidChangedSubscriber
 * @package App\Subscriber
 */
class AidChangedSubscriber implements EventSubscriberInterface
{
    private AidManager $aidManager;
    private AidHistoryLogger $aidHistoryLogger;

    /**
     * KernelResponseListener constructor.
     *
     * @param AidManager $aidManager
     * @param AidHistoryLogger $aidHistoryLogger
     */
    public function __construct(AidManager $aidManager, AidHistoryLogger $aidHistoryLogger)
    {
        $this->aidManager = $aidManager;
        $this->aidHistoryLogger = $aidHistoryLogger;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['aidChangedAction', EventPriorities::POST_WRITE],
                ['aidWillUpdate', EventPriorities::PRE_WRITE],
            ]
        ];
    }

    public function aidChangedAction(ViewEvent $event): void
    {
        $aid = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        /* Check if the request is a post of an Aid Entity */
        if (!$aid instanceof Aid || !in_array($method, [Request::METHOD_PUT, Request::METHOD_POST], true)) {
            return;
        }

        if ($aid->isActive()) {
            $this->aidManager->disableAllPreviousVersions($aid);
        }
    }

    public function aidWillUpdate(ViewEvent $event): void
    {
        $aid = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        /* @var $previousObject Aid */
        $previousObject = $event->getRequest()->attributes->get("previous_data");

        /* Check if the request is a put of an Aid Entity */
        if (!$aid instanceof Aid || Request::METHOD_PUT !== $method) {
            return;
        }

        $type = AidHistory::CONTENT_EDIT;

        // Log status change
        if ($previousObject->getStatus() !== $aid->getStatus()) {
            $type = match ($aid->getStatus()) {
                Aid::STATUS_DRAFT => AidHistory::STATUS_CHANGED_TO_DRAFT,
                Aid::STATUS_VALIDATING => AidHistory::STATUS_CHANGED_TO_VALIDATING,
                Aid::STATUS_REFUSED => AidHistory::STATUS_CHANGED_TO_REFUSED,
                Aid::STATUS_VALIDATED => AidHistory::STATUS_CHANGED_TO_VALIDATED
            };
        }
        // Log active change
        if ($previousObject->isActive() !== $aid->isActive()) {
            $type = $aid->isActive() ? AidHistory::STATUS_CHANGED_TO_PUBLISHED
                : AidHistory::STATUS_CHANGED_TO_UNPUBLISHED;
        }

        if ($aid->getParent() !== null) {
            $aid = $aid->getParent();
        }

        $this->aidHistoryLogger->addHistory($type, $aid);
    }
}
