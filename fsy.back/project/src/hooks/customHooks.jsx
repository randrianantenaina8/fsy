import {useEffect, useState} from "react"
import {Api} from "fsy.common-library"
import moment from "moment-timezone"

/* ********************************* HOOKS ********************************* */

/**
 * custom Hook pour centraliser la logique du code
 * @param startValue {number}
 * @param step {number}
 * @return {(number|increment)[]}
 */
function useIncrement(startValue = 0, step = 1) {
    const [count, setCount] = useState(startValue)

    const increment = () => {
        setCount(c => c + step)
    }
    return [count, increment]
}

/**
 * custom Hook pour afficher une date/heure
 * @param updateInterval
 */
function useDate(updateInterval = 1000) {
    moment.locale('fr')
    const currentDate = moment()
    const [date, setDate] = useState(currentDate)

    // Equivalent du ComponentDidMount
    useEffect(() => {
        const timer = window.setInterval(() => {
            setDate(moment())
        }, updateInterval)

        // Fonction de retour utilisée lors du démontage du composant
        return function () {
            clearInterval(timer)
        }
    })

    return [date, setDate]
}

/**
 * custom Hook pour centraliser la logique du code
 * @param initial {number}
 * @param step {number}
 * @param timeout {number}
 * @return {(number|increment)[]}
 */
function useAutoIncrement(initial = 0, step = 1, timeout = 1000) {
    const [count, increment] = useIncrement(initial, step)

    // Equivalent du ComponentDidMount
    useEffect(() => {
        const timer = window.setInterval(() => {
            increment()
        }, timeout)

        // Fonction de retour utilisée lors du démontage du composant
        return function () {
            clearInterval(timer)
        }
    })

    return [count, increment]
}

/**
 *
 * @param initial {boolean}
 * @return {(boolean|toggle)[]}
 */
function useToggle(initial = false) {
    const [state, toggleState] = useState(initial)

    const toggle = () => {
        toggleState(prevState => !prevState)
    }
    return [state, toggle]
}

/**
 *
 * @param endPoint
 * @param method
 * @param postData
 * @return {(boolean|[])[]}
 */
function useAjax(endPoint, method = "GET", postData = {}) {
    const [state, setState] = useState({
        result: {}, loading: true
    })
    useEffect(() => {
        // Evite de retourner une promesse avec l'utilisatation de await
        (async function () {
            const response = await Api.requestApi(endPoint, method, postData)
            const data = JSON.parse(response.data)
            if (response.status === 200) {
                setState({result: data, loading: false})
            } else {
                setState(prevState => ({...prevState, loading: false}))
            }
        })()
    }, [endPoint, method,postData])

    return [state.loading, state.result]
}

export {
    useAjax, useToggle, useIncrement, useAutoIncrement, useDate
}