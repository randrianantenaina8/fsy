<?php

namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Aid;
use App\Entity\AidCriterion;
use App\Entity\Criterion;
use App\Enum\CriterionTypeShortName;
use App\Enum\HttpCodes;
use App\Exception\CriteriaUsedException;
use App\Manager\CriterionManager;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CriterionChangedSubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $entityManager;
    private CriterionManager $criterionManager;
    private LoggerInterface $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        CriterionManager $criterionManager,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->criterionManager = $criterionManager;
        $this->logger = $logger;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['criterionChangedAction', EventPriorities::PRE_VALIDATE],
        ];
    }

    /**
     * @throws CriteriaUsedException
     */
    public function criterionChangedAction(ViewEvent $event): void
    {
        $criterion = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$criterion instanceof Criterion || $method != Request::METHOD_PUT) {
            return;
        }

        $activeAndValidationAidIds = $this->entityManager->getRepository(Aid::class)->getActiveAndValidating();


        if ($criterion->getId() && count($activeAndValidationAidIds)) {
            $canSave = true;

            /**
             * @var Criterion $previousCriterion
             */
            $previousCriterion = $event->getRequest()->attributes->get('previous_data');

            $aidActive = $this->entityManager->getRepository(Aid::class)->findBy(
                ["id" => $activeAndValidationAidIds]
            );

            $aidsActiveByCriterion = $this->entityManager
                ->getRepository(AidCriterion::class)
                ->getAidActiveByCriterion($criterion->getId(), $activeAndValidationAidIds);

            if ($criterion->isMandatory() && !$previousCriterion->isMandatory()) {
                // Can change to Mandatory
                $canSave = count($aidActive) === count($aidsActiveByCriterion);

                $message = <<<EOF
Une ou plusieurs aides n'ont pas de valeur pour ce critère.
Vous devez renseigner ce critère sur toutes les aides avant de pouvoir le passer en obligatoire.
EOF;
            }

            switch ($criterion->getType()->getShortName()) {
                case CriterionTypeShortName::TXT->value:
                    $valueIds = $criterion->getCriterionValues()->filter(function ($value) {
                        return !$value->isActive();
                    })->map(function ($value) {
                        return $value->getId();
                    });

                    foreach ($aidsActiveByCriterion as $item) {
                        /**
                         * @var AidCriterion $item
                         */
                        if (count(array_intersect($valueIds->toArray(), $item->getValue()["answers"])) > 0) {
                            $canSave = false;
                            $message = "Une ou plusieurs aides utilisent cette valeur. Vous devez choisir une autre 
                        valeur sur toutes les aides avant de pouvoir supprimer cette valeur.";
                            break;
                        }
                    }
                    break;

                case CriterionTypeShortName::NUM->value:
                    $errorMin = false;
                    $errorMax = false;

                    foreach ($aidsActiveByCriterion as $item) {
                        /**
                         * @var AidCriterion $item
                         */
                        if ($item->getValue()["min"] < $criterion->getValueMin()) {
                            $errorMin = true;
                        }

                        if ($item->getValue()["max"] > $criterion->getValueMax()) {
                            $errorMax = true;
                        }

                        if ($errorMax || $errorMin) {
                            $canSave = false;

                            if ($errorMin) {
                                $message = "Une ou plusieurs aides ont une valeur inférieure à la valeur 
                            minimum de ce critère. Vous devez mettre une valeur supérieure à cette valeur minimum 
                            sur toutes aides avant de modifier cette valeur.";
                            }

                            if ($errorMax) {
                                $message = "Une ou plusieurs aides ont une valeur supérieure à la valeur 
                            maximum de ce critère. Vous devez mettre une valeur inférieure à cette valeur 
                            maximum sur toutes aides avant de modifier cette valeur.";
                            }
                        }
                    }
                    break;
            }

            if (!$canSave) {
                throw new CriteriaUsedException(
                    $event->getRequest()->getContent(),
                    $message ?? "",
                    HttpCodes::CRITERIA_USED->value
                );
            }
        }
    }
}
