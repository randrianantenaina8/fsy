<?php

namespace App\Exception;

use Exception;
use Throwable;

class BaseException extends Exception
{
    private mixed $data;
    private int $statusCode;

    /**
     * BaseException constructor.
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(mixed $data, string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->setData($data);
        $this->setStatusCode($code);
    }

    /**
     * @return mixed
     */
    public function getData(): mixed
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData(mixed $data): void
    {
        $this->data = $data;
    }

    /**
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @param mixed $statusCode
     */
    public function setStatusCode(mixed $statusCode): void
    {
        $this->statusCode = $statusCode;
    }
}
