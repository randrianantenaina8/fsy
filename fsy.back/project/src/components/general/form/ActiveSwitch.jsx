import React, {useEffect, useState} from "react"
import ReactSwitch from "react-switch"
import {toast} from "react-toastify"
import Helper from "../../../services/Helper"

/**
 * Return a switch component that update the question active state (question object passed in props)
 *
 * @param props {object}
 * @return {JSX.Element}
 */
export default function ActiveSwitch(props) {
    const [active, setActive] = useState(props.objectActive)
    const property = props.property ?? "active"

    const onColor = props.onColor ?? "#a6d290"
    const offColor = props.offColor ?? "#fc9999"
    // const uncheckedIcon =  ?? null
    // const checkedIcon =  ?? null

    useEffect(() => {
        setActive(props.objectActive)
    }, [props])

    const handleChange = activeState => {
        setActive(activeState)
        if (props.onChange !== undefined) {
            props.onChange(activeState)
        }
    }

    if (props.apiFunction === undefined) {
        return <ReactSwitch
            checked={active ?? false}
            className={props.className}
            id={`${props.idPrefix}-${props.objectId}`}
            onColor={onColor}
            offColor={offColor}
            uncheckedIcon={props.uncheckedIcon}
            checkedIcon={props.checkedIcon}
            onChange={handleChange}
            disabled={props.disabled}/>
    }

    const handleActiveSwitchChange = activeState => {
        if (typeof props.apiFunction == "function") {
            props.apiFunction(props.objectId, {[property]: activeState}).then((response) => {
                setActive(activeState)
                if (response?.status === 200) {
                    toast.success("Etat mis à jour", Helper.getToastOptions(1000))
                } else {
                    setActive(false)
                    if (response["hydra:description"]) {
                        toast.error(response["hydra:description"], Helper.getToastOptions())
                    } else {
                        toast.error("Un problème est survenu lors de la mise à jour de l'état", Helper.getToastOptions(1000))
                    }
                }
            })
        } else {
            props.onChange(activeState)
        }
    }
    return <ReactSwitch
        onChange={handleActiveSwitchChange}
        checked={active ?? false}
        className={props.className}
        id={`${props.idPrefix}-${props.objectId}`}
        onColor={onColor}
        offColor={offColor}
        uncheckedIcon={props.uncheckedIcon}
        checkedIcon={props.checkedIcon}
        disabled={props.disabled}
    />
}
