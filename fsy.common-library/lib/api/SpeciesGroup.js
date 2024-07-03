import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSpeciesGroups(page = 1, jwt = null) {
    return await requestApi(`/species-group?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param groupId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getSpeciesGroup(groupId, jwt = null) {
    return await requestApi(`/species-group/${groupId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {getSpeciesGroups, getSpeciesGroup}
