import {PREFIX_LOCAL_STORAGE} from "../env/Constants.js"

const SESSION_EXPIRATION_DAYS = 30

/* ~~~~~~~~~~~~~~~~~~~~~~~~ Functions ~~~~~~~~~~~~~~~~~~~~~~~~ */

function clearSessionAndRedirectToLogin() {
    handleLogout()
    window.location.href = `${window.location.protocol}//${window.location.host}/login`
}

function clearSessionAndRedirectToHome() {
    handleLogout()
    window.location.href = `${window.location.protocol}//${window.location.host}/`
}

function handleLogin({user, jwtToken, refreshToken}) {
    setJwtToken(jwtToken)
    setRefreshToken(refreshToken)
    setCookie(PREFIX_LOCAL_STORAGE + "_session", user, SESSION_EXPIRATION_DAYS)
}

function handleLogout() {
    removeJwtToken()
    removeRefreshToken()
    expiresCookie(PREFIX_LOCAL_STORAGE + "_session")
    expiresCookie(PREFIX_LOCAL_STORAGE + "_auth")
    // expiresAllCookies(PREFIX_LOCAL_STORAGE) //Todo expire all cookies with prefix ?
}

function isLoggedIn() {
    return getJwtToken() !== null && getRefreshToken() !== null && getCookie(PREFIX_LOCAL_STORAGE + "_session") !== null
}

// Short duration JWT token (5-10 min)
function getJwtToken() {
    return localStorage.getItem(`JWT`)
}

function setJwtToken(token) {
    localStorage.setItem(`JWT`, token)
}

function setLocalStorage(name, value) {
    localStorage.setItem(`${PREFIX_LOCAL_STORAGE}_${name}`, value)
}

function getLocalStorage(name) {
    return localStorage.getItem(`${PREFIX_LOCAL_STORAGE}_${name}`)
}

function setSessionStorage(name, value) {
    sessionStorage.setItem(`${PREFIX_LOCAL_STORAGE}_${name}`, value)
}

function getSessionStorage(name) {
    return sessionStorage.getItem(`${PREFIX_LOCAL_STORAGE}_${name}`)
}

function removeJwtToken() {
    localStorage.removeItem(`JWT`)
}

// Longer duration refresh token (60-180 min)
function getRefreshToken() {
    return localStorage.getItem(`REFRESH_TOKEN`)
}

function setRefreshToken(token) {
    localStorage.setItem(`REFRESH_TOKEN`, token)
}

function removeRefreshToken() {
    localStorage.removeItem(`REFRESH_TOKEN`)
}

function getJwtAndRefreshToken() {
    return {
        jwt: getJwtToken(),
        refreshToken: getRefreshToken()
    }
}

function getUser() {
    const token = localStorage.getItem(`JWT`)
    return (token === null) ? null : JSON.parse(atob(token.split(".")[1]))
}

function getSessionUser() {
    return getCookie(PREFIX_LOCAL_STORAGE + "_session")
}

function setAuth(authArray) {
    setCookie(PREFIX_LOCAL_STORAGE + "_auth", authArray)
}

function getAuth(auth = false) {
    const authAll = getCookie(PREFIX_LOCAL_STORAGE + "_auth")
    if (authAll) {
        if (auth && typeof (auth) === "object") {
            let output = false
            for (const auth_item in auth) {
                if (Object.hasOwnProperty.call(auth, auth_item)) {
                    const auth_element = auth[auth_item]
                    output = output || authAll[auth_element] > 0
                }
            }
            return output
        } else if (auth) {
            return authAll[auth]
        } else {
            return authAll
        }
    } else {
        return false
    }
}

function clearAuth() {
    expiresCookie(PREFIX_LOCAL_STORAGE + "_auth")
}

/**
 *
 * @param name {string}
 * @return {null|string}
 */
function getCookie(name) {
    const cookies = document.cookie.split("; ")
    const value = cookies.find(c => c.startsWith(`${name}=`))?.split("=")[1]
    return (value === undefined) ? null : JSON.parse(decodeURIComponent(atob(value)))
}

/**
 *
 * @param name {string}
 * @param value {string}
 * @param expiracyDays {number}
 */
function setCookie(name, value, expiracyDays = SESSION_EXPIRATION_DAYS) {
    const date = new Date()
    date.setDate(date.getDate() + expiracyDays)
    //TODO: activate samesite and httpOnly ?
    document.cookie = `${name}=${btoa(encodeURIComponent(JSON.stringify(value)))}; expires=${date.toUTCString()};`
}

/**
 *
 * @param name {string}
 */
function expiresCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

/**
 *
 * @param searchString
 */
function expiresAllCookies(searchString) {
    const cookiesToDelete = _.filter(document.cookie.split(";"), o => o.includes(searchString))
    _.each(cookiesToDelete, (v) => {
        const name = v.split("=")[0]
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    })
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~ Export ~~~~~~~~~~~~~~~~~~~~~~~~ */

const exportedFunctions = {
    handleLogin,
    handleLogout,
    isLoggedIn,
    clearSessionAndRedirectToLogin,
    clearSessionAndRedirectToHome,
    getJwtToken,
    getRefreshToken,
    getUser,
    setJwtToken,
    setRefreshToken,
    removeJwtToken,
    removeRefreshToken,
    getJwtAndRefreshToken,
    setAuth,
    getAuth,
    clearAuth,
    setCookie,
    getCookie,
    expiresCookie,
    expiresAllCookies,
    getSessionUser,
    getLocalStorage,
    getSessionStorage,
    setLocalStorage,
    setSessionStorage
}
export default exportedFunctions
