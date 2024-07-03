import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api} from "fsy.common-library"
import {InputField, RequiredText} from "../general/form/Input"
import Helper from "../../services/Helper"
import {Loading} from "../general/form/Loading"

export class ProfileForm extends React.Component {
    static defaultProps = {
        type: "create",
        profile: null,
        onSubmit: () => {
            console.log("submited")
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            selectedTypeOption: null,
            profile: this.createEmptyProfileObject()
        }

        this.handleChangeText = this.handleChangeText.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.checkForm = this.checkForm.bind(this)
    }

    createEmptyProfileObject() {
        return {
            id: 0,
            trigram: "",
            label: ""
        }
    }

    componentDidMount() {
        if (this.props.type === "edit" && this.props.profile) {
            const profile = [this.props.profile]
            const profile_obj = profile.map(({users, ...rest}) => rest)
            this.setState({
                profile: profile_obj[0]
            })
        }
    }

    handleChangeText(field, e) {
        this.setState({
            profile: {
                ...this.state.profile,
                [field]: e.target.value
            }
        })
        this.props.modalModify(true)
    }

    checkForm() {
        return this.state.profile.trigram.match(/^[A-Z]{3}$/) && this.state.profile.label !== ""
    }

    handleFormSubmit(e) {
        e.preventDefault()
        if (!this.checkForm()) {
            this.props.onSubmit(false, "Les deux champs sont obligatoires, le libellé court doit comporter 3 lettres majuscules exactement")
            return
        }
        this.setState({loading: true})
        if (this.props.type === "create") {
            Api.profile.createProfile(
                this.state.profile.trigram,
                this.state.profile.label
            ).then((r) => {
                if (r?.status !== 201) {
                    if (r.hasOwnProperty("hydra:description") && r["hydra:description"].indexOf("Integrity constraint violation") > 0) {
                        this.props.onSubmit(false, `Ce libellé court a déjà été utilisé`)
                    } else {
                        this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création du profil : ${r.message}`)
                    }
                    this.setState({loading: false})
                    return
                }

                const result = Helper.isValidResponse(r)
                if (result) {
                    this.props.onSubmit(true, "Profil créé ✔")
                }

            }).finally(() => {
                this.setState({loading: false})
            })
        } else if (this.props.type === "edit") {
            Api.profile.updateProfile(
                this.state.profile.id,
                this.state.profile
            ).then((r) => {
                // console.log('result', r)
                if (r?.status !== 200) {
                    if (r.hasOwnProperty("hydra:description") && r["hydra:description"].indexOf("Integrity constraint violation") > 0) {
                        this.props.onSubmit(false, `Ce libellé court a déjà été utilisé`)
                    } else {
                        this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création du profil : ${r.message}`)
                    }
                    this.setState({loading: false})
                    return
                }

                const result = Helper.isValidResponse(r)
                if (result) {
                    this.props.onSubmit(true, "Profil modifié ✔")
                }

            })
        }
    }

    render() {
        return <>
            {this.state.loading && <Loading/>}
            <form id="profile-form" onSubmit={this.handleFormSubmit} className="user-form">
                <div>
                    <InputField className="input-tiny" name="profileContactName"
                                isFocused={this.state.profile?.trigram !== ""}
                                value={this.state.profile.trigram}
                                onChange={e => this.handleChangeText("trigram", e)}
                                title="Libellé court" context={this} required={true}>
                        Libellé court (3 lettres majuscules)
                    </InputField>
                    <InputField className="input-tiny" name="profileName"
                                isFocused={this.state.profile?.label !== ""}
                                value={this.state.profile.label}
                                onChange={e => this.handleChangeText("label", e)}
                                title="Libellé long" context={this} required={true}>
                        Libellé long
                    </InputField>
                </div>
                <div className="user-form-footer flex-sb">
                    <button className="btn default btn-lg"
                            type="submit"
                            title="Enregistrer les données saisies"
                            ref={this.props.forwardRef}>
                        <FontAwesomeIcon icon="fas fa-save"/> Enregistrer
                    </button>
                    <RequiredText/>
                </div>
            </form>
        </>
    }
}

/* ================================== GLOBAL FUNCTIONS ================================== */
