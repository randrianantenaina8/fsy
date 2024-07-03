import React from "react"
import GameMenu from "./GameMenu"
import {UserLevel} from "./UserLevel"
import {UserPoints} from "./UserPoints"
import {UserParameters} from "./UserParameters"
import "./gameHome.css"
import moment from "moment"
import {TimingButton} from "../general/Button"
import {UserAvatar} from "./UserAvatar"
import {NavLink} from "react-router-dom"
import {Session} from "fsy.common-library"
import {useAjax} from "../../hooks/customHooks"

export default function GameHomePage() {
    const userSession = Session.getUser()
    // eslint-disable-next-line no-unused-vars
    const [loading, user] = useAjax(`/user/${userSession.id}`)
    const {quizTimeLeft, challengeTimeLeft} = getTimeLeft(user)
    return (
        <section className="game-container">
            <div className="game-header">
                <UserLevel user={user}/>
                <div className="game-header-end">
                    <UserPoints user={user}/>
                    <UserParameters user={user}/>
                </div>
            </div>

            <div className="game-main-content">
                <div className="game-menu">
                    <GameMenu/>
                </div>

                <div className="game-user-avatar">
                    <UserAvatar user={user}/>
                </div>

                <div className="game-mode-menu">
                    {/*Todo: redirect to badges page*/}
                    <NavLink to="/quiz" title="Accéder aux quiz">
                        <TimingButton eventType="quiz" classPrefix="quiz" iconClassName="fa-clipboard-question"
                                      buttonName="quizButton" nextEventTime={quizTimeLeft}/>
                    </NavLink>
                    {/*Todo: redirect to badges page*/}
                    <NavLink to="/challenge" title="Accéder aux challenges">
                        <TimingButton eventType="challenge" classPrefix="challenge"
                                      iconClassName="fa-clipboard-question"
                                      buttonName="challengeButton" nextEventTime={challengeTimeLeft}/>
                    </NavLink>
                </div>
            </div>

        </section>
    )
}

/**
 * Calcul le temps restant à attendre avant le prochain quiz/challenge
 *
 * @param {object} user
 * @return {{quizTimeLeft: number, challengeTimeLeft: number}}
 */
function getTimeLeft(user) {
    //Todo: Récupérer ces infos depuis les paramètres de la société à laquelle est rattaché l'utilisateur
    const timeBetweenChallenge = 1440
    const timeBetweenQuiz = 1440

    let result = {quizTimeLeft: timeBetweenQuiz, challengeTimeLeft: timeBetweenChallenge}

    if (user.hasOwnProperty("lastChallenge")) {
        const lastChallenge = moment(user.lastChallenge)
        const duration = moment.duration(moment().diff(lastChallenge))
        const durationAsMinutes = (duration.asMinutes()).toFixed(2)
        let timeLeft = timeBetweenChallenge - durationAsMinutes
        result.challengeTimeLeft = (timeLeft > 0) ? timeLeft : 0
    }
    if (user.hasOwnProperty("lastQuiz")) {
        const lastQuiz = moment(user.lastQuiz)
        const duration = moment.duration(moment().diff(lastQuiz))
        const durationAsMinutes = (duration.asMinutes()).toFixed(2)
        let timeLeft = timeBetweenQuiz - durationAsMinutes
        result.quizTimeLeft = (timeLeft > 0) ? timeLeft : 0
    }

    return result
}