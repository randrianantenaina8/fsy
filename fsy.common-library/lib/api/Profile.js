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
async function getProfiles(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/profile?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getProfilesCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/profile/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param profileId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getProfile(profileId, jwt = null) {
    return await requestApi(`/profile/${profileId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param trigram {string}
 * @param label {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createProfile(trigram, label, jwt = null) {
    return await requestApi("/profile", "POST", {trigram: trigram, label: label}, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param profileId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateProfile(profileId, params, jwt = null) {
    return await requestApi(`/profile/${profileId}`, "PUT", params, jwt)
}
/**
 *
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateProfiles(params, jwt = null) {
    return await requestApi(`/profile/update`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param profileId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteProfile(profileId, jwt = null) {
    return await requestApi(`/profile/${profileId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getProfiles,
    getProfilesCount,
    getProfile,
    createProfile,
    updateProfile,
    updateProfiles,
    deleteProfile
}