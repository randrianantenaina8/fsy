import {ButtonPrimary} from "../general/Button"
import {NavLink} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export default function GameMenu() {
    return <>
        {/*Todo: redirect to rewards page*/}
        <NavLink to="/reward" title="Accéder aux récompenses">
            <ButtonPrimary type="button" name="rewardButton">
                <FontAwesomeIcon icon="fas fa-gift"/> <span>Récompenses</span>
            </ButtonPrimary>
        </NavLink>

        {/*Todo: redirect to badges page*/}
        <NavLink to="/badge" title="Accéder aux badges">
            <ButtonPrimary type="button" name="badgesButton">
                <FontAwesomeIcon icon="fas fa-medal"/> <span>Badges</span>
            </ButtonPrimary>
        </NavLink>

        {/*Todo: redirect to scoreboard page*/}
        <NavLink to="/scoreboard" title="Accéder aux classement">
            <ButtonPrimary type="button" name="scoreboardButton">
                <FontAwesomeIcon icon="fas fa-ranking-star"/> <span>Scoreboard</span>
            </ButtonPrimary>
        </NavLink>
    </>
}
