<?php

namespace App\DataFixtures;

use Faker\Factory;
use Faker\Generator;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    /**
     * @var Generator
     */
    private Generator $faker;
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {

        for ($i = 1; $i <= 5; $i++) {
            $user = new User();
            $user->setEmail($this->faker->companyEmail);
            $user->setName($this->faker->firstName);
            $user->setSurname($this->faker->lastName);
            //'$2y$10$zjz1pi8cL7ULOiPZbRkyZOmWJasgjVrrMHnd0WivbFscJP5CtuPW.' = 'password'
            $user->setPassword($this->hasher->hashPassword($user, 'password'));
            $user->setActive(true);

            $manager->persist($user);
        }

        $apiUser = new User();
        $apiUser->setEmail("sringot@nextaura.com");
        $apiUser->setName("Administrateur");
        $apiUser->setSurname("Nextaura");
        //'$2y$10$mEO4vqXnnCEXAQFoWu/cM.lax.Ic/agvQ2skOqMkNuIyeWLYt036O' = 'm@Ck6Ryz5a'
        $apiUser->setPassword($this->hasher->hashPassword($apiUser, 'm@Ck6Ryz5a'));
        $apiUser->setRoles(["ROLE_USER_API"]);
        $apiUser->setActive(true);

        $manager->persist($apiUser);
        $manager->flush();
    }
}
