import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriterionTypes(page = 1, jwt = null) {
    return await requestApi(`/criterion-type?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param criterionTypeId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriterionType(criterionTypeId, jwt = null) {
    return await requestApi(`/criterion-type/${criterionTypeId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param label {string}
 * @param shortName {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createCriterionType(label, shortName, jwt = null) {
    return await requestApi("/criterion-type", "POST", {label: label, shortName: shortName}, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criterionTypeId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateCriterionType(criterionTypeId, params, jwt = null) {
    return await requestApi(`/criterion-type/${criterionTypeId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criterionTypeId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteCriterionType(criterionTypeId, jwt = null) {
    return await requestApi(`/criterion-type/${criterionTypeId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getCriterionTypes,
    getCriterionType,
    createCriterionType,
    updateCriterionType,
    deleteCriterionType
}