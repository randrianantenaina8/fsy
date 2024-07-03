import React from "react"
import "./login.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Navigate} from "react-router-dom"
import {ButtonPrimary} from "../general/Button"
import {Api, Constants, Session} from "fsy.common-library"
import {Loading} from "../general/Loading"
import i18n from "i18next"
import {InputField} from "../general/Input"

export default class Login extends React.Component {
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
    }

    async handleSubmit(e) {
        e.preventDefault()
        if (this.state.identifier === "" || this.state.password === "") {
            this.setState({
                error: {
                    status: true,
                    message: "loginForm.indetifierAndPasswordRequired"
                },
                notification: {
                    status: false
                }
            })
        } else {
            this.setState({isSubmited: true})

            const response = await Api.user.authenticateUser(this.state.identifier, this.state.password)

            if (response.status === 200) {
                const data = response.data
                const user = {
                    id: data.id,
                    email: data.email,
                    pseudo: data.pseudo,
                    name: data.name,
                    surname: data.surname
                }
                Session.handleLogin({user: user, jwtToken: data.token, refreshToken: data.refreshToken})
                this.setState({
                    isRequestDone: true,
                    isSubmited: false
                })
            } else {
                console.log("une erreur est survenue")
                let message = ""
                if (response.code === Constants.HTTP_USER_NOT_FOUND) {
                    message = "loginForm.identifier.userNotFound"
                } else if (response.code === Constants.HTTP_INVALID_PASSWORD) {
                    message = "loginForm.password.invalid"
                } else if (response.code === Constants.HTTP_INVALID_TOKEN) {
                    message = "loginForm.invalidToken"
                } else if (response.code === Constants.HTTP_TOKEN_EXPIRED) {
                    message = "loginForm.tokenExpired"
                } else {
                    message = response.message
                }
                this.setState({
                    isRequestDone: false,
                    isSubmited: false,
                    error: {
                        status: true,
                        message: message
                    },
                    notification: {
                        status: false
                    }
                })
            }
        }
    }

    async handleForgottenPassword(e) {
        e.preventDefault()
        if (this.state.identifier === "") {
            this.setState({
                error: {
                    status: true,
                    message: "loginForm.identifier.required"
                },
                notification: {
                    status: false
                }
            })
        } else {
            this.setState({isSubmited: true})

            const response = await Api.user.checkUserIdentifier(this.state.identifier)

            if (response.status === 200) {
                const data = response.data
                console.log("id : " + data.id)

                const forgotResponse = await Api.user.userPasswordForgotten(data.id)

                if (forgotResponse.status === 200) {
                    this.setState({
                        isRequestDone: true,
                        isSubmited: false,
                        notification: {
                            status: true,
                            message: "loginForm.password.emailResetPasswordSent"
                        },
                        error: {
                            status: false
                        }
                    })
                } else {
                    this.setState({
                        isRequestDone: false,
                        isSubmited: false,
                        error: {
                            status: true,
                            message: "error"
                        },
                        notification: {
                            status: false
                        }
                    })
                }
            } else {
                console.log("une erreur est survenue")
                let message = ""
                if (response.status === Constants.HTTP_USER_NOT_FOUND) {
                    message = "loginForm.identifier.userNotFound"
                    this.setState({
                        isRequestDone: false,
                        isSubmited: false,
                        error: {
                            status: true,
                            message: message
                        },
                        notification: {
                            status: false
                        }
                    })
                } else {
                    this.setState({
                        isRequestDone: false,
                        isSubmited: false,
                        error: {
                            status: true,
                            message: "error"
                        },
                        notification: {
                            status: false
                        }
                    })
                }
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

    render() {
        return (
            <>
                {Session.isLoggedIn()
                    ? <Navigate to="/game"/>
                    : (this.state.isSubmited && !this.state.isRequestDone)
                        ? <Loading/>
                        : <form onSubmit={this.handleSubmit} className="login-form">
                            <h1 className="login-title">{i18n.t("loginForm.singIn")}</h1>
                            {this.state.error.status &&
                                <p className="login-error">{i18n.t(this.state.error.message)}</p>
                            }
                            {this.state.notification.status &&
                                <p className="login-notification">{i18n.t(this.state.notification.message)}</p>
                            }
                            <InputField type="text" name="identifier" value={this.state.identifier} required={true}
                                        onChange={this.handleIdentifierChange}>
                                {/*placeHolder="Email ou pseudo"*/}
                                Email ou pseudo
                            </InputField>
                            <InputField type="password" name="password" value={this.state.password} required={true}
                                        onChange={this.handlePasswordChange}>
                                {/*placeHolder="Mot de passe"*/}
                                Mot de passe
                            </InputField>

                            <ButtonPrimary type="submit" name="loginButton" className="login-button">
                                <FontAwesomeIcon icon="fas fa-right-to-bracket"/> {i18n.t("session.login")}
                            </ButtonPrimary>
                            <a href="/login" className="login-forgotten-password"
                               onClick={this.handleForgottenPassword}> {i18n.t("loginForm.password.forgotten")} </a>
                        </form>
                }
            </>
        )
    }
}