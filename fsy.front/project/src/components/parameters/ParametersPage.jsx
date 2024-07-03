import "./parameters.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {NavLink} from "react-router-dom"
import {ButtonPrimary} from "../general/Button"

export default function ParametersPage(){
    return  <>
                <h1>Page des Paramètres</h1>
                <NavLink to="/game" /*className="nav-item" title="Connexion" onClick={handleLoginClick}*/>
                    <ButtonPrimary type="button" name="loginButton">
                        <FontAwesomeIcon icon="fas fa-right-to-bracket"/> Retour
                    </ButtonPrimary>
                </NavLink>
            </>
}