import requestApi from "../helpers/ApiService.js"
import _ from "lodash"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getRegions(page = 1, jwt = null) {
    return await requestApi(`/region?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param regionId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getRegion(regionId, jwt = null) {
    return await requestApi(`/region/${regionId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param label {string}
 * @param number {?string}
 * @param active {boolean}
 * @param custom {boolean}
 * @param departmentsArray {array}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createRegion(label, number = null, active = false, custom = true, departmentsArray = [], jwt = null) {
    const departments = _.map(departmentsArray, (d) => {
        if(d?.id !== undefined) {
            return `/api/department/${d.id}`
        }
        return {label: d?.label, number: d?.number, active: d?.active, custom: d?.custom}
    })
    return await requestApi("/region", "POST", {
        label: label,
        number: number,
        active: active,
        custom: custom,
        departments: departments
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param regionId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateRegion(regionId, params, jwt = null) {
    return await requestApi(`/region/${regionId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param regionId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteRegion(regionId, jwt = null) {
    return await requestApi(`/region/${regionId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getRegions,
    getRegion,
    createRegion,
    updateRegion,
    deleteRegion
}