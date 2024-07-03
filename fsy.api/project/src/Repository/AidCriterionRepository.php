<?php

namespace App\Repository;

use App\Entity\AidCriterion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AidCriterion>
 *
 * @method AidCriterion|null find($id, $lockMode = null, $lockVersion = null)
 * @method AidCriterion|null findOneBy(array $criteria, array $orderBy = null)
 * @method AidCriterion[]    findAll()
 * @method AidCriterion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AidCriterionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AidCriterion::class);
    }

    public function save(AidCriterion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AidCriterion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getAidActiveByCriterion(int $id, $aidIds = [])
    {
        $qb = $this->createQueryBuilder("ac");
        return $qb
            ->innerJoin("ac.aid", "a")
            ->andWhere(
                $qb->expr()->in("a.id", $aidIds)
            )->andWhere("ac.criterion = :criterionId")
            ->setParameter("criterionId", $id)
            ->getQuery()
            ->getResult();
    }
}
