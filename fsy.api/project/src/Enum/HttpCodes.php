<?php

namespace App\Enum;

/**
 *
 */
enum HttpCodes: int
{
    case USER_NOT_FOUND = 462;
    case INVALID_PASSWORD = 463;
    case INVALID_TOKEN = 464;
    case TOKEN_EXPIRED = 465;
    case PASSWORD_DO_NOT_MATCH = 466;
    case PASSWORD_TOO_WEAK = 467;
    case REGION_ALREADY_EXIST = 480;
    case CRITERIA_ALREADY_EXIST = 481;
    case CRITERIONTYPE_ALREADY_EXIST = 482;
    case ORGANIZATION_ALREADY_EXIST = 483;
    case PARAMETER_ALREADY_EXIST = 484;
    case PROFILE_ALREADY_EXIST = 485;
    case USER_ALREADY_EXIST = 486;

    case CRITERIA_USED = 487;
}
