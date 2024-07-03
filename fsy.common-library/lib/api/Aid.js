import requestApi from "../helpers/ApiService.js"
import {default as Helper} from "../helpers/GenericHelper.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getAids(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/aid?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getAidCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/aid/count?${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidCountPerStatus(jwt = null) {
    return await requestApi(`/aid/count-status`, "GET", null, jwt)
}

/**
 *
 * @param aidId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAid(aidId, jwt = null) {
    return await requestApi(`/aid/${aidId}`, "GET", null, jwt)
}

/**
 *
 * @param aidId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidVersions(aidId, jwt = null) {
    return await requestApi(`/aid/${aidId}/versions`, "GET", null, jwt)
}

/**
 *
 * @param aidId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidHistory(aidId, jwt = null) {
    return await requestApi(`/aid-history?aid_id=${aidId}`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidNatures(jwt = null) {
    return await requestApi(`/aid-nature`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidComplexities(jwt = null) {
    return await requestApi(`/aid-complexity`, "GET", null, jwt)
}

/**
 * @param complexityId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidComplexity(complexityId, jwt = null) {
    return await requestApi(`/aid-complexity/${complexityId}`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidSchemes(jwt = null) {
    return await requestApi(`/aid-scheme`, "GET", null, jwt)
}

/**
 * @param schemeId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidScheme(schemeId, jwt = null) {
    return await requestApi(`/aid-scheme/${schemeId}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidEnvironments(jwt = null) {
    return await requestApi(`/aid-environment`, "GET", null, jwt)
}

/**
 * @param environmentId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidEnvironment(environmentId,jwt = null) {
    return await requestApi(`/aid-environment/${environmentId}`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidForms(jwt = null) {
    return await requestApi(`/aid-form`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidFundings(jwt = null) {
    return await requestApi(`/aid-funding`, "GET", null, jwt)
}

/**
 *
 * @param fundingId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getAidFunding(fundingId, jwt = null) {
    return await requestApi(`/aid-funding/${fundingId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param aid {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createAid(aid, jwt = null) {
    if (!aid.hasOwnProperty("name") || !aid.hasOwnProperty("label") || !aid.hasOwnProperty("nature")
        || !aid.hasOwnProperty("organization")) {
        return {
            data: null,
            status: 400,
            statusText: "request object need to have at least this properties : name, label, nature, organization"
        }
    }

    let requestObject = {
        name: aid.name,
        label: aid.label,
        organization: aid.organization ? `/api/organization/${aid.organization.id}` : null,
        nature: aid.nature ? `/api/aid-nature/${aid.nature.id}` : null
    }

    if (aid.hasOwnProperty("aidCriterions") && aid.aidCriterions) {
        requestObject.aidCriterions = aid.aidCriterions
    }

    if (aid.hasOwnProperty("complexity") && aid.complexity) {
        requestObject.complexity = `/api/aid-complexity/${aid.complexity.id}`
    }

    if (aid.hasOwnProperty("scheme") && aid.complexity) {
        requestObject.scheme = `/api/aid-scheme/${aid.scheme.id}`
    }

    if (aid.hasOwnProperty("environment") && aid.complexity) {
        requestObject.scheme = `/api/aid-environment/${aid.environment.id}`
    }

    if (aid.hasOwnProperty("form") && aid.form) {
        requestObject.form = `/api/aid-form/${aid.form.id}`
    }

    if (aid.hasOwnProperty("funding") && aid.funding) {
        requestObject.funding = `/api/aid-funding/${aid.funding.id}`
    }

    if (aid.hasOwnProperty("aidFundingValues") && aid.aidFundingValues) {
        requestObject.aidFundingValues = aid.aidFundingValues
    }

    if (aid.hasOwnProperty("parent") && aid.parent) {
        requestObject.parent = `/api/aid/${aid.parent.id}`
    }

    if (aid.hasOwnProperty("openDate")) {
        requestObject.openDate = aid.openDate
    }
    if (aid.hasOwnProperty("depositDate")) {
        requestObject.depositDate = aid.depositDate
    }
    if (aid.hasOwnProperty("leadtime")) {
        requestObject.leadtime = aid.leadtime
    }
    if (aid.hasOwnProperty("minimumRate")) {
        requestObject.minimumRate = aid.minimumRate
    }
    if (aid.hasOwnProperty("maximumRate")) {
        requestObject.maximumRate = aid.maximumRate
    }
    if (aid.hasOwnProperty("minimumAmountPerPlant")) {
        requestObject.minimumAmountPerPlant = aid.minimumAmountPerPlant
    }
    if (aid.hasOwnProperty("maximumAmountPerPlant")) {
        requestObject.maximumAmountPerPlant = aid.maximumAmountPerPlant
    }
    if (aid.hasOwnProperty("description")) {
        requestObject.description = aid.description
    }
    if (aid.hasOwnProperty("contactName")) {
        requestObject.contactName = aid.contactName
    }
    if (aid.hasOwnProperty("contactEmail")) {
        requestObject.contactEmail = aid.contactEmail
    }
    if (aid.hasOwnProperty("documentUrl")) {
        requestObject.documentUrl = aid.documentUrl
    }
    if (aid.hasOwnProperty("originUrl")) {
        requestObject.originUrl = aid.originUrl
    }
    if (aid.hasOwnProperty("requestUrl")) {
        requestObject.requestUrl = aid.requestUrl
    }
    if (aid.hasOwnProperty("status")) {
        requestObject.status = aid.status
    }
    if (aid.hasOwnProperty("active")) {
        requestObject.active = aid.active
    }
    if (aid.hasOwnProperty("contractDuration")) {
        requestObject.contractDuration = aid.contractDuration
    }
    if (aid.hasOwnProperty("taxCreditPercent")) {
        requestObject.taxCreditPercent = aid.taxCreditPercent
    }

    if (aid.hasOwnProperty("minimumAmountPerHectare")) {
        requestObject.minimumAmountPerHectare = aid.minimumAmountPerHectare
    }

    if (aid.hasOwnProperty("maximumAmountPerHectare")) {
        requestObject.maximumAmountPerHectare = aid.maximumAmountPerHectare
    }

    return await requestApi("/aid", "POST", requestObject, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param aidId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateAid(aidId, params, jwt = null) {
    if (params.nature) {
        params.nature = `/api/aid-nature/${params.nature.id}`
    }
    if (params.complexity) {
        params.complexity = `/api/aid-complexity/${params.complexity.id}`
    }
    if (params.scheme) {
        params.scheme = `/api/aid-scheme/${params.scheme.id}`
    }
    if (params.environment) {
        params.environment = `/api/aid-environment/${params.environment.id}`
    }
    if (params.organization) {
        params.organization = `/api/organization/${params.organization.id}`
    }
    if (params.form) {
        params.form = `/api/aid-form/${params.form.id}`
    }
    if (params.funding) {
        params.funding = `/api/aid-funding/${params.funding.id}`
    }
    if (params.parent) {
        params.parent = `/api/aid/${params.parent.id}`
    }
    return await requestApi(`/aid/${aidId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param aidId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteAid(aidId, jwt = null) {
    return await requestApi(`/aid/${aidId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getAids,
    getAid,
    getAidVersions,
    getAidHistory,
    getAidCount,
    getAidCountPerStatus,
    getAidNatures,
    getAidComplexities,
    getAidComplexity,
    getAidSchemes,
    getAidScheme,
    getAidEnvironments,
    getAidEnvironment,
    getAidForms,
    getAidFundings,
    getAidFunding,
    createAid,
    updateAid,
    deleteAid
}
