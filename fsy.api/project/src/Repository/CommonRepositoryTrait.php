<?php

namespace App\Repository;

use App\Entity\Organization;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\ORM\QueryBuilder;

trait CommonRepositoryTrait
{
    /**
     * @return Object[] Returns an array of Logs objects
     */
    public function findAllFiltered(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $queryBuilder = $this->createQueryBuilder('o');
        $queryBuilder = $this->addFilters($queryBuilder, $filters);

        if (isset($filters['order'])) {
            foreach ($filters['order'] as $sort => $direction) {
                $queryBuilder->orderBy(sprintf("o.%s", $sort), $direction);
            }
        }

        if ($page !== null && $perPage !== null) {
            $queryBuilder->setFirstResult(((int)$page * (int)$perPage) - (int)$perPage)->setMaxResults((int)$perPage);
        }

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @param array|null $filters
     * @return int Returns an array of Logs objects
     * @throws NoResultException
     * @throws NonUniqueResultException
     */
    public function findCount(?array $filters = null): int
    {
        $queryBuilder = $this->createQueryBuilder('o')->select('count(o.id)');
        $queryBuilder = $this->addFilters($queryBuilder, $filters);
        return $queryBuilder->getQuery()->getSingleScalarResult();
    }

    private function addFilters(QueryBuilder $queryBuilder, ?array $filters): QueryBuilder
    {
        if (isset($filters['user_filterText'])) {
            $queryBuilder->andWhere(
                'o.name like :filter
                OR o.surname like :filter
                OR o.email like :filter'
            )->setParameters([
                'filter' => "%" . $filters['user_filterText'] . "%"
            ]);
        }

        if (isset($filters['aid_filterText'])) {
            $queryBuilder->andWhere(
                'o.name like :filter
                OR o.label like :filter
                OR o.description like :filter
                OR o.contactName like :filter
                OR o.contactEmail like :filter'
            )->setParameters([
                'filter' => "%" . $filters['aid_filterText'] . "%"
            ]);
        }

        if (isset($filters['criterion_filterText'])) {
            $queryBuilder->andWhere(
                'o.name like :filter
                OR o.shortName like :filter'
            )->setParameters([
                'filter' => "%" . $filters['criterion_filterText'] . "%"
            ]);
        }

        if (isset($filters['organization_filterText'])) {
            $queryBuilder->andWhere(
                'o.name like :filter
                OR o.contactName like :filter
                OR o.contactEmail like :filter
                OR o.contactPhone like :filter'
            )->setParameters([
                'filter' => "%" . $filters['organization_filterText'] . "%"
            ]);
        }

        if (isset($filters['log_filterText'])) {
            $queryBuilder->andWhere(
                'o.type like :filter
                OR o.info like :filter
                OR o.user like :filter'
            )->setParameters([
                'filter' => "%" . $filters['log_filterText'] . "%"
            ]);
        }

        if (isset($filters['question_filterText'])) {
            $queryBuilder->andWhere('o.questionText like :questionText')
                ->setParameter('questionText', "%" . $filters['question_filterText'] . "%");
        }

        if (isset($filters['filterText'])) {
            $queryBuilder->andWhere('o.name like :name')
                ->setParameter('name', "%" . $filters['filterText'] . "%");
        }

        if (isset($filters['role'])) {
            $queryBuilder->andWhere('o.roles LIKE :roleString')
                ->setParameter('roleString', "%" . $filters['role'] . "%");
        }

        if (isset($filters['profiles'])) {
            $queryBuilder->andWhere('o.profile IN (:profilesId)')
                ->setParameter('profilesId', explode(',', $filters['profiles']));
        }

        if (isset($filters['organizations'])) {
            $queryBuilder->andWhere('o.organization IN (:organizationId)')
                ->setParameter('organizationId', explode(',', $filters['organizations']));
        }

        if (isset($filters['organizationUuid'])) {
            $queryBuilder->andWhere('o.uuid = :organizationUuid')
                ->setParameter('organizationUuid', $filters['organizationUuid']);
        }

        if (isset($filters['organizationType'])) {
            $strRequest = "";
            if (str_contains($filters['organizationType'], Organization::TYPE_ORGANISM)) {
                $strRequest .= "(o.organism = 1) OR ";
            }
            if (str_contains($filters['organizationType'], Organization::TYPE_PARTNER)) {
                $strRequest .= "(o.partner = 1) OR ";
            }
            if (str_contains($filters['organizationType'], Organization::TYPE_OTHER)) {
                $strRequest .= "(o.other = 1) OR ";
            }
            if (str_contains($filters['organizationType'], Organization::TYPE_FSY)) {
                $strRequest .= "(o.organism = 0 AND o.partner = 0 AND o.other = 0) OR ";
            }
            $queryBuilder->andWhere(rtrim($strRequest, " OR"));
        }

        if (isset($filters['criterionTypes'])) {
            $queryBuilder->andWhere('o.type IN (:criterionTypes)')
                ->setParameter('criterionTypes', explode(',', $filters['criterionTypes']));
        }

        if (isset($filters['aidNature'])) {
            $queryBuilder->andWhere('o.nature IN (:aidNature)')
                ->setParameter('aidNature', explode(',', $filters['aidNature']));
        }

        if (isset($filters['aidComplexity'])) {
            $queryBuilder->andWhere('o.aidComplexity IN (:aidComplexity)')
                ->setParameter('aidComplexity', explode(',', $filters['aidComplexity']));
        }

        if (isset($filters['isOrganism'])) {
            $queryBuilder->andWhere('o.organism = :organism')
                ->setParameter('organism', $filters['isOrganism'] === "true");
        }

        if (isset($filters['isPartner'])) {
            $queryBuilder->andWhere('o.partner = :partner')
                ->setParameter('partner', $filters['isPartner'] === "true");
        }

        if (isset($filters['banned'])) {
            $queryBuilder->andWhere('o.banned = :banned')
                ->setParameter('banned', $filters['banned'] === "true");
        }

        if (isset($filters['active'])) {
            $queryBuilder->andWhere('o.active = :active')
                ->setParameter('active', $filters['active'] === "true");
        }

        if (isset($filters['status'])) {
            $queryBuilder->andWhere('o.status = :status')
                ->setParameter('status', $filters['status'] === "true");
        }

        if (isset($filters['statusAid'])) {
            $queryBuilder->andWhere('o.status = :status')
                ->setParameter('status', $filters['statusAid']);
        }

        if (isset($filters['aidVersion'])) {
            $queryBuilder->andWhere('o.version = :version')
                ->setParameter('version', $filters['aidVersion']);
        }

        if (isset($filters['mandatory'])) {
            $queryBuilder->andWhere('o.mandatory = :mandatory')
                ->setParameter('mandatory', $filters['mandatory'] === "true");
        }

        if (isset($filters['simulatorOnly'])) {
            $queryBuilder->andWhere('o.simulatorOnly = :simulatorOnly')
                ->setParameter('simulatorOnly', $filters['simulatorOnly'] === "true");
        }

        return $queryBuilder;
    }
}
