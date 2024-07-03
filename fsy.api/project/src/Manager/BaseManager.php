<?php

namespace App\Manager;

use App\Entity\User;
use App\Services\Logger;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class BaseManager.
 */
abstract class BaseManager
{
    protected EntityManagerInterface $entityManager;
    protected EntityRepository $repository;
    protected Logger $logger;
    protected string $class;
    protected Security $security;


    /**
     * @param EntityManagerInterface $entityManager
     * @param string $class
     * @param Logger $logger
     * @param Security $security
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        string $class,
        Logger $logger,
        Security $security
    ) {
        $this->entityManager = $entityManager;
        $this->class = $class;
        $this->repository = $this->entityManager->getRepository($this->class);
        $this->logger = $logger;
        $this->security = $security;
    }

    /**
     * @param mixed $entity
     *
     * @return mixed
     */
    public function persist(mixed $entity): mixed
    {
        $this->entityManager->persist($entity);

        return $entity;
    }

    /**
     * @return void
     */
    public function flush(): void
    {
        $this->entityManager->flush();
    }

    /**
     * @param mixed $entity
     *
     * @return mixed
     */
    public function persistAndFlush(mixed $entity): mixed
    {
        $this->entityManager->persist($entity);
        $this->entityManager->flush();

        return $entity;
    }

    /**
     * @param mixed $entity
     *
     * @return bool
     */
    public function remove(mixed $entity): bool
    {
        $this->entityManager->remove($entity);
        $this->flushAndClear();

        return true;
    }

    /**
     * @return void
     */
    public function flushAndClear(): void
    {
        $this->entityManager->flush();
    }

    public function clear(): void
    {
        $this->entityManager->clear();
    }

    /**
     * @return mixed
     */
    public function createEntity(): mixed
    {
        return new $this->class();
    }

    /**
     * @return array|object[]
     */
    public function findAll(): array
    {
        return $this->repository->findAll();
    }

    /**
     * @param int $id
     *
     * @return ?object
     */
    public function find(int $id): ?object
    {
        return $this->repository->findOneBy(['id' => $id]);
    }

    /**
     * @param array $criteria
     * @param array|null $orderBy
     * @param null $limit
     * @param null $offset
     * @return array|object[]
     */
    public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null): array
    {
        return $this->repository->findBy($criteria, $orderBy, $limit, $offset);
    }

    /**
     * @param array $criteria
     *
     * @return ?object
     */
    public function findOneBy(array $criteria): ?object
    {
        return $this->repository->findOneBy($criteria);
    }

    /**
     * Begin Transaction
     */
    public function beginTransaction(): void
    {
        $this->entityManager->beginTransaction();
    }

    /**
     * Commit
     */
    public function commit(): void
    {
        $this->entityManager->commit();
    }

    /**
     * Rollback
     */
    public function rollback(): void
    {
        $this->entityManager->rollback();
    }

    /**
     * @return EntityRepository
     */
    public function getRepository(): EntityRepository
    {
        return $this->repository;
    }

    /**
     * @param string $type
     * @param string $info
     * @param User|null $user
     */
    public function log(string $type, string $info, ?User $user = null): void
    {
        $currentUser = $user ?? $this->getCurrentUser();
        $this->logger->log($type, $info, $currentUser);
    }

    /**
     * @return UserInterface|null
     */
    public function getCurrentUser(): ?UserInterface
    {
        return $this->security->getUser();
    }
}
