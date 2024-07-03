import requestApi from "../helpers/ApiService.js"
import {default as Helper} from "../helpers/GenericHelper.js"
import _ from "lodash"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getCriterion(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/criteria?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getCriterionCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/criteria/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param criteriaId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriteria(criteriaId, jwt = null) {
    return await requestApi(`/criteria/${criteriaId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param name {string}
 * @param shortName {string}
 * @param criteriaTypeId {int}
 * @param values {array}
 * @param mandatory {boolean}
 * @param active {boolean}
 * @param valueMin {?float}
 * @param ValueMax {?float}
 * @param unit {?string}
 * @param step {?float}
 * @param isMulti {boolean}
 * @param specific {boolean}
 * @param position {int}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createCriteria(
    name,
    shortName,
    criteriaTypeId,
    values= [],
    mandatory = false,
    active = true,
    valueMin = null,
    ValueMax = null,
    unit = null,
    step = 1,
    isMulti = false,
    specific = false,
    position = 0,
    jwt = null
) {
    const criterionValues = _.map(values, (v) => {
        return {value: v}
    })

    return await requestApi("/criteria", "POST", {
        name: name,
        shortName: shortName,
        mandatory: mandatory,
        active: active,
        valueMin: valueMin,
        ValueMax: ValueMax,
        unit: unit,
        step: step,
        isMulti: isMulti,
        specific: specific,
        position: position,
        type: `/api/criterion-type/${criteriaTypeId}`,
        criterionValues: criterionValues
    }, jwt)
}

/**
 *
 * @param id {int}
 * @param name {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function checkCriteriaName(id, name, jwt = null) {
    return await requestApi("/criteria/check", "POST", {id: id, name: name}, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criteriaId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateCriteria(criteriaId, params, jwt = null) {
    return await requestApi(`/criteria/${criteriaId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param criteriaId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteCriteria(criteriaId, jwt = null) {
    return await requestApi(`/criteria/${criteriaId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getCriterion,
    getCriterionCount,
    getCriteria,
    createCriteria,
    updateCriteria,
    deleteCriteria,
    checkCriteriaName
}