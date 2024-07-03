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
async function getQuestions(page = 1, urlParams = {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/question?page=${page}${urlString}`, "GET", null, jwt)
}

/**
 * @param jwt {object|null}
 * @param urlParams {object}
 * @return {Promise<*>}
 */
async function getQuestionCount(urlParams= {}, jwt = null) {
    let urlString = Helper.getStringParamsFromObject(urlParams)
    return await requestApi(`/question/count?${urlString}`, "GET", null, jwt)
}

/**
 *
 * @param questionId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function getQuestion(questionId, jwt = null) {
    return await requestApi(`/question/${questionId}`, "GET", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ POST ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param question {string}
 * @param answerExplanatoryText {?string}
 * @param featuredImage {?string}
 * @param active {boolean}
 * @param title {string}
 * @param categoryId {int}
 * @param questionTypeId {int}
 * @param languageId {int}
 * @param levelId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function createQuestion(question, title, categoryId, questionTypeId, languageId, levelId, answerExplanatoryText = null, active = false, featuredImage = null, jwt = null) {
    return await requestApi("/question", "POST", {
        question: question,
        answerExplanatoryText: answerExplanatoryText,
        title: title,
        featuredImage: featuredImage,
        active: active,
        category: `/api/category/${categoryId}`,
        questionType: `/api/question_type/${questionTypeId}`,
        language: `/api/language/${languageId}`,
        level: `/api/level/${levelId}`
    }, jwt)
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PUT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param questionId {int}
 * @param params {object}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function updateQuestion(questionId, params, jwt = null) {
    return await requestApi(`/question/${questionId}`, "PUT", params, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 *
 * @param questionId {int}
 * @param jwt {object|null}
 * @return {Promise<*>}
 */
async function deleteQuestion(questionId, jwt = null) {
    return await requestApi(`/question/${questionId}`, "DELETE", null, jwt)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EXPORT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

export default {getQuestion, getQuestions, createQuestion, updateQuestion, deleteQuestion, getQuestionCount}