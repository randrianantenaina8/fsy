<?php

namespace App\Subscriber;

use App\Entity\Criterion;
use App\Entity\CriterionType;
use App\Entity\Organization;
use App\Entity\Parameter;
use App\Entity\Profile;
use App\Entity\User;
use App\Enum\HttpCodes;
use App\Exception\CriteriaAlreadyExistException;
use App\Exception\CriterionTypeAlreadyExistException;
use App\Exception\OrganizationAlreadyExistException;
use App\Exception\ParameterAlreadyExistException;
use App\Exception\ProfileAlreadyExistException;
use App\Exception\RegionAlreadyExistException;
use App\Exception\UserAlreadyExistException;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Entity\Region;

class UniqueConstraintSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::EXCEPTION => ['checkException'],
        ];
    }

    /**
     * @param ExceptionEvent $event
     * @throws CriteriaAlreadyExistException
     * @throws CriterionTypeAlreadyExistException
     * @throws OrganizationAlreadyExistException
     * @throws ParameterAlreadyExistException
     * @throws ProfileAlreadyExistException
     * @throws RegionAlreadyExistException
     * @throws UniqueConstraintViolationException
     * @throws UserAlreadyExistException
     */
    public function checkException(ExceptionEvent $event): void
    {
        $currentException = $event->getThrowable();
        if ($currentException instanceof UniqueConstraintViolationException) {
            throw match ($event->getRequest()->attributes->get("_api_resource_class")) {
                Region::class => new RegionAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::REGION_ALREADY_EXIST->value . ' - Une région avec ce numéro ou ce nom existe déjà !'
                ),
                Criterion::class => new CriteriaAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::CRITERIA_ALREADY_EXIST->value . ' - Ce critère existe déjà !'
                ),
                CriterionType::class => new CriterionTypeAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::CRITERIONTYPE_ALREADY_EXIST->value . ' - Ce type de critère existe déjà !'
                ),
                Organization::class => new OrganizationAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::ORGANIZATION_ALREADY_EXIST->value . ' - Une organisation existe déjà avec ce nom!'
                ),
                Profile::class => new ProfileAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::PROFILE_ALREADY_EXIST->value . ' - Un profil avec ce nom existe déjà !'
                ),
                Parameter::class => new ParameterAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::PARAMETER_ALREADY_EXIST->value . ' - Ce paramètre existe déjà pour cette exntreprise!'
                ),
                User::class => new UserAlreadyExistException(
                    $event->getRequest()->getContent(),
                    HttpCodes::USER_ALREADY_EXIST->value . ' - Un utilisateur avec cet email existe déjà !'
                ),
                default => $currentException,
            };
        }
    }
}
