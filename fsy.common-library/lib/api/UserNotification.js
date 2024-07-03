import requestApi from "../helpers/ApiService.js"
import moment from "moment"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getUserNotifications(page = 1, jwt = null) {
    return await requestApi(`/user-notification?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param userId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getNotificationOfUser(userId, jwt = null) {
    return await requestApi(`/user-notification?order[id]=desc&seen=0&user=${userId}`, "GET", null, jwt)
}

/**
 *
 * @param userNotificationId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getNotification(userNotificationId, jwt = null) {
    return await requestApi(`/user-notification/${userNotificationId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param userId {int}
 * @param content {string}
 * @param path {?string}
 * @param seen {boolean}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createUserNotification(userId, content, path = null, seen = false, jwt = null) {
    return await requestApi("/user-notification", "POST", {
        user: `/api/department/${userId}`,
        content: content,
        seen: seen,
        path: path
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param userNotificationId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateUserNotification(userNotificationId, params, jwt = null) {
    return await requestApi(`/user-notification/${userNotificationId}`, "PUT", params, jwt)
}

/**
 *
 * @param userNotificationId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function markAsReadUserNotification(userNotificationId, jwt = null) {
    return await requestApi(`/user-notification/${userNotificationId}`, "PUT", {
        seen: true,
        updatedAt: moment().format()
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param userNotificationId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteUserNotification(userNotificationId, jwt = null) {
    return await requestApi(`/user-notification/${userNotificationId}`, "DELETE", null, jwt)
}

export default {
    getUserNotifications,
    getNotification,
    getNotificationOfUser,
    createUserNotification,
    updateUserNotification,
    markAsReadUserNotification,
    deleteUserNotification
}