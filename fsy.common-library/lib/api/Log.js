import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param filters {string}
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getLogs(filters, page = 1, jwt = null) {
    return await requestApi(`/logs?page=${page}&${filters}`, "GET", null, jwt)
}

/**
 *
 * @param logId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getLog(logId, jwt = null) {
    return await requestApi(`/log/${logId}`, "GET", null, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {getLogs, getLog}