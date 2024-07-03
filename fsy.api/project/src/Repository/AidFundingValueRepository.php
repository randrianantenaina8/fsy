<?php

namespace App\Repository;

use App\Entity\AidFundingValue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AidFundingValue>
 *
 * @method AidFundingValue|null find($id, $lockMode = null, $lockVersion = null)
 * @method AidFundingValue|null findOneBy(array $criteria, array $orderBy = null)
 * @method AidFundingValue[]    findAll()
 * @method AidFundingValue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AidFundingValueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AidFundingValue::class);
    }

    public function save(AidFundingValue $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AidFundingValue $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
