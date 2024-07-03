import React from "react"
import {ButtonPrimary} from "../general/Button"
import {NavLink} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export function UserParameters() {
    return <div className="user-parameters">
        {/*Todo: redirect to parameters page*/}
        <NavLink to="/parameters" title="Accéder aux paramètres">
            <ButtonPrimary type="button" name="parametersButton">
                <FontAwesomeIcon icon={`fas fa-gears`}/>
            </ButtonPrimary>
            <div className="user-parameterText">Paramètres</div>
        </NavLink>
    </div>

}