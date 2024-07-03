<?php

namespace App\Enum;

enum LogsType: string
{
    case USER_ERROR = "user_error";
    case USER_ACTION = "user_action";
    case API_INFO = "api_info";
    case API_ERROR = "api_error";
    case GENERAL_INFO = "general_info";
    case GENERAL_ERROR = "general_error";
    case WARNING = "warning";
}
