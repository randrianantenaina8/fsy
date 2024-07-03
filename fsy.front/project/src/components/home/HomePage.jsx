import "./home.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import i18n from "i18next"
import {Session} from "fsy.common-library"
import {NavLink} from "react-router-dom"
import {ButtonPrimary} from "../general/Button"

export default function HomePage() {
    return <>
        <div className="home-title">
            <h1><FontAwesomeIcon icon="fa-solid fa-house"/> {i18n.t("home.title")}</h1>
        </div>
        {Session.isLoggedIn()
            ? <div className="home">
                <h2>{i18n.t("home.hello")} {Session.getUser().pseudo}</h2>
                <NavLink to="/game">
                    <ButtonPrimary type="button" name="loginButton">
                        <FontAwesomeIcon icon="fas fa-right-to-bracket"/> {i18n.t("home.accessGame")}
                    </ButtonPrimary>
                </NavLink>
            </div>

            : <div className="home">
                <NavLink to="/login">
                    <ButtonPrimary type="button" name="loginButton">
                        <FontAwesomeIcon icon="fas fa-right-to-bracket"/> {i18n.t("home.signIn")}
                    </ButtonPrimary>
                </NavLink>
            </div>
        }
    </>
}
