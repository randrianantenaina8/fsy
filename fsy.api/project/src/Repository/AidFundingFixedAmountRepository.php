<?php

namespace App\Repository;

use App\Entity\AidFundingFixedAmount;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AidFundingFixedAmount>
 *
 * @method AidFundingFixedAmount|null find($id, $lockMode = null, $lockVersion = null)
 * @method AidFundingFixedAmount|null findOneBy(array $criteria, array $orderBy = null)
 * @method AidFundingFixedAmount[]    findAll()
 * @method AidFundingFixedAmount[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AidFundingFixedAmountRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AidFundingFixedAmount::class);
    }

    public function save(AidFundingFixedAmount $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AidFundingFixedAmount $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return AidFundingFixedAmount[] Returns an array of AidFundingFixedAmount objects
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

//    public function findOneBySomeField($value): ?AidFundingFixedAmount
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
