<?php

namespace App\Services;

use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\NameConverter\MetadataAwareNameConverter;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class Utils
{
    /**
     * @param string $errorMessage
     * @param int $code
     * @param mixed $data
     * @return array
     */
    public static function formatErrorResponse(string $errorMessage = "", int $code = 0, mixed $data = []): array
    {
        return [
            'error' => true,
            'message' => $errorMessage,
            'code' => $code,
            'data' => $data
        ];
    }

    /**
     *
     * Get Json Serializer
     *
     * @return Serializer
     */
    public static function getJsonSerializer(): Serializer
    {
        $classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $metadataAwareNameConverter = new MetadataAwareNameConverter($classMetadataFactory);
        $objectNormalizer = new ObjectNormalizer(
            $classMetadataFactory,
            $metadataAwareNameConverter,
            null,
            new ReflectionExtractor()
        );
        $normalizers = [
            new DateTimeNormalizer(),
            new ArrayDenormalizer(),
            $objectNormalizer,
        ];
        $encoders = [new JsonEncoder()];
        return new Serializer($normalizers, $encoders);
    }

    /**
     * @param array $groups
     * @return array
     */
    public static function setContext(array $groups): array
    {
        $context = [];
        $context['circular_reference_handler'] = static function ($object) {
            return $object->getId();
        };
        $context['groups'] = $groups;

        return $context;
    }
}
