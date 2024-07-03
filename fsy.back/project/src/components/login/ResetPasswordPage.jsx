import React from "react"
import {Navigate} from "react-router-dom"
import {LoadingOverlay} from "../general/form/Loading"
import {InputField} from "../general/form/Input"
import {ButtonPrimary} from "../general/form/Button"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Constants, Session} from "fsy.common-library"
import {routes as Routing} from "../../services/RoutesHelper"
import {
    HTTP_BAD_REQUEST, HTTP_INVALID_TOKEN,
    HTTP_PASSWORD_DO_NOT_MATCH,
    HTTP_PASSWORD_TOO_WEAK, HTTP_TOKEN_EXPIRED
} from "fsy.common-library/lib/env/Constants"
import {CountDown} from "./CountDown"

import "./login.css"

export function ResetPasswordPage(pageType) {
    return <ResetPassword pageType={pageType.pageType}/>
}


class ResetPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isSubmited: false,
            isRequestDone: false,
            identifier: "",
            password: "",
            passwordConfirmation: "",
            error: {
                status: false,
                message: "",
                code: ""
            },
            notification: {
                status: false,
                message: ""
            },
            pageType: props.pageType
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this)
        this.setLoading = this.setLoading.bind(this)
    }

    componentDidMount() {
        // Evite de retourner une promesse avec utilisation de await
        (async function () {
            this.setLoading()
            const queryString = window.location.search
            const token = new URLSearchParams(queryString).get("token")

            const response = await Api.user.checkActivationToken(token)

            if (response?.error) {
                let message, user = null
                switch (response.code) {
                    case HTTP_INVALID_TOKEN:
                        message = "Token non valide. Aucun utilisateur n'a été trouvé pour ce token"
                        break
                    case HTTP_TOKEN_EXPIRED:
                        message = "Token non valide. Ce token a expiré"
                        break
                    default:
                        message = response.message
                        break
                }
                this.setState({
                    error: {
                        status: true,
                        message: message
                    },
                    notification: {
                        status: [HTTP_INVALID_TOKEN, HTTP_TOKEN_EXPIRED].includes(response.code)
                    },
                    errorMessage: message,
                    user: user
                }, () => {
                    this.setLoading(false)
                })
            } else {
                this.setState({token: token, user: response.data}, () => {
                    this.setLoading(false)
                })
            }
        }).bind(this)()
    }

    handleSubmit = async e => {
        e.preventDefault()

        if (this.state.password === "" || this.state.passwordConfirmation === "") {
            this.setState({
                error: {
                    status: true,
                    message: "Vous devez renseigner le mot de passe"
                },
                notification: {
                    status: false
                }
            })
        } else if (this.state.password !== this.state.passwordConfirmation) {
            this.setState({
                error: {
                    status: true,
                    message: "Les mots de passe ne correspondent pas"
                },
                notification: {
                    status: false
                }
            })
        } else {
            this.setLoading(true)

            this.setState({isSubmited: true})
            const user = this.state.user

            let response

            response = await Api.user.resetUserPassword(
                user.id,
                this.state.password,
                this.state.passwordConfirmation,
                this.state.token
            )

            this.setLoading(false)

            if (response.error) {
                let errorMsg

                switch (response.code) {
                    case HTTP_BAD_REQUEST:
                        errorMsg = "Le mots de passe et la confirmation de mots de passe doivent être définies"
                        break
                    case HTTP_PASSWORD_DO_NOT_MATCH:
                        errorMsg = "Les mots de passe ne correspondent pas"
                        break

                    case HTTP_PASSWORD_TOO_WEAK:
                        errorMsg = "La complexité des mots de passe est trop faible"
                        break

                    default:
                        errorMsg = response.message
                        break
                }

                this.setState({
                    error: {
                        status: true,
                        message: errorMsg
                    },
                    notification: {
                        status: false
                    }
                })

                return
            }

            let message = "Votre compte sur Simulateur Fransylva a bien été activé."
            if (this.state.pageType === "reset-password") {
                message = "Le changement de votre mot de passe sur Simulateur Fransylva a bien été pris en compte."
            }

            this.setState({
                isSubmited: false,
                notification: {
                    status: true,
                    message: message
                },
                error: {
                    status: false
                }
            })
        }
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value,
            error: {status: false},
            notification: {status: false}
        })
    }

    handlePasswordConfirmationChange(e) {
        this.setState({
            passwordConfirmation: e.target.value,
            error: {status: false},
            notification: {status: false}
        })
    }

    setLoading(status = true) {
        this.setState({loading: status})
    }

    render() {
        return <div className="login">
            {Session.isLoggedIn() && <Navigate to={Routing.app_home}/>}
            {(this.state.loading) && <LoadingOverlay/>}

            <img className="compagny-logo" src="/img/Logo-Fransylva.png" alt="Fransylva brand logo"/>
            <form onSubmit={this.handleSubmit} className="login-form">
                <h1 className="login-title">{Constants.DOCUMENT_TITLE_BACKOFFICE}</h1>
                {this.state.error.status &&
                    <p className="login-error">{this.state.error.message}</p>
                }
                {this.state.notification.status &&
                    <CountDown message={this.state.notification.message}></CountDown>
                }
                {!this.state.notification.status &&
                    <React.Fragment>
                        <p>
                            <b>Email: {this.state.user?.email}</b>
                        </p>
                        <InputField type="password" name="password" value={this.state.password}
                                    required={true}
                                    onChange={this.handlePasswordChange}>
                            Nouveau mot de passe
                        </InputField>

                        <InputField type="password" name="confirmation_password"
                                    value={this.state.passwordConfirmation}
                                    required={true}
                                    onChange={this.handlePasswordConfirmationChange}>
                            Confirmer le mot de passe
                        </InputField>

                        <ButtonPrimary type="submit" name="loginButton" className="login-button">
                            <FontAwesomeIcon icon="fas fa-right-to-bracket"/>
                            {this.state.pageType === "activate" ? " Activer mon compte" : " Réinitialisez le mot de passe"}
                        </ButtonPrimary>
                    </React.Fragment>
                }
            </form>
            <img className="site-logo" src="/img/Nextaura2.png" alt="Compagny brand logo"/>
            <div className="site-version">Version {process.env.REACT_APP_VERSION}</div>
        </div>
    }
}