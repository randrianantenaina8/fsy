import React from "react"
import {Navigate} from "react-router-dom"
import {LoadingOverlay} from "../general/form/Loading"
import {InputField} from "../general/form/Input"
// import {ButtonPrimary} from "../general/form/Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Constants, Session} from "fsy.common-library"
import {routes as Routing} from "../../services/RoutesHelper"
import Helper from "../../services/Helper"

import "./login.css"

export function LoginPage() {
    return <Login/>
}

export function LogoutPage() {
    Session.handleLogout()
    return <Navigate to={Routing.app_login}/>
}

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isSubmited: false,
            isRequestDone: false,
            identifier: "",
            password: "",
            error: {
                status: false,
                message: ""
            },
            notification: {
                status: false,
                message: ""
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleForgottenPassword = this.handleForgottenPassword.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleIdentifierChange = this.handleIdentifierChange.bind(this)
        Session.handleLogout() // totally clear session
    }

    async handleSubmit(e) {
        e.preventDefault()
        if (this.state.identifier === "" || this.state.password === "") {
            this.setState({
                error: {
                    status: true,
                    message: "Vous devez renseigner l'identifiant et le mot de passe"
                },
                notification: {
                    status: false
                }
            })
        } else {
            this.setState({isSubmited: true})

            const response = await Api.user.authenticateUser(this.state.identifier, this.state.password)

            if (response?.status !== 200) {
                let message = "Une erreur est survenue. Merci de rééssayer ultérieurement"
                if (response?.status === Constants.HTTP_USER_NOT_FOUND) {
                    message = "Cet utilisateur n'existe pas"
                } else if (response?.status === Constants.HTTP_INVALID_PASSWORD) {
                    message = "Le mot de passe est incorrect"
                } else if (response?.status === Constants.HTTP_INVALID_TOKEN) {
                    message = response.message ?? "Le token est incorrect"
                } else if (response?.status === Constants.HTTP_TOKEN_EXPIRED) {
                    message = "Le token a expiré"
                }
                this.setState(this.getGenericError(message))
            } else {
                const data = response.data

                const user = {
                    id: data.id,
                    email: data.email,
                    name: data.name,
                    surname: data.surname,
                    organization: data.organization,
                    profile: data.profile,
                    roles: data.roles
                }

                Session.handleLogin({user: user, jwtToken: data.token, refreshToken: data.refreshToken})
                const userSession = Session.getSessionUser();
                Api.user.getUserAccess(userSession.id)
                    .then(response => {
                        const resultObject = Helper.isValidResponse(response)
                        Session.setAuth(resultObject)

                        this.setState({
                            isRequestDone: true,
                            isSubmited: false
                        })
                    })
            }
        }
    }

    getGenericError(message = "Oups ! Une erreur est survenue") {
        return {
            isRequestDone: false,
            isSubmited: false,
            error: {
                status: true,
                message: message
            },
            notification: {
                status: false
            }
        }
    }

    handleIdentifierChange(e) {
        this.setState({
            identifier: e.target.value,
            error: {status: false},
            notification: {status: false}
        })
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value,
            error: {status: false},
            notification: {status: false}
        })
    }

    async handleForgottenPassword(e) {
        e.preventDefault()
        if (this.state.identifier === "") {
            this.setState({
                error: {
                    status: true,
                    message: "Vous devez renseigner l'adresse email"
                },
                notification: {
                    status: false
                }
            })
        } else {
            this.setState({isSubmited: true})
            const response = await Api.user.checkUserIdentifier(this.state.identifier)
            if (response.status !== 200) {
                if (response.code === Constants.HTTP_USER_NOT_FOUND) {
                    this.setState({
                        isRequestDone: false,
                        isSubmited: false,
                        error: {
                            status: true,
                            message: "L'utilisateur n'existe pas"
                        },
                        notification: {
                            status: false
                        }
                    })
                } else {
                    this.setState(this.getGenericError())
                }
            } else {
                const data = response.data
                const forgotResponse = await Api.user.userPasswordForgotten(data.id)

                if (forgotResponse.status !== 200) {
                    this.setState(this.getGenericError())
                }

                this.setState({
                    isRequestDone: true,
                    isSubmited: false,
                    notification: {
                        status: true,
                        message: "Un email contenant un lien de réinitialisation vous a été envoyé"
                    },
                    error: {
                        status: false
                    }
                })
            }
        }
    }

    render() {
        return <div className="login">
            {Session.isLoggedIn() && <Navigate to={Routing.app_home}/>}
            {(this.state.isSubmited && !this.state.isRequestDone) && <LoadingOverlay/>}

            <img className="compagny-logo" src="/img/Logo-Fransylva-small.png" alt="Fransylva brand logo"/>
            <form onSubmit={this.handleSubmit} className="login-form">
                <h1 className="login-title">{Constants.DOCUMENT_TITLE_BACKOFFICE}</h1>
                {this.state.error.status &&
                    <p className="login-error">{this.state.error.message}</p>
                }
                {this.state.notification.status &&
                    <p className="login-notification">{this.state.notification.message}</p>
                }
                <InputField name="identifier" value={this.state.identifier} required={true}
                            onChange={this.handleIdentifierChange}>
                    Email
                </InputField>
                <InputField type="password" name="password" value={this.state.password} required={true}
                            onChange={this.handlePasswordChange}>
                    Mot de passe
                </InputField>


                <button type="submit" name="loginButton" className="login-button btn btn-lg">
                    <FontAwesomeIcon icon="fas fa-right-to-bracket"/> Connexion
                </button>
                <a href={Routing.app_login} className="login-forgotten-password" onClick={this.handleForgottenPassword}>
                    Mot de passe oublié ?
                </a>
            </form>
            <img className="site-logo" src="/img/Nextaura2.png" alt="Development compagny brand logo" title="Application développée par la société Nextaura®"/>
            <div className="site-version">Version {process.env.REACT_APP_VERSION}</div>
        </div>
    }
}