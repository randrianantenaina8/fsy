import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {?int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriteriontThemes(page = null, jwt = null) {
    return await requestApi(`/criteria-theme${page !== null ? `?page=${page}` : ""}`, "GET", null, jwt)
}

/**
 *
 * @param criteriontThemeId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getCriteriontTheme(criteriontThemeId, jwt = null) {
    return await requestApi(`/criteria-theme/${criteriontThemeId}`, "GET", null, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {
    getCriteriontThemes,
    getCriteriontTheme
}