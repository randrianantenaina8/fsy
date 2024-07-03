import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getParameters(page = 1, jwt = null) {
    return await requestApi(`/parameter?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param propKey {string}
 * @param organizationId {int|null}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getParameterByKey(propKey, organizationId = null, jwt = null) {
    return await requestApi(`/parameter/search?propKey=${propKey}&organizationId=${organizationId}`, "GET", null, jwt)
}

/**
 *
 * @param parameterId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getParameter(parameterId, jwt = null) {
    return await requestApi(`/parameter/${parameterId}`, "GET", null, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param parameterId {int}
 * @param propValue {string|null}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createParameter(parameterId, propValue = null, jwt = null) {
    return await requestApi("/parameter", "POST", {
        parameterId: parameterId,
        propValue: propValue
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param parameterId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateParameter(parameterId, params, jwt = null) {
    return await requestApi(`/parameter/${parameterId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param parameterId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteParameter(parameterId, jwt = null) {
    return await requestApi(`/parameter/${parameterId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {getParameters, getParameter, getParameterByKey, createParameter, updateParameter, deleteParameter}