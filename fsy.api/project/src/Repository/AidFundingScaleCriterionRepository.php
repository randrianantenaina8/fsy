<?php

namespace App\Repository;

use App\Entity\AidFundingScaleCriterion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AidFundingScaleCriterion>
 *
 * @method AidFundingScaleCriterion|null find($id, $lockMode = null, $lockVersion = null)
 * @method AidFundingScaleCriterion|null findOneBy(array $criteria, array $orderBy = null)
 * @method AidFundingScaleCriterion[]    findAll()
 * @method AidFundingScaleCriterion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AidFundingScaleCriterionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AidFundingScaleCriterion::class);
    }

    public function save(AidFundingScaleCriterion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AidFundingScaleCriterion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return AidFundingScaleCriterion[] Returns an array of AidFundingScaleCriterion objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AidFundingScaleCriterion
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
