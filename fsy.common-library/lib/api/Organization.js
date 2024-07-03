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
async function getOrganizations(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/organization?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getOrganizationsCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/organization/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param organizationId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getOrganization(organizationId, jwt = null) {
    return await requestApi(`/organization/${organizationId}`, "GET", null, jwt)
}

/**
 *
 * @param uuid {string}
 * @return {Promise<*>}
 */
async function getOrganizationByUuid(uuid) {
    return await requestApi(`/organization/uuid?uuid=${uuid}`, "GET")
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param name {string}
 * @param isOrganism {boolean}
 * @param isPartner {boolean}
 * @param isOther {boolean}
 * @param jwt {object|null}
 * @param contactName {?string}
 * @param contactEmail {?string}
 * @param contactPhone {?string}
 * @param address {?string}
 * @param address2 {?string}
 * @param postalCode {?string}
 * @param city {?string}
 * @return {Promise<*>}
 */
async function createOrganization(
    name,
    isOrganism,
    isPartner,
    isOther,
    contactName = null,
    contactEmail = null,
    contactPhone = null,
    address = null,
    address2 = null,
    postalCode = null,
    city = null,
    jwt = null
) {
    return await requestApi("/organization", "POST", {
        name: name,
        organism: isOrganism,
        partner: isPartner,
        other: isOther,
        contactName: contactName,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        address: address,
        address2: address2,
        postalCode: postalCode,
        city: city
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param organizationId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateOrganization(organizationId, params, jwt = null) {
    return await requestApi(`/organization/${organizationId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param organizationId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteOrganization(organizationId, jwt = null) {
    return await requestApi(`/organization/${organizationId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getOrganizations,
    getOrganizationsCount,
    getOrganization,
    getOrganizationByUuid,
    createOrganization,
    updateOrganization,
    deleteOrganization
}