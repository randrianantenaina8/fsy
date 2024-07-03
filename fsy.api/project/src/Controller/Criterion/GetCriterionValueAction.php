<?php

namespace App\Controller\Criterion;

use App\Repository\CriterionValueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetCriterionValueAction extends AbstractController
{
    public function __construct(
        private readonly CriterionValueRepository $criterionValueRepository
    ) {
    }

    public function __invoke(
        string $shortName
    ) {
        return $this->criterionValueRepository->findByCriterionShortName($shortName);
    }
}
