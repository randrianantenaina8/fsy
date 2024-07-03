<?php

namespace App\Controller\Aid;

use App\Entity\Aid;
use App\Exception\BaseException;
use App\Manager\AidManager;
use App\Services\Utils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class PostAidAction extends AbstractController
{
    public function __invoke(
        Request $request,
        AidManager $manager,
        ParameterBagInterface $parameterBag,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        /**
         * @var Aid $aid
         */
        $aid = $serializer->deserialize($data, Aid::class, 'json', ['groups' => 'aid:read']);

        try {
            $result = $manager->createAid($aid);
            return $this->json($result, Response::HTTP_CREATED);
        } catch (BaseException $e) {
            return $this->json(
                Utils::formatErrorResponse($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR, $data),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
