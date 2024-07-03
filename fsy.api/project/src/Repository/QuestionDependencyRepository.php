<?php

namespace App\Repository;

use App\Entity\QuestionDependency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QuestionDependency>
 *
 * @method QuestionDependency|null find($id, $lockMode = null, $lockVersion = null)
 * @method QuestionDependency|null findOneBy(array $criteria, array $orderBy = null)
 * @method QuestionDependency[]    findAll()
 * @method QuestionDependency[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class QuestionDependencyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuestionDependency::class);
    }

    public function save(QuestionDependency $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(QuestionDependency $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
