import React from "react"
import i18n from "i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Constants} from "fsy.common-library"
import "./activationPage.css"
import {InputField} from "../general/Input"
import {ButtonPrimary} from "../general/Button"
import {Loading} from "../general/Loading"

export default function ActivationPage() {
    return <>
        <section className="activate">
            <div className="activate-title">
                <h1><FontAwesomeIcon icon="fa-solid fa-key"/> {i18n.t("activate.title")}</h1>
            </div>
            <ActivationForm/>
        </section>
    </>
}


export class ActivationForm extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            token: null,
            user: null,
            password: "",
            passwordConfirm: "",
            passwordLength: false,
            passwordNumber: false,
            passwordLowerCase: false,
            passwordUppercase: false,
            passwordSpecialChar: false,
            passwordsMatchs: false,
            passwordValidity: false,
            loading: false,
            error: false,
            errorMessage: null,
            feedbackMessage: null
        }
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.checkPasswordLength = this.checkPasswordLength.bind(this)
        this.checkPasswordNumber = this.checkPasswordNumber.bind(this)
        this.checkPasswordLowerCase = this.checkPasswordLowerCase.bind(this)
        this.checkPasswordUppercase = this.checkPasswordUppercase.bind(this)
        this.checkPasswordSpecialChar = this.checkPasswordSpecialChar.bind(this)
        this.checkPasswordsMatchs = this.checkPasswordsMatchs.bind(this)
        this.checkPasswordValidity = this.checkPasswordValidity.bind(this)
        this.handleActivateClick = this.handleActivateClick.bind(this)
    }

    handlePasswordChange(e) {
        const newPassword = e.target.value

        this.setState({
            password: newPassword
        }, () => {
            this.setState({
                passwordLength: this.checkPasswordLength(),
                passwordNumber: this.checkPasswordNumber(),
                passwordLowerCase: this.checkPasswordLowerCase(),
                passwordUppercase: this.checkPasswordUppercase(),
                passwordSpecialChar: this.checkPasswordSpecialChar(),
                passwordsMatchs: this.checkPasswordsMatchs()
            }, () => {
                this.setState({
                    passwordValidity: this.checkPasswordValidity()
                })
            })
        })
    }

    handlePasswordConfirmChange(e) {
        this.setState({
            passwordConfirm: e.target.value
        }, () => {
            this.setState({
                passwordLength: this.checkPasswordLength(),
                passwordNumber: this.checkPasswordNumber(),
                passwordLowerCase: this.checkPasswordLowerCase(),
                passwordUppercase: this.checkPasswordUppercase(),
                passwordSpecialChar: this.checkPasswordSpecialChar(),
                passwordsMatchs: this.checkPasswordsMatchs()
            }, () => {
                this.setState({
                    passwordValidity: this.checkPasswordValidity()
                })
            })
        })
    }

    handleFormSubmit() {
        (async function () {
            this.setLoading()

            // With library
            const response = await Api.user.resetUserPassword(this.state.user.id, this.state.password, this.state.passwordConfirm)

            let message = i18n.t("activate.feedbacks.confirmation"), success = true
            if (response.status !== Constants.HTTP_OK) {
                success = false
                switch (response.code) {
                    case Constants.HTTP_PASSWORD_DO_NOT_MATCH:
                        message = i18n.t("activate.feedbacks.passwordDoNotMatch")
                        break
                    case Constants.HTTP_PASSWORD_TOO_WEAK:
                        message = i18n.t("activate.feedbacks.passwordWeak")
                        break
                    default:
                        message = i18n.t("error")
                        break
                }
            }
            this.displayFeedbackMessage(message, success)

        }).bind(this)()
    }

    handleActivateClick() {
        (async function () {
            this.setLoading()

            const response = await Api.user.activateUser(this.state.user.id)

            let message = "", success = true
            if (response.status === Constants.HTTP_OK) {
                message = i18n.t("activate.feedbacks.activationMail")
            } else {
                message = i18n.t("error")
                success = false
            }

            this.displayFeedbackMessage(message, success)
        }).bind(this)()
    }

    checkPasswordLength() {
        return this.state.password.length >= 8
    }

    checkPasswordNumber() {
        return (new RegExp(/[1-9]/)).test(this.state.password)
    }

    checkPasswordLowerCase() {
        return (new RegExp(/[a-z]/)).test(this.state.password)
    }

    checkPasswordUppercase() {
        return (new RegExp(/[A-Z]/)).test(this.state.password)
    }

    checkPasswordSpecialChar() {
        return (new RegExp(/[-_#@$%*!?&]/)).test(this.state.password)
    }

    checkPasswordsMatchs() {
        return this.state.password === this.state.passwordConfirm && this.state.password !== "" && this.state.passwordConfirm !== ""
    }

    checkPasswordValidity() {
        return this.state.passwordLength && this.state.passwordNumber && this.state.passwordLowerCase && this.state.passwordUppercase && this.state.passwordSpecialChar && this.state.passwordsMatchs
    }

    setLoading(isLoading = true) {
        this.setState({loading: isLoading})
    }

    displayFeedbackMessage(message, success) {
        this.setState({
            feedbackMessage: message,
            feedbackState: success
        }, () => {
            this.setLoading(false)
            setTimeout(() => {
                this.setState({feedbackMessage: null})
            }, 2500)
        })
    }

    componentDidMount() {
        // Evite de retourner une promesse avec l'utilisatation de await
        (async function () {
            this.setLoading()
            const queryString = window.location.search
            const token = new URLSearchParams(queryString).get("token")

            const response = await Api.user.checkActivationToken(token)

            if (response?.error) {
                let message = "", user = null
                switch (response.code) {
                    case Constants.HTTP_INVALID_TOKEN:
                        message = i18n.t("activate.feedbacks.invalidToken")
                        break
                    case Constants.HTTP_TOKEN_EXPIRED:
                        message = i18n.t("activate.feedbacks.tokenExpired")
                        user = response.data.user
                        break
                    default:
                        message = i18n.t("error")
                        break
                }
                this.setState({error: true, errorMessage: message, user: user}, () => {
                    this.setLoading(false)
                })
            } else {
                this.setState({token: token, user: response.data}, () => {
                    this.setLoading(false)
                })
            }
        }).bind(this)()
    }

    render() {
        return <>
            <div className="activate-description">
                {this.state.user && <span>{i18n.t("activate.description", {mail: this.state.user?.email})}</span>}
            </div>
            <div className="activate-card">
                {this.state.loading && <Loading/>}

                {this.state.error && <div className="activate-error">
                    <div>{this.state.errorMessage}</div>
                    {this.state.user && <div>
                        <ButtonPrimary type="button" name="activateButton" title={i18n.t("activate.activate")}
                                       className="activateButton" onClick={this.handleActivateClick}>
                            <FontAwesomeIcon icon="fas fa-unlock"/> <span>{i18n.t("activate.activate")}</span>
                        </ButtonPrimary>
                    </div>}
                </div>
                }

                {(this.state.user && !this.state.error) && <>
                    <div className="activate-form">
                        <InputField type="password" name="password" value={this.state.password}
                                    title={i18n.t("activate.password.create")} context={this}
                                    onChange={this.handlePasswordChange}>
                            {i18n.t("activate.password.create")}
                        </InputField>
                        <InputField type="password" name="passwordConfirm" value={this.state.passwordConfirm}
                                    title={i18n.t("activate.password.confirm")} context={this}
                                    onChange={this.handlePasswordConfirmChange}>
                            {i18n.t("activate.password.confirm")}
                        </InputField>

                        <ButtonPrimary type="button" name="submitButton" title={i18n.t("activate.activate")}
                                       className="submitButton"
                                       onClick={this.handleFormSubmit} disabled={!this.state.passwordValidity}>
                            <FontAwesomeIcon icon="fas fa-unlock"/> <span>{i18n.t("activate.activate")}</span>
                        </ButtonPrimary>
                    </div>
                    <div className="activate-security">
                        <div>{i18n.t("activate.password.security.label")}</div>
                        <div className="activate-security-requirements">
                        <span className={this.state.passwordLength ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.length")}
                        </span>
                            <span className={this.state.passwordLowerCase ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.lowercase")}
                        </span>
                            <span className={this.state.passwordUppercase ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.uppercase")}
                        </span>
                            <span className={this.state.passwordNumber ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.number")}
                        </span>
                            <span className={this.state.passwordSpecialChar ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.specialchar")}
                        </span>
                            <span className={this.state.passwordsMatchs ? "valid" : "not-valid"}>
                            <FontAwesomeIcon icon="fas fa-circle"/> {i18n.t("activate.password.security.match")}
                        </span>
                        </div>
                    </div>
                </>}
            </div>

            {(this.state.feedbackMessage != null) && <div className="activate-feedback">
                <span className={this.state.feedbackState ? "success" : "error"}>{this.state.feedbackMessage}</span>
            </div>}
        </>
    }
}