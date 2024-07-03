import requestApi from "../helpers/ApiService.js"

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param page {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getQuestionDependencies(page = 1, jwt = null) {
    return await requestApi(`/question-dependency?page=${page}`, "GET", null, jwt)
}

/**
 *
 * @param questionId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getDependenciesOfQuestion(questionId, jwt = null) {
    return await requestApi(`/question-dependency?question=${questionId}`, "GET", null, jwt)
}

/**
 *
 * @param questionDependencyId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getQuestionDependency(questionDependencyId, jwt = null) {
    return await requestApi(`/question-dependency/${questionDependencyId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param originQuestionId {int}
 * @param targetQuestionId {int}
 * @param type {string}
 * @param value {string}
 * @param valueMin {int|null}
 * @param valueMax {int|null}
 * @param jwt {?object}
 * @return {Promise<*>}
 */
async function createQuestionDependency(originQuestionId, targetQuestionId, type, value, valueMin = null, valueMax = null, jwt = null) {
    return await requestApi("/question-dependency", "POST", {
        origin: `/api/question/${originQuestionId}`,
        target: `/api/question/${targetQuestionId}`,
        type: type,
        value: value,
        valueMin: valueMin,
        valueMax: valueMax
    }, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param questionDependencyId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateQuestionDependency(questionDependencyId, params, jwt = null) {
    return await requestApi(`/question-dependency/${questionDependencyId}`, "PUT", params, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param questionDependencyId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteQuestionDependency(questionDependencyId, jwt = null) {
    return await requestApi(`/question-dependency/${questionDependencyId}`, "DELETE", null, jwt)
}

export default {
    getQuestionDependency,
    getQuestionDependencies,
    getDependenciesOfQuestion,
    createQuestionDependency,
    updateQuestionDependency,
    deleteQuestionDependency
}