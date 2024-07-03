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
async function getSimulators(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/simulator?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getSimulatorsCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/simulator/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param simulatorId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSimulator(simulatorId, jwt = null) {
    return await requestApi(`/simulator/${simulatorId}`, "GET", null, jwt)
}

/**
 *
 * @param simulatorId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSimulatorDetails(simulatorId, jwt = null) {
    return await requestApi(`/simulator/${simulatorId}/details`, "GET", null, jwt)
}

/**
 *
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getPublishedSimulator(jwt = null) {
    return await requestApi(`/simulator/live`, "GET",null, jwt)
}

/**
 * @param simulatorId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSimulatorSteps(simulatorId, jwt = null) {
    return await requestApi(`/step?simulator=${simulatorId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param parent {object}
 * @param published {boolean}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createSimulator(parent = null, published = true, jwt = null) {
    return await requestApi("/simulator", "POST", {
        parent: parent,
        published: published,
        versionNumber: parent !== null ? parseInt(parent?.versionNumber) + 1 : 1
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param simulatorId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateSimulator(simulatorId, params, jwt = null) {
    return await requestApi(`/simulator/${simulatorId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param simulatorId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteSimulator(simulatorId, jwt = null) {
    return await requestApi(`/simulator/${simulatorId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getSimulators,
    getSimulatorsCount,
    getPublishedSimulator,
    getSimulator,
    getSimulatorDetails,
    createSimulator,
    updateSimulator,
    deleteSimulator,
    getSimulatorSteps
}