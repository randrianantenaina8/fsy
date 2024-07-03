import axios from "axios"
import SessionHelper from "./SessionHelper.js"

/**
 *
 * @param endPoint {string}
 * @param method {string}
 * @param data {object}
 * @param jwt {object|null}
 * @return {Promise<any>}
 */
async function requestApi(endPoint, method = "GET", data = {}, jwt = null) {
    const url = process.env.REACT_APP_PROJECT_API_URL + endPoint
        , jsonData = JSON.stringify(data)
    let jwtToken = jwt?.jwt ?? SessionHelper.getJwtToken()
        , refreshToken = jwt?.refreshToken ?? SessionHelper.getRefreshToken()

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    // Check JWT expiration date and refresh it if necessary
    if (isJWTExpired(jwtToken)) {
        const result = await axios.post(process.env.REACT_APP_PROJECT_API_URL + "/user/refresh", {refreshToken: refreshToken}, config)
        console.log(`[INFO] Refreshing api token : `, result.data)
        jwtToken = result.data.token
        SessionHelper.setJwtToken(jwtToken, jwt?.prefix) //todo: get prefix here ?
    }

    try {
        if (jwtToken !== null) { // if is authenticated
            config.headers.Authorization = "Bearer " + jwtToken
        }

        //console.log(`[INFO] Sending ${method} request on url : ${url}`)

        let res = {data: null, status: 500, statusText: "error"}
        if (method === "POST") {
            res = await axios.post(url, jsonData, config)
        } else if (method === "PUT") {
            res = await axios.put(url, jsonData, config)
        } else if (method === "GET") {
            res = await axios.get(url, config)
        } else if (method === "DELETE") {
            res = await axios.delete(url, config)
        } else if (method === "BLOB") {
            config.responseType = "blob"
            res = await axios.get(url, config)
        }
        return res
    } catch (error) {
        if (error === "Error: Request failed with status code 401") {
            SessionHelper.clearSessionAndRedirectToLogin()
        } else if (error.hasOwnProperty("response")) {
            if (error.response && error.response.hasOwnProperty("data")) {
                return error.response.data
            }
            return error
        }
        return error
    }
}


const isJWTExpired = (token) => {
    try {
        const jwt = JSON.parse(atob(token.split(".")[1]))
        return (new Date()).getTime() > jwt.exp * 1000
    } catch (e) {
        return false
    }
}

export default requestApi
