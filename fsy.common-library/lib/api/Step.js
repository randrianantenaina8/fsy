import requestApi from "../helpers/ApiService.js"
import _ from "lodash"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSteps(jwt = null) {
    return await requestApi(`/step`, "GET", null, jwt)
}

/**
 *
 * @param stepId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getStep(stepId, jwt = null) {
    return await requestApi(`/step/${stepId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param simulatorId {int}
 * @param name {string}
 * @param icon {string}
 * @param position {int}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createStep(simulatorId, name, icon, position = 0, jwt = null) {
    return await requestApi("/step", "POST", {
        name: name,
        icon: icon,
        position: position,
        simulator: `/api/simulator/${simulatorId}`
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param stepId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateStep(stepId, params, jwt = null) {
    return await requestApi(`/step/${stepId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param stepId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteStep(stepId, jwt = null) {
    return await requestApi(`/step/${stepId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {getSteps, getStep, createStep, updateStep, deleteStep}