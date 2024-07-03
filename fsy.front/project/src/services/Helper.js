import {Constants} from 'fsy.common-library'


// Use to add a 'capitalize' method to a string object, but :
// String prototype is read only, properties should not be added  no-extend-native
// Object.defineProperty(String.prototype, "capitalize", {
//     value: function () {
//         return this.charAt(0).toUpperCase() + this.slice(1)
//     },
//     enumerable: false
// })

/**
 *
 * @param length {number}
 * @return {string}
 */
function generateUUID(length = 5) {
    const uuid = crypto.randomUUID()
    return uuid.slice(uuid.length - 5)
}

async function getLocalTranslations(langage = "FR") {
    return await Promise.all([
        fetch(`locales/${Constants.TRANSLATIONS_FILES.FR}`),
        fetch(`locales/${Constants.TRANSLATIONS_FILES.EN}`)
    ]).then(responses => {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(response => response.json()))
    }).then(data => {
        return {
            FR: data[0],
            EN: data[1]
        }
    }).catch(error => {
        console.log(error)
        return {
            FR: {},
            EN: {}
        }
    })
}

const exportedFunctions = {
    generateUUID,
    getLocalTranslations
}
export default exportedFunctions