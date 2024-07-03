import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Constants} from "fsy.common-library"
import {SelectField} from "../general/form/Select"
import {InputField, RequiredText} from "../general/form/Input"
import Helper from "../../services/Helper"
import {Loading} from "../general/form/Loading"
import ReactSwitch from "react-switch"
import {toast} from "react-toastify"
import {trim} from "lodash"

export class UserForm extends React.Component {
    static defaultProps = {
        type: "create",
        user: null,
        onSubmit: () => {
            console.log('submitted')
        }
    }

    constructor(props) {
        super(props)

        this.typeOrganism = [
            Constants.ORGANISM_TYPE_FSY,
            Constants.ORGANISM_TYPE_ORGANISM,
            Constants.ORGANISM_TYPE_PARTNER,
            Constants.ORGANISM_TYPE_OTHER
        ]

        this.state = {
            loading: true,
            typeOrganismSelected: null,
            organismList: [],
            organismListFiltered: [{label: "Organisme", options: []}],
            profileList: [],
            validationLabel: "",
            activeLabel: "",
            originalEmail: "",
            user: this.createEmptyUserObject(),
            listsLoaded: 0
        }

        this.handleUserchange = this.handleUserchange.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.checkForm = this.checkForm.bind(this)

        this.nameField = React.createRef()
        this.surnameField = React.createRef()
        this.emailField = React.createRef()
    }

    createEmptyUserObject() {
        return {
            id: null,
            email: "",
            name: "",
            surname: "",
            organization: null,
            profile: null,
            status: true,
            active: false
        }
    }

    componentDidMount() {
        this.setValidationLabel(true)
        this.setActiveLabel(false)
        this.loadCurrentUser()
    }

