import {useEffect, useState} from "react"
import {Api} from 'fsy.common-library'

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
            const data = typeof response.data === 'object' ? response.data : JSON.parse(response.data)//JSON.parse(response.data)
            if (response.status === 200) {
                setState({result: data, loading: false})
            } else {
                setState(prevState => ({...prevState, loading: false}))
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if (endPoint === "") {
        return [null, null]
    }

    return [state.loading, state.result]
}

export {
    useAjax, useToggle, useIncrement, useAutoIncrement
}