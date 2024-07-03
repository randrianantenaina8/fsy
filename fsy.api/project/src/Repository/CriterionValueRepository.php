<?php

namespace App\Repository;

use App\Entity\CriterionValue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CriterionValue>
 *
 * @method CriterionValue|null find($id, $lockMode = null, $lockVersion = null)
 * @method CriterionValue|null findOneBy(array $criteria, array $orderBy = null)
 * @method CriterionValue[]    findAll()
 * @method CriterionValue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CriterionValueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CriterionValue::class);
    }

    public function save(CriterionValue $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CriterionValue $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByCriterionShortName($criterionShortName)
    {
        $qb = $this->createQueryBuilder("cv");
        $qb->innerJoin("cv.criterion", "c")
            ->where("c.shortName = :criterionShortName")
            ->setParameter("criterionShortName", $criterionShortName);

        return $qb->getQuery()->getResult();
    }
}
