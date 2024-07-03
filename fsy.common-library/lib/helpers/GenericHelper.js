/**
 *
 * @param urlParams
 * @return {string}
 */
function getStringParamsFromObject(urlParams) {
    let urlString = ""
    for (const [key, value] of Object.entries(urlParams)) {
        urlString += `&${key}=${value}`
    }
    return urlString
}


const exportedFunctions = {
    getStringParamsFromObject
}

export default exportedFunctions