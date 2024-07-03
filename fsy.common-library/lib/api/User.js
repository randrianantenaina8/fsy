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
async function getUsers(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/user?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getUserCount(urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/user/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param userId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getUser(userId, jwt = null) {
    return await requestApi(`/user/${userId}`, "GET", null, jwt)
}

/**
 *
 * @param userId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function userPasswordForgotten(userId, jwt = null) {
    return await requestApi(`/user/${userId}/password-forgotten`, "GET", null, jwt)
}

/**
 *
 * @param userId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function activateUser(userId, jwt = null) {
    return await requestApi(`/user/${userId}/activate`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/**
 *
 * @param name {string}
 * @param surname {string}
 * @param email {string}
 * @param organization {int}
 * @param profile {string}
 * @param status {boolean}
 * @param roles {array}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createUser(name, surname, email, organization, profile, status, roles, jwt = null) {
    return await requestApi("/user", "POST", {
        name: name,
        surname: surname,
        email: email,
        organization: `/api/organization/${organization}`,
        profile: `/api/profile/${profile}`,
        status: status,
        roles: roles
    }, jwt)
}

/**
 *
 * @param token {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function checkActivationToken(token, jwt = null) {
    return await requestApi("/user/password-token", "POST", {token: token})
}

/**
 *
 * @param identifier {string}
 * @param password {string}
 * @return {Promise<*>}
 */
async function authenticateUser(identifier, password) {
    return await requestApi("/user/login", "POST", {identifier: identifier, password: password})
}

/**
 *
 * @param identifier {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function checkUserIdentifier(identifier, jwt = null) {
    return await requestApi("/user/identifier", "POST", {identifier: identifier}, jwt)
}

/**
 *
 * @param userId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getUserAccess(userId, jwt = null) {
    return await requestApi(`/user/${userId}/authorization`, "POST", {"id": userId}, jwt)
}

/**
 *
 * @param jwt {object}
 * @return {Promise<*>}
 */
async function getUserByJwt(jwt) {
    return await requestApi("/user/token", "POST", {token: jwt})
}

/**
 *
 * @param refreshToken {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function refreshUser(refreshToken, jwt = null) {
    return await requestApi("/user/refresh", "POST", {refreshToken: refreshToken}, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param userId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateUser(userId, params, jwt = null) {
    return await requestApi(`/user/${userId}`, "PUT", params, jwt)
}

/**
 *
 * @param userId {int}
 * @param currentPassword {string}
 * @param newPassword {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function changeUserPassword(userId, currentPassword, newPassword, jwt = null) {
    return await requestApi(`/user/${userId}/change-password`, "PUT", {
        currentPassword: currentPassword,
        newPassword: newPassword
    }, jwt)
}

/**
 *
 * @param userId {int}
 * @param password {string}
 * @param passwordConfirmation {string}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function resetUserPassword(userId, password, passwordConfirmation, jwt = null) {
    return await requestApi(`/user/${userId}/reset-password`, "PUT", {
        newPassword: password,
        passwordConfirmation: passwordConfirmation
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


export default {
    getUsers,
    getUser,
    getUserCount,
    userPasswordForgotten,
    activateUser,
    createUser,
    checkActivationToken,
    authenticateUser,
    checkUserIdentifier,
    updateUser,
    changeUserPassword,
    resetUserPassword,
    getUserAccess,
    getUserByJwt
}