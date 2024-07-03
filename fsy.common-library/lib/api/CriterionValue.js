import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriteriaValues(jwt = null) {
    return await requestApi(`/criteria-value`, "GET", null, jwt)
}

/**
 *
 * @param criteriaValueId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriteriaValue(criteriaValueId, jwt = null) {
    return await requestApi(`/criteria-value/${criteriaValueId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criterionId {int}
 * @param value {string}
 * @param active {boolean}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createCriteriaValue(criterionId, value, active = true, jwt = null) {
    return await requestApi("/criteria-value", "POST", {
        value: value,
        active: active,
        criterion: `/api/criteria/${criterionId}`
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criteriaValueId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateCriteriaValue(criteriaValueId, params, jwt = null) {
    return await requestApi(`/criteria-value/${criteriaValueId}`, "PUT", params, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getCriteriaValues,
    getCriteriaValue,
    createCriteriaValue,
    updateCriteriaValue
}