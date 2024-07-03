/* -------------------------- HTTP CODE --------------------------- */
export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_NO_CONTENT = 204
export const HTTP_FOUND = 302
export const HTTP_BAD_REQUEST = 400
export const HTTP_UNAUTHORIZED = 401
export const HTTP_FORBIDDEN = 403
export const HTTP_NOT_FOUND = 404
export const HTTP_TIMEOUT = 404
export const HTTP_USER_NOT_FOUND = 462
export const HTTP_INVALID_PASSWORD = 463
export const HTTP_INVALID_TOKEN = 464
export const HTTP_TOKEN_EXPIRED = 465
export const HTTP_PASSWORD_DO_NOT_MATCH = 466
export const HTTP_PASSWORD_TOO_WEAK = 467
export const HTTP_REGION_ALREADY_EXIST = 480
export const HTTP_CRITERIA_ALREADY_EXIST = 481
export const HTTP_CRITERIONTYPE_ALREADY_EXIST = 482
export const HTTP_ORGANIZATION_ALREADY_EXIST = 483
export const HTTP_PARAMETER_ALREADY_EXIST = 484
export const HTTP_PROFILE_ALREADY_EXIST = 485
export const HTTP_USER_ALREADY_EXIST = 486
export const HTTP_INTERNAL_ERROR = 500

/* ----------------------- DOCUMENT TITLE ------------------------ */
export const DOCUMENT_TITLE_FRONTOFFICE = "Simulateur Fransylva"
export const DOCUMENT_TITLE_BACKOFFICE = "FRANSYLVA - BO"

/* --------------------------- ROLES ----------------------------- */
export const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN"
export const ROLE_ADMIN = "ROLE_ADMIN"
export const ROLE_USER = "ROLE_USER"

/* --------------------------- OTHERS ----------------------------- */
export const PREFIX_LOCAL_STORAGE = "_fsy"

/* ------------------------ ORGANISMS TYPES -------------------------- */
export const ORGANISM_TYPE_ORGANISM = "Organisme"
export const ORGANISM_TYPE_PARTNER = "Partenaire"
export const ORGANISM_TYPE_FSY = "Fransylva"
export const ORGANISM_TYPE_OTHER = "Autre"

/* ------------------------ CRITERION TYPES -------------------------- */
export const CRITERION_TYPE_BIN = "BIN"
export const CRITERION_TYPE_NUM = "NUM"
export const CRITERION_TYPE_TXT = "TXT"
export const CRITERION_TYPE_OBG = "OBG"
export const CRITERION_TYPE_LOC = "LOC"

/* ------------------------ CRITERION DISPLAY TYPES -------------------------- */
export const CRITERION_DISPLAY_NOT_SPECIFIED = 0 // Criteria values display not specified
export const CRITERION_DISPLAY_CHECKBOX = 1 // criteria values are display as a list of checkbox
export const CRITERION_DISPLAY_SELECT = 2 // critera values are display in a select

/* ------------------------ AID STATUS -------------------------- */
export const AID_STATUS_DRAFT = 1 // Aid is being written
export const AID_STATUS_VALIDATING = 2 // Aid is sent to validation
export const AID_STATUS_REFUSED = 3 // aid is refused by Fransylva
export const AID_STATUS_VALIDATED = 4 // aid is approved by Fransylva

/* ------------------------ PROFILES -------------------------- */
export const PROFILE_AIDENTRY = "aidEntry"
export const PROFILE_AIDVALIDATION = "aidValidation"
export const PROFILE_AIDSIMULATION = "aidSimulation"
export const PROFILE_REQUESTSUPPORT = "requestSupport"
export const PROFILE_AIDCATALOG = "aidCatalog"
export const PROFILE_REPORTING = "reporting"
export const PROFILE_USERMANAGEMENT = "userManagement"
export const PROFILE_CRITERION = "criterion"
export const PROFILE_SIMULATOR = "simulator"
export const PROFILE_ORGANIZATION = "organization"

/* ------------------------ LOCATION TYPES -------------------------- */
export const LOCATION_TYPE_NATIONAL = "national";
export const LOCATION_TYPE_REGIONAL = "regional";
export const LOCATION_TYPE_DEPARTMENTAL = "departmental";

