import requestApi from "../helpers/ApiService.js"
import _ from "lodash"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {?int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getDepartments(page = null, jwt = null) {
    return await requestApi(`/department${page !== null ? `?page=${page}` : ""}`, "GET", null, jwt)
}

/**
 *
 * @param departmentId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getDepartment(departmentId, jwt = null) {
    return await requestApi(`/department/${departmentId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param label {string}
 * @param RegionId {int}
 * @param number {?string}
 * @param active {boolean}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createDepartment(label, RegionId, number = null, active = false, jwt = null) {
    return await requestApi("/department", "POST", {
        label: label,
        number: number,
        active: active,
        region: `/api/region/${RegionId}`
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param departmentId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateDepartment(departmentId, params, jwt = null) {
    return await requestApi(`/department/${departmentId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param departmentId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteDepartment(departmentId, jwt = null) {
    return await requestApi(`/department/${departmentId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}