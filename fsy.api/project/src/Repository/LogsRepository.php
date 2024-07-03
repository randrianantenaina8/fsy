<?php

namespace App\Repository;

use App\Entity\Logs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Logs>
 *
 * @method Logs|null find($id, $lockMode = null, $lockVersion = null)
 * @method Logs|null findOneBy(array $criteria, array $orderBy = null)
 * @method Logs[]    findAll()
 * @method Logs[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LogsRepository extends ServiceEntityRepository
{
    use CommonRepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Logs::class);
    }

    public function add(Logs $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Logs $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    /**
     * @return Logs[] Returns an array of Logs objects
     */
    public function findAllFiltered(?array $filters = null, ?string $page = null, ?string $perPage = null): array
    {
        $queryBuilder = $this->createQueryBuilder('l');

        if (isset($filters['order'])) {
            foreach ($filters['order'] as $sort => $direction) {
                $queryBuilder->orderBy(sprintf("l.%s", $sort), $direction);
            }
        }

        if ($page !== null && $perPage !== null) {
            $queryBuilder->setFirstResult(((int)$page * (int)$perPage) - (int)$perPage)
                ->setMaxResults((int)$perPage);
        }

        return $queryBuilder->getQuery()
            ->getResult();
    }
}