/* ------------------------ AID FUNDING -------------------------- */
export const AID_FUNDING_ESTIM_BILL_ID = 1;
export const AID_FUNDING_FIXED_AMOUNT_ID = 2
export const AID_FUNDING_SCALE_ID = 3
export const AID_FUNDING_PLAN_ID = 4

/* ------------------------ LOGS TYPES -------------------------- */
export const LOG_USER_ERROR = "user_error"
export const LOG_USER_ACTION = "user_action"
export const LOG_API_INFO = "api_info"
export const LOG_API_ERROR = "api_error"
export const LOG_GENERAL_INFO = "general_info"
export const LOG_GENERAL_ERROR = "general_error"
export const LOG_WARNING = "warning"

/* ============================ EXPORTS ============================ */

const exportedConst = {
    HTTP_OK,
    HTTP_FOUND,
    HTTP_CREATED,
    HTTP_NOT_FOUND,
    HTTP_FORBIDDEN,
    HTTP_TIMEOUT,
    HTTP_NO_CONTENT,
    HTTP_BAD_REQUEST,
    HTTP_UNAUTHORIZED,
    HTTP_USER_NOT_FOUND,
    HTTP_INVALID_TOKEN,
    HTTP_INVALID_PASSWORD,
    HTTP_INTERNAL_ERROR,
    HTTP_TOKEN_EXPIRED,
    HTTP_PASSWORD_TOO_WEAK,
    HTTP_PASSWORD_DO_NOT_MATCH,
    HTTP_REGION_ALREADY_EXIST,
    HTTP_CRITERIA_ALREADY_EXIST,
    HTTP_CRITERIONTYPE_ALREADY_EXIST,
    HTTP_ORGANIZATION_ALREADY_EXIST,
    HTTP_PARAMETER_ALREADY_EXIST,
    HTTP_PROFILE_ALREADY_EXIST,
    HTTP_USER_ALREADY_EXIST,
    DOCUMENT_TITLE_BACKOFFICE,
    DOCUMENT_TITLE_FRONTOFFICE,
    ROLE_ADMIN,
    ROLE_USER,
    ROLE_SUPER_ADMIN,
    PREFIX_LOCAL_STORAGE,
    ORGANISM_TYPE_ORGANISM,
    ORGANISM_TYPE_PARTNER,
    ORGANISM_TYPE_FSY,
    ORGANISM_TYPE_OTHER,
    CRITERION_TYPE_BIN,
    CRITERION_TYPE_NUM,
    CRITERION_TYPE_TXT,
    CRITERION_TYPE_OBG,
    CRITERION_TYPE_LOC,
    CRITERION_DISPLAY_NOT_SPECIFIED,
    CRITERION_DISPLAY_CHECKBOX,
    CRITERION_DISPLAY_SELECT,
    AID_STATUS_DRAFT,
    AID_STATUS_VALIDATING,
    AID_STATUS_REFUSED,
    AID_STATUS_VALIDATED,
    PROFILE_AIDENTRY,
    PROFILE_AIDVALIDATION,
    PROFILE_AIDSIMULATION,
    PROFILE_REQUESTSUPPORT,
    PROFILE_AIDCATALOG,
    PROFILE_REPORTING,
    PROFILE_USERMANAGEMENT,
    PROFILE_CRITERION,
    PROFILE_SIMULATOR,
    PROFILE_ORGANIZATION,
    LOCATION_TYPE_NATIONAL,
    LOCATION_TYPE_REGIONAL,
    LOCATION_TYPE_DEPARTMENTAL,
    LOG_USER_ERROR,
    LOG_USER_ACTION,
    LOG_API_INFO,
    LOG_API_ERROR,
    LOG_GENERAL_INFO,
    LOG_GENERAL_ERROR,
    LOG_WARNING,
    AID_FUNDING_ESTIM_BILL_ID,
    AID_FUNDING_FIXED_AMOUNT_ID,
    AID_FUNDING_SCALE_ID,
    AID_FUNDING_PLAN_ID
}

export default exportedConst