    async loadCurrentUser() {
        await Api.profile.getProfiles()
            .then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const profileList = [{
                        label: "Profils", options: resultObject.map(element => {
                            return {label: element.label, value: element.id}
                        })
                    }]
                    this.setState({
                        profileList: profileList,
                        user: {
                            ...this.state.user,
                            profile: profileList[0].options[0]
                        }
                    })
                }
            })
        await Api.organization.getOrganizations()
            .then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    this.setState(
                        {
                            organismList: resultObject
                        },
                        () => {
                            this._updateOrganismList()
                        }
                    )
                }
            })

        if (this.props.type === 'edit' && this.props.user) {
            this.setState({
                originalEmail: this.props.user.email,
                user: {
                    ...this.props.user,
                    profile: {label: this.props.user.profile.label, value: this.props.user.profile.id},
                }
            })

            this.setState({
                activeLabel: this.props.user.active ? "Actif" : "Inactif"
            })
        }
        this.setState({loading:false})
    }

    _handleChangeProfile = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                profile: e
            }
        })
        this.props.modalModify(true)
    }

    _handleChangeStatus = statusState => {
        if (this.props.user && this.props.user.status && !statusState) {
            toast.error("Vous ne pouvez pas invalider un utilisateur", Helper.getToastOptions())
        } else {
            this.setValidationLabel(statusState)
        }
        this.props.modalModify(true)
    }

    setValidationLabel = statusState => {
        this.setState({
            user: {
                ...this.state.user,
                status: statusState
            },
            validationLabel: statusState ? "Validé" : "A valider"
        })
    }

    _handleChangeActive = activeState => {
        if (!this.state.user.status && activeState) {
            toast.error("Vous ne pouvez pas activer un utilisateur non validé", Helper.getToastOptions())
        } else {
            this.setActiveLabel(activeState)
        }
        this.props.modalModify(true)
    }

    setActiveLabel = activeState => {
        this.setState({
            user: {
                ...this.state.user,
                active: activeState
            },
            activeLabel: activeState ? "Actif" : "Inactif"
        })
    }

    handleUserchange(property, e) {
        this.setState((prevState) => {
            let orga = prevState.user
            orga[property] = e.target.value
            return {user: orga}
        })
    }

    _updateOrganismList = () => {
        this.setState({
            organismListFiltered: Helper.FormatOrganismListFiltered(
                this.typeOrganism,
                this.state.organismList
            ),
        })

        // in case of edit
        if (this.props.type === "edit" && this.props.user) {
            const organization = this.props.user.organization
            this.setState({
                user: {
                    ...this.state.user,
                    organization: {label: organization.name, value: organization.id}
                }
            })
        }
    }

    _handleChangeOrganism = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                organization: e
            }
        })
        this.props.modalModify(true)
    }

    checkForm() {
        let valid = true

        // required fields
        const requiredfields = ["name", "surname", "email"]
        for (const id in requiredfields) {
            if (trim(this.state.user[requiredfields[id]]) === "") {
                this[requiredfields[id] + "Field"].current.className = "form-block is-invalid"
                valid &&= false
            } else {
                this[requiredfields[id] + "Field"].current.className = "form-block is-valid"
                valid &&= true
            }
        }

        // email field
        if (!this.state.user.email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)) {
            this.emailField.current.className = "form-block is-invalid"
            valid &&= false
        } else {
            this.emailField.current.className = "form-block is-valid"
            valid &&= true
        }
        return valid
    }

    handleChangeText(field, e) {
        this.setState({
            user: {
                ...this.state.user,
                [field]: e.target.value
            }
        })
        this.props.modalModify(true)
    }

    handleFormSubmit(e) {
        e.preventDefault()
        this.setState({loading: true})
        if (this.checkForm()) {
            if (this.props.type === "create") {
                Api.user.createUser(
                    this.state.user.name,
                    this.state.user.surname,
                    this.state.user.email,
                    this.state.user.organization.value,
                    this.state.user.profile.value,
                    this.state.user.status,
                    [Constants.ROLE_ADMIN]
                ).then((r) => {
                    if (r?.status !== 201) {
                        if (r.hasOwnProperty("hydra:description") && r["hydra:description"].indexOf("Integrity constraint violation") > 0) {
                            this.props.onSubmit(false, `Cette adresse e-mail a déjà été utilisée`)
                        } else {
                            this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création de l'utilisateur : ${r.message}`)
                        }
                        this.setState({loading: false})
                        return
                    }

                    const result = Helper.isValidResponse(r)
                    if (result) {
                        this.setState({loading: false})
                        this.props.onSubmit(true, "Utilisateur créé ✔")
                    }

                })
            } else if (this.props.type === "edit") {
                const userToUpdate = {
                    ...this.state.user,
                    organization: this.state.user.organization.value,
                    profile: this.state.user.profile.value,
                }

                Api.user.updateUser(
                    this.state.user.id,
                    userToUpdate
                ).then((r) => {
                    if (r?.status !== 200) {
                        this.setState({loading: false})
                        this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création de l'utilisateur : ${r.message}`)
                        return
                    }

                    const result = Helper.isValidResponse(r)
                    if (result) {
                        this.props.onSubmit(true, "Utilisateur modifié ✔")
                    }

                })
            }
        } else {
            this.props.onSubmit(false, "Erreurs sur l'ajout/modification")
            this.setState({loading: false})
        }
    }

    render() {
        return <>
            {this.state.loading && <Loading/>}
            <form onSubmit={this.handleFormSubmit} noValidate>
                <div className="user-form-content">
                    <div className="user-form-part">
                        <div className="form-block" ref={this.nameField}>
                            <InputField className="input-tiny" name="surname"
                                        onChange={e => this.handleChangeText("surname", e)}
                                        value={this.state.user.surname} context={this} required
                                        isFocused={this.state.user.surname !== ""}
                                        readOnly={this.props.readOnly}>
                                Nom
                            </InputField>
                            <div className="error">Champ obligatoire</div>
                        </div>

                        <div className="form-block" ref={this.surnameField}>
                            <InputField className="input-tiny" name="name"
                                         onChange={e => this.handleChangeText("name", e)}
                                        value={this.state.user.name} context={this} required
                                        isFocused={this.state.user.name !== ""}
                                        readOnly={this.props.readOnly}>
                                Prénom
                            </InputField>
                            <div className="error">Champ obligatoire</div>
                        </div>

                        <div className="form-block" ref={this.emailField}>
                            <InputField className="input-tiny" type="email" name="email"
                                        onChange={e => this.handleChangeText("email", e)}
                                        value={this.state.user.email} context={this} required
                                        isFocused={this.state.user.email !== ""}
                                        readOnly={this.props.readOnly}>
                                Email
                            </InputField>
                            <div className="error">Email invalide</div>
                        </div>
                    </div>
                    <div className="user-form-part">
                        <div className="form-block">
                            <SelectField
                                options={this.state.organismListFiltered}
                                value={this.state.user.organization}
                                isMulti={false}
                                closeMenuOnSelect={true}
                                placeholder="Organisme"
                                onChange={this._handleChangeOrganism}
                                context={this}
                                required={true}
                                isDisabled={this.props.readOnly}
                            />
                        </div>
                        <div className="form-block">
                            <SelectField
                                options={this.state.profileList}
                                value={this.state.user.profile}
                                isMulti={false}
                                closeMenuOnSelect={true}
                                placeholder="Profil"
                                onChange={this._handleChangeProfile}
                                context={this}
                                required={true}
                                isDisabled={this.props.readOnly}
                            />
                        </div>
                        <div className="form-block">
                            <div className="col-validation">
                                <span>Statut : </span>
                                <ReactSwitch
                                    checked={this.state.user.status ?? false}
                                    onColor="#a6d290"
                                    offColor="#fc9999"
                                    onChange={this._handleChangeStatus}
                                    disabled={this.props.readOnly}/>&emsp;
                                <span>{this.state.validationLabel}</span>
                            </div>
                        </div>
                        {this.props.type === 'edit' &&
                            <div className="form-block">
                                <div className="col-validation">
                                    <span>Etat : </span>
                                    <ReactSwitch
                                        checked={this.state.user.active ?? false}
                                        onColor="#a6d290"
                                        offColor="#fc9999"
                                        onChange={this._handleChangeActive}
                                        disabled={this.props.readOnly}/>&emsp;
                                    <span>{this.state.activeLabel}</span>
                                </div>
                            </div>
                        }
                    </div>
                    {!this.props.readOnly &&
                        <div className="user-form-footer">
                            <button className="btn default btn-lg"
                                    type="submit"
                                    title="Enregistrer les données saisies"
                                    ref={this.props.forwardRef}>
                                <FontAwesomeIcon icon="fas fa-save"/> Enregistrer
                            </button>
                            <RequiredText/>
                        </div>
                    }
                </div>
            </form>
        </>
    }
}

/* ================================== GLOBAL FUNCTIONS ================================== */
