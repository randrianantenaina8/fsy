import React from "react"
import {Constants, Roles, Session} from "fsy.common-library"
import {NavLink} from "react-router-dom"
import {toast} from "react-toastify"
import _ from "lodash"

/**
 *
 * @param length {number}
 * @return {string}
 */
function generateUUID(length = 5) {
    const uuid = crypto.randomUUID()
    return uuid.slice(uuid.length - 5)
}

function getToastOptions(delay = 2000, theme = "colored", position = toast.POSITION.BOTTOM_RIGHT) {
    return {
        position: position,
        autoClose: delay,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme
    }
}

/**
 *
 * @param responseObject
 * @return {boolean|Object}
 */
function isValidResponse(responseObject) {
    let response = false
    if (responseObject.hasOwnProperty("data") && typeof responseObject.data === "object") {
        response = responseObject.data
        if (responseObject.data.hasOwnProperty("@type") && responseObject.data["@type"] === "hydra:Collection") {
            response = responseObject.data["hydra:member"]
        }
    }
    return response
}

function displayApiToastResult(response, message = "OK") {
    if (response?.status !== 200 && response?.status !== 201) {
        message = "Oops ! Une erreur est survenue. Merci de rééssayer ultérieurement et veuillez d'avertir l'administrateur si le problème persiste"
        if (response["@type"] === "ConstraintViolationList") {
            message = response.violations[0].message
        }
        toast.error(message, getToastOptions())
    } else {
        toast.success(message, getToastOptions())
    }
}

function displayGenericErrorToast() {
    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations." +
        "Réessayez et veuillez avertir l'administrateur si le problème persiste", getToastOptions())
}

async function getDataTableLines(apiFunction, urlParams, stateParamName, formatFunction, page = 1, filters = null, callback = null) {
    if (filters !== null) {
        urlParams = getFiltersUrlParams(filters, urlParams)
    }

    // call questions API
    const result = await apiFunction(page, urlParams)
    const resultObject = isValidResponse(result)

    if (resultObject) {
        let data = []
        for (const object of resultObject) {
            data.push(await formatFunction.bind(this)(object))
        }
        // Update table state with formatted rows
        this.setState({[stateParamName]: data, loading: false}, () => {
            if (callback !== null && callback instanceof Function) {
                callback()
            }
        })
    }
}


/**
 * Format a text link to a html div used for dataTable display
 *
 * @param text {string}
 * @param className {string}
 * @param onClickLocation {string}
 * @return {JSX.Element}
 */
function FormatLink(text, className = "text-display", onClickLocation) {
    return <NavLink className={className} title={text} to={onClickLocation}>
        <span>{text}</span>
    </NavLink>
}

/**
 * Format a text to a html div used for dataTable display
 *
 * @param text {string}
 * @param className {string}
 * @return {JSX.Element}
 */
function FormatText(text, className = "") {
    return <div className={className} title={text}>
        <span>{text}</span>
    </div>
}

/**
 * Format a text to a html clickable div used for dataTable display
 *
 * @param text {string}
 * @param className {string}
 * @param onclick {?function}
 * @return {JSX.Element}
 */
function FormatClickableText(text, onclick = null, className = "") {
    return <span className={`bo-data-table_clickable ${className}`} title={text} onClick={onclick}>
        <span>{text}</span>
    </span>
}

/**
 * Format an email to a html div used for dataTable display
 *
 * @param mail {string}
 * @param className {string}
 * @return {JSX.Element}
 */
function FormatMail(mail, className = "") {
    return <div className={className} title={`Envoyer un mail à ${mail}`}>
        <span><a href={`mailto:${mail}`}>{mail}</a></span>
    </div>
}

/**
 * Format a phone number to a html div used for dataTable display
 *
 * @param phone {string}
 * @param className {string}
 * @return {JSX.Element}
 */
function FormatPhone(phone, className = "") {
    return <div className={className} title={`Appeler le ${phone}`}>
        <span><a href={`tel:${phone}`}>{phone}</a></span>
    </div>
}

/**
 * Format a text to a html div stylised as a badge used for dataTable display
 *
 * @param text {string}
 * @param state
 * @return {JSX.Element}
 */
function FormatBadge(text, state) {
    return <div title={text}>
        <span className={`badge ${state ? "green" : "red"}`}>
            {text}
        </span>
    </div>
}

/**
 * Format an organization object to a html div used for dataTable display
 *
 * @param organization
 * @return {JSX.Element}
 */
function FormatType(organization) {
    const badgeColor = {
        [Constants.ORGANISM_TYPE_ORGANISM]: "blue",
        [Constants.ORGANISM_TYPE_PARTNER]: "purple",
        [Constants.ORGANISM_TYPE_FSY]: "red",
        [Constants.ORGANISM_TYPE_OTHER]: "silver"
    }

    let type = Constants.ORGANISM_TYPE_FSY
    if (organization.organism) {
        type = Constants.ORGANISM_TYPE_ORGANISM
    }
    if (organization.partner) {
        type = Constants.ORGANISM_TYPE_PARTNER
    }
    if (organization.other) {
        type = Constants.ORGANISM_TYPE_OTHER
    }

    return <div className="badge-display" title={type}>
        <span className={`badge ${badgeColor[type]}`}>
            {type}
        </span>
    </div>
}

/**
 * Format an organization name with type color
 *
 * @param organization
 * @return {JSX.Element}
 */
