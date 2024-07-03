import React from "react"
import {Api, Session} from "fsy.common-library"
import Helper from "../../../services/Helper"
import {toast} from "react-toastify"
import ActiveSwitch from "../../general/form/ActiveSwitch"
import {Button, Divider} from "@mui/material"
import {InputField} from "../../general/form/Input"
import {TableSkeleton} from "../../../services/LoadingHelper"

import "./generalParameters.css"

export class GeneralParameters extends React.Component {

    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            hasError: false,
            parameters: {"front_account_creation": null},
            url: "",
            urlCopyText: "Copier"
        }
        this._handleAccountCreationChange = this._handleAccountCreationChange.bind(this)
        this._handleLinkCopy = this._handleLinkCopy.bind(this)
        this.sessionUser = Session.getSessionUser()
        this.refLink = React.createRef()
    }

    componentDidMount() {
        Promise.all([
            Api.parameter.getParameterByKey("front_account_creation", this.sessionUser.organization.id),
            Api.organization.getOrganization(this.sessionUser.organization.id)
        ]).then(([paramResponse, orgResponse]) => {
            const parameter = Helper.isValidResponse(paramResponse)
            const organization = Helper.isValidResponse(orgResponse)

            if (parameter) {
                this.setState((prevState) => {
                    let param = prevState.parameters
                    param.front_account_creation = parameter[0].propValue === "true"
                    return {parameters: param}
                })
            }
            if (organization) {
                this.setState({url: `${process.env.REACT_APP_PROJECT_FRONT_URL}?org=${organization.uuid}`})
            }

            this.setState({
                hasError: paramResponse?.status !== 200 && orgResponse?.status !== 200,
                isLoading: false
            })
        }).catch(reason => {
            console.error(reason)
            this.setState({hasError: true, isLoading: false})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.hasError) {
            toast.error("Oops ! Une erreur est survenue pendant le chargement de vos paramètres. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            this.setState({hasError: false})
        }
    }

    _handleAccountCreationChange(activeState) {
        this.setState((prevState) => {
            let param = prevState.parameters
            param.front_account_creation = activeState
            return {parameters: param, isLoading: false}
        }, () => {
            toast.success("Paramètre mis à jour", Helper.getToastOptions())
        })
    }

    _handleLinkCopy() {
        const linkToCopy = this.refLink.current
        linkToCopy.select()
        linkToCopy.setSelectionRange(0, 99999) // For mobile devices
        navigator.clipboard.writeText(linkToCopy.value)// Copy the text inside the text field
        document.getSelection().removeAllRanges()
        this.setState({urlCopyText: "✔ copié"})
        setTimeout(() => this.setState({urlCopyText: "Copier"}), 1500)
    }

    render() {
        return <article className="parameters">
            <h3>Paramètres généaux</h3>
            <section className="parameters-list card">
                {this.state.isLoading ?
                    <div className="parameters-item fullwidth"><TableSkeleton linesCount={2} size="large"/></div> :
                    <>
                        <div className="parameters-item">
                            <span>Création de compte depuis le simulateur</span>
                            <div className="parameters-switch">
                                <ActiveSwitch objectActive={this.state.parameters.front_account_creation}
                                              objectId={this.sessionUser.organization.id}
                                              apiFunction={null} onChange={this._handleAccountCreationChange}
                                              idPrefix="front-account-creation"
                                              className="parameter-active-switch"/>
                                <span>{this.state.parameters.front_account_creation ? "Activée" : "Désactivée"}</span>
                            </div>
                        </div>

                        <Divider variant="middle"/>

                        <div className="parameters-item fullwidth">
                            <span>Lien du simulateur</span>
                            <div className="parameters-url">
                                <InputField className="input-tiny input-url" name="urlFront" value={this.state.url}
                                            readOnly
                                            title="Lien du simulateur associé à votre société"
                                            forwardedRef={this.refLink}
                                            isFocused={false}/>
                                <Button aria-label="copy" title="Copier le lien" onClick={this._handleLinkCopy}
                                        color="success"
                                        size="small"
                                        variant="outlined">{this.state.urlCopyText}</Button>
                            </div>
                        </div>
                    </>}
            </section>
        </article>
    }
}