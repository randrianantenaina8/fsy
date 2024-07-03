import {Constants, Api, Session, Roles} from "./../../index.js"

export function displayConstants() {
    displayHttpCodes()
    displayRoles()
    displayOthers()
}

function displayHttpCodes() {
    displayTable({
        "OK": Constants.HTTP_OK,
        "CRATED": Constants.HTTP_CREATED,
        "NO_CONTENT": Constants.HTTP_NO_CONTENT,
        "FOUND": Constants.HTTP_FOUND,
        "BAD_REQUEST": Constants.HTTP_BAD_REQUEST,
        "UNAUTHORIZED": Constants.HTTP_UNAUTHORIZED,
        "FORBIDDEN": Constants.HTTP_FORBIDDEN,
        "NOT_FOUND": Constants.HTTP_NOT_FOUND,
        "TIMEOUT": Constants.HTTP_TIMEOUT,
        "USER_NOT_FOUND": Constants.HTTP_USER_NOT_FOUND,
        "INVALID_PASSWORD": Constants.HTTP_INVALID_PASSWORD,
        "INVALID_TOKEN": Constants.HTTP_INVALID_TOKEN,
        "TOKEN_EXPIRED": Constants.HTTP_TOKEN_EXPIRED,
        "PASSWORD_DO_NOT_MATCH": Constants.HTTP_PASSWORD_DO_NOT_MATCH,
        "PASSWORD_TOO_WEAK": Constants.HTTP_PASSWORD_TOO_WEAK,
        "INTERNAL_ERROR": Constants.HTTP_INTERNAL_ERROR
    }, "CODE", "TYPE")
}

function displayTable(array, keyName = "Key", valueName = "Value") {
    keyName = (keyName + " ".repeat(25)).slice(0, 25)
    valueName = (valueName + " ".repeat(25)).slice(0, 25)
    const separator = "|-------------------------|-------------------------|"
    console.log(separator)
    console.log(`| ${keyName} | ${valueName} |`)
    console.log(separator)
    for (let [key, value] of Object.entries(array)) {
        key = (key + " ".repeat(25)).slice(0, 25)
        value = (JSON.stringify(value) + " ".repeat(25)).slice(0, 25)
        console.log(`| ${key.slice(0, 25)} | ${value.slice(0, 25)} |`)
    }
    console.log(separator)
}

function displayRoles() {
    displayTable({
        "ROLE_SUPER_ADMIN": Constants.ROLE_SUPER_ADMIN,
        "ROLE_ADMIN": Constants.ROLE_ADMIN,
        "ROLE_USER": Constants.ROLE_USER,
        "ROLE_API": Constants.ROLE_API
    }, "ROLE")
}

function displayOthers() {
    displayTable({
        "DOCUMENT_TITLE_FRONTOFFICE": Constants.DOCUMENT_TITLE_FRONTOFFICE,
        "DOCUMENT_TITLE_BACKOFFICE": Constants.DOCUMENT_TITLE_BACKOFFICE,
        "PREFIX_LOCAL_STORAGE": Constants.PREFIX_LOCAL_STORAGE,
        "TRANSLATIONS_FILES": Constants.TRANSLATIONS_FILES,
        "QUESTION_MCQ": Constants.QUESTION_MCQ,
        "QUESTION_TRUEFALSE": Constants.QUESTION_TRUEFALSE,
        "QUESTION_GAPSTEXT": Constants.QUESTION_FREETEXT,
        "QUESTION_FORMBUILDER": Constants.QUESTION_FORMBUILDER
    })
}

export function testSession(user, jwt, refreshToken) {
    if (typeof (sessionStorage) !== "undefined") {
        console.log("--> Initializing session ...")
        Session.handleLogin({user, jwt, refreshToken})

        console.log("--> Login result : ", Session.isLoggedIn())
        console.log("--> Session User : ", Session.getUser())
        console.log("--> Session JWT : ", Session.getJwtToken())
        console.log("--> Session refresh token : ", Session.getRefreshToken())

        console.log("--> Closing session ...")
        Session.clearSessionAndRedirectToHome()
    } else {
        console.error("[Warning] Session storage is not available")
    }
}

export function testAids() {
    (async () => {
        console.log("--> Get all Aids")
        const aids = await Api.aid.getAids()

        console.log("|--------|---------------------------|")
        console.log("|   ID   |           NAME            |")
        console.log("|--------|---------------------------|")
        for (const aid in aids) {
            const name = aid.name + " ".repeat(50)
            console.log(`|  ${aid.id}   | ${name.slice(0, 50)} |`)
        }
        console.log("|--------|---------------------------|")

        console.log("--> Create an aid")
        const test = await Api.aid.createAid("Test aid", [1, 2], 1)
        console.log(test)

        console.log("--> get an aid")
        const testSociety = await Api.aid.getAid(1)
        console.log(testSociety)

        console.log("--> Update an aid")
        const testSocietyUpdated = await Api.aid.updateAid(1, {name: "Test aid updated"})
        console.log(testSocietyUpdated)

    })()
}

export function testUsers() {

    //TODO: code here

}

export function testRoles() {
    console.log("--> Is ROLE_PLAYER granted with ROLE_PLAYER ? ", Roles.isGranted(Constants.ROLE_USER))
    console.log("--> Is ROLE_SUPER_ADMIN granted with ROLE_PLAYER ? ", Roles.isGranted(Constants.ROLE_SUPER_ADMIN))
    console.log("--> Is ROLE_PLAYER granted with ROLE_ADMIN ? ", Roles.isGranted(Constants.ROLE_USER, Constants.ROLE_ADMIN))
    console.log("--> Is ROLE_SUPER_ADMIN granted with ROLE_ADMIN ? ", Roles.isGranted(Constants.ROLE_SUPER_ADMIN, Constants.ROLE_ADMIN))
}