<?php

namespace App\Twig\Runtime;

use App\Entity\User;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Twig\Extension\RuntimeExtensionInterface;

class AppExtensionRuntime implements RuntimeExtensionInterface
{
    private ParameterBagInterface $parameterBag;

    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->parameterBag = $parameterBag;
    }

    public function getDomainByProfile(User $user): string
    {
        $profile = $user->getProfile();
        $aidEntry = $profile->getAidEntry();
        $aidValidation = $profile->getAidValidation();
        $aidSimulation = $profile->getAidSimulation();

        return !$aidEntry && !$aidValidation && $aidSimulation > 0 ?
            $this->parameterBag->get('front_domain') : $this->parameterBag->get('bo_domain');
    }
}
