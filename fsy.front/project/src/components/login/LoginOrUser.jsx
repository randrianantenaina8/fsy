import React from "react"
import i18n from "i18next"
import {NavLink} from "react-router-dom"
import "./loginOrUser.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Session} from 'fsy.common-library'

export default class LoginOrUser extends React.Component {
    static defaultProps = {
        isLogged: false,
        user: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: this.props.isLogged
        }

        this.disconnect = this.disconnect.bind(this)
    }

    componentDidMount() {
        this.setState({loggedIn: this.props.isLogged})
    }

    disconnect() {
        Session.clearSessionAndRedirectToHome()
        this.setState({loggedIn: false})
    }

    render() {
        return <div className="login-button">
            {!this.state.loggedIn &&
                <NavLink to="/login" className="nav-item" title="Connexion">
                    <FontAwesomeIcon icon="fas fa-right-to-bracket"/> {i18n.t("session.login")}
                </NavLink>}

            {this.state.loggedIn &&
                <>
                    <NavLink to="/game" className="nav-item" title="Profil">
                        <FontAwesomeIcon
                            icon="fas fa-user"/> {i18n.t("session.hello", {username: this.props.user.pseudo})}
                    </NavLink>
                    <NavLink to="#" className="nav-item" title="Déconnexion"
                             onClick={this.disconnect}>
                        <FontAwesomeIcon icon="fas fa-right-from-bracket"/> {i18n.t("session.logout")}
                    </NavLink>
                </>}
        </div>
    }
}