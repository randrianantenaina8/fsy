<?php

namespace App\Repository;

use App\Entity\Aid;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Exception;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Aid>
 *
 * @method Aid|null find($id, $lockMode = null, $lockVersion = null)
 * @method Aid|null findOneBy(array $criteria, array $orderBy = null)
 * @method Aid[]    findAll()
 * @method Aid[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AidRepository extends ServiceEntityRepository
{
    use CommonRepositoryTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Aid::class);
    }

    public function save(Aid $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Aid $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getVersions(int $parentId, $last = false)
    {
        $queryBuilder = $this->createQueryBuilder("a");
        $queryBuilder->where(
            $queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq("a.id", ":id"),
                $queryBuilder->expr()->eq("a.parent", ":id"),
            )
        );

        if ($last) {
            $queryBuilder->orderBy('a.version', 'DESC')
                ->setMaxResults(1);
        }

        $queryBuilder->setParameter("id", $parentId);

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @return array
     * Final aid: aid can't be edited (
     * @throws Exception
     */
    public function getActiveAndValidating(): array
    {
        $sql = "SELECT id
        FROM aid
        WHERE (status = " . Aid::STATUS_VALIDATED . " AND active = 1)
            OR (status = 2 AND version = (
                SELECT MAX(version)
                FROM aid a2
                WHERE a2.id = aid.id
                AND a2.status = " . Aid::STATUS_VALIDATING . "
            ))";

        $stmt = $this->_em->getConnection()->prepare($sql);
        $result = $stmt->executeQuery()->fetchAllAssociative();

        if (count($result)) {
            return array_map(static function ($value) {
                return $value["id"];
            }, $result);
        }

        return [];
    }

    public function findCountStatus(): array
    {
        $queryBuilder = $this->createQueryBuilder('o')
            ->select('o.status, count(o.id) as count')
            ->groupBy('o.status');
        $queryBuilder->where("o.version = 1");
        return $queryBuilder->getQuery()->getResult();
    }
}