function FormatOrganization(organization) {
    const badgeColor = {
        [Constants.ORGANISM_TYPE_ORGANISM]: "blue",
        [Constants.ORGANISM_TYPE_PARTNER]: "purple",
        [Constants.ORGANISM_TYPE_FSY]: "red",
        [Constants.ORGANISM_TYPE_OTHER]: "gray"
    }

    let type = Constants.ORGANISM_TYPE_FSY
    if (organization.organism) {
        type = Constants.ORGANISM_TYPE_ORGANISM
    }
    if (organization.partner) {
        type = Constants.ORGANISM_TYPE_PARTNER
    }
    if (organization.other) {
        type = Constants.ORGANISM_TYPE_OTHER
    }

    return <div className="badge-display badge-organization" title={type}>
        <span className={`badge ${badgeColor[type]}`}>
            {organization.name}
        </span>
    </div>
}

function FormatOrganismListFiltered(typeOrganism, organismList) {
    let filtered = []
    typeOrganism.forEach(type => {
        filtered = [...filtered, {
            label: type,
            options: organismList.filter(element => {
                switch (type) {
                    case Constants.ORGANISM_TYPE_ORGANISM:
                        if (element.organism) {
                            return true
                        }
                        break
                    case Constants.ORGANISM_TYPE_PARTNER:
                        if (element.partner) {
                            return true
                        }
                        break
                    case Constants.ORGANISM_TYPE_OTHER:
                        if (element.other) {
                            return true
                        }
                        break
                    case Constants.ORGANISM_TYPE_FSY:
                        if (!element.organism && !element.partner && !element.other) {
                            return true
                        }
                        break
                    default:
                        break
                }
                return false
            }).map(element => {
                return {label: element.name, value: element.id}
            })
        }]
    })

    return filtered
}

/**
 * Format a Criteria object to a html div used for dataTable display
 *
 * @param criteria
 * @return {JSX.Element}
 */
function FormatCriterionType(criteria) {
    const badgeColor = {
        [Constants.CRITERION_TYPE_BIN]: "blueGray",
        [Constants.CRITERION_TYPE_NUM]: "purple",
        [Constants.CRITERION_TYPE_TXT]: "blue",
        [Constants.CRITERION_TYPE_OBG]: "lightBlue",
        [Constants.CRITERION_TYPE_LOC]: "lightSkyBlue",
        "Unknown": "silver"
    }

    let type = "Unknown"
    if (badgeColor[criteria?.type?.shortName] !== undefined) {
        type = criteria.type.shortName
    }

    return <div className="badge-display" title={type}>
        <span className={`badge ${badgeColor[type]}`}>
            {criteria.type.label}
        </span>
    </div>
}


/**
 * Check and format filter object content and put the result in urlParams object
 *
 * @param filters {object}
 * @param urlParams {object}
 * @return {object}
 */
function getFiltersUrlParams(filters, urlParams = {}) {
    if (filters.hasOwnProperty("questionFilterText")) {
        urlParams["question_filterText"] = filters.questionFilterText
    }
    if (filters.hasOwnProperty("aidFilterText")) {
        urlParams["aid_filterText"] = filters.aidFilterText
    }
    if (filters.hasOwnProperty("userFilterText")) {
        urlParams["user_filterText"] = filters.userFilterText
    }
    if (filters.hasOwnProperty("criterionFilterText")) {
        urlParams["criterion_filterText"] = filters.criterionFilterText
    }
    if (filters.hasOwnProperty("organizationFilterText")) {
        urlParams["organization_filterText"] = filters.organizationFilterText
    }
    if (filters.hasOwnProperty("organizationType")) {
        urlParams["organizationType"] = filters.organizationType
    }
    if (filters.hasOwnProperty("filterText")) {
        urlParams["filterText"] = filters.filterText
    }
    if (filters.hasOwnProperty("active")) {
        urlParams["active"] = filters.active
    }
    if (filters.hasOwnProperty("status")) {
        urlParams["status"] = filters.status
    }
    if (filters.hasOwnProperty("statusAid")) {
        urlParams["statusAid"] = filters.statusAid
    }
    if (filters.hasOwnProperty("mandatory")) {
        urlParams["mandatory"] = filters.mandatory
    }
    if (filters.hasOwnProperty("isOrganism")) {
        urlParams["organism"] = filters.isOrganism
    }
    if (filters.hasOwnProperty("isPartner")) {
        urlParams["partner"] = filters.isPartner
    }
    if (filters.hasOwnProperty("role")) {
        urlParams["role"] = filters.role
    }
    if (filters.hasOwnProperty("profiles")) {
        urlParams["profiles"] = _.join(filters.profiles, ",")
    }
    if (filters.hasOwnProperty("organizations")) {
        urlParams["organizations"] = _.join(filters.organizations, ",")
    }
    if (filters.hasOwnProperty("criterionTypes")) {
        urlParams["criterionTypes"] = _.join(filters.criterionTypes, ",")
    }
    if (filters.hasOwnProperty("aidNature")) {
        urlParams["aidNature"] = _.join(filters.aidNature, ",")
    }
    if (filters.hasOwnProperty("aidComplexity")) {
        urlParams["aidComplexity"] = _.join(filters.aidComplexity, ",")
    }
    return urlParams
}

function isUserSuperAdmin() {
    return Roles.isGranted(Session.getSessionUser().roles[0], Constants.ROLE_SUPER_ADMIN)
}

function orderObjectByKeys(value) {
    return Object.keys(value).sort().reduce(
        (obj, key) => {
            obj[key] = value[key];
            return obj;
        },
        {}
    )
}

const exportedFunctions = {
    generateUUID,
    getToastOptions,
    isValidResponse,
    displayApiToastResult,
    displayGenericErrorToast,
    getDataTableLines,
    getFiltersUrlParams,
    FormatLink,
    FormatText,
    FormatClickableText,
    FormatBadge,
    FormatType,
    FormatOrganization,
    FormatOrganismListFiltered,
    FormatCriterionType,
    FormatMail,
    FormatPhone,
    isUserSuperAdmin,
    orderObjectByKeys
}
export default exportedFunctions