import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Constants} from "fsy.common-library"
import {SelectField} from "../general/form/Select"
import {InputField, RequiredText} from "../general/form/Input"
import _ from "lodash"
import Helper from "../../services/Helper"
import {Loading} from "../general/form/Loading"

import "./organizationForm.css"

export class OrganizationForm extends React.Component {
    static defaultProps = {
        type: "create",
        organization: null,
        onSubmit : ()=>{console.log('submited')}
    }

    constructor(props) {
        super(props)

        this.state = {
            loading: this.props.type !== "create",
            selectedTypeOption: null,
            organization: this.createEmptyOrganizationObject()
        }

        this.typeOptions = [{
            label: "type", icon: "fa-list-check", options: [
                {value: Constants.ORGANISM_TYPE_PARTNER, label: Constants.ORGANISM_TYPE_PARTNER},
                {value: Constants.ORGANISM_TYPE_ORGANISM, label: Constants.ORGANISM_TYPE_ORGANISM},
                {value: Constants.ORGANISM_TYPE_FSY, label: Constants.ORGANISM_TYPE_FSY},
                {value: Constants.ORGANISM_TYPE_OTHER, label: Constants.ORGANISM_TYPE_OTHER}
            ]
        }]

        this.handleOrganizationchange = this.handleOrganizationchange.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.checkForm = this.checkForm.bind(this)
    }

    createEmptyOrganizationObject() {
        return {
            id: null,
            name: "",
            organism: false,
            other: false,
            partner: false,
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
            address2: "",
            postalCode: "",
            city: ""
        }
    }

    componentDidMount() {
        if (this.props.organization !== null) {
            let currentOrganization = null
            Api.organization.getOrganization(this.props.organization.id).then((r)=>{
                if (r?.status !== 200) {
                    Helper.displayApiToastResult(r)
                }
                currentOrganization = Helper.isValidResponse(r)

                let type = Constants.ORGANISM_TYPE_FSY
                if (this.props.organization.organism) {
                    type = Constants.ORGANISM_TYPE_ORGANISM
                }
                if (this.props.organization.partner) {
                    type = Constants.ORGANISM_TYPE_PARTNER
                }
                if (this.props.organization.other) {
                    type = Constants.ORGANISM_TYPE_OTHER
                }

                this.setState({
                    selectedTypeOption: _.find(this.typeOptions[0].options, {"value": type}),
                    organization: currentOrganization,
                    loading: false
                })
            })
        }
    }

    handleTypeChange(selectedOption) {
        this.setState((prevState) => {
            let orga = prevState.organization
            orga.organism = selectedOption?.value === Constants.ORGANISM_TYPE_ORGANISM
            orga.partner = selectedOption?.value === Constants.ORGANISM_TYPE_PARTNER
            orga.other = selectedOption?.value === Constants.ORGANISM_TYPE_OTHER
            return {selectedTypeOption: selectedOption, organization: orga}
        })
        this.props.modalModify(true)
    }

    handleOrganizationchange(property, e) {
        this.setState((prevState) => {
            let orga = prevState.organization
            orga[property] = e.target.value
            return {organization: orga}
        })
        this.props.modalModify(true)
    }

    checkForm() {
        return this.state.organization.name !== "" && this.state.selectedTypeOption !== null
    }

    handleFormSubmit(e) {
        e.preventDefault()
        if (!this.checkForm()) {
            this.props.onSubmit(false, "Champs obligatoires à renseigner : Nom et Type d'organisme")
            return
        }
        this.setState({loading: true})
        if (this.props.type === "create") {
            Api.organization.createOrganization(
                this.state.organization.name,
                this.state.organization.organism,
                this.state.organization.partner,
                this.state.organization.other,
                this.state.organization.contactName,
                this.state.organization.contactEmail,
                this.state.organization.contactPhone,
                this.state.organization.address,
                this.state.organization.address2,
                this.state.organization.postalCode,
                this.state.organization.city
            ).then((r) => {
                if (r?.status !== 201) {
                    this.setState({loading: false})
                    let message = `Oops ! Une erreur est survenue lors de la création de l'organisme : ${r.message}`
                    if(r?.["@type"] === "hydra:Error" && _.includes(r?.["hydra:description"], "Duplicate entry")) {
                        message = "Cet organisme existe déjà !"
                    }
                    this.props.onSubmit(false, message)
                    return
                }

                const result = Helper.isValidResponse(r)
                if (result) {
                    this.props.onSubmit(true, "Organisme créé ✔")
                }

            })
        } else if (this.props.type === "edit") {
            Api.organization.updateOrganization(
                this.state.organization.id,
                this.state.organization
            ).then((r) => {
                if (r?.status !== 200) {
                    this.setState({loading: false})
                    this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création de l'organisme : ${r.message}`)
                    return
                }

                const result = Helper.isValidResponse(r)
                if (result) {
                    this.props.onSubmit(true, "Organisme modifié ✔")
                }

            })
        }
    }

    render() {
        return <>
            {this.state.loading && <Loading/>}
            <form id="organization-form" onSubmit={this.handleFormSubmit}>
                <div className="organization-form-content">
                    <div className="organization-form-part">
                        <InputField className="input-tiny" name="organizationName"
                                    isFocused={this.state.organization?.name !== ""}
                                    value={this.state.organization.name}
                                    onChange={(e) => this.handleOrganizationchange("name", e)}
                                    title="Nom de l'organisme" context={this} required={true}
                                    readOnly={this.props.readOnly}>
                            Nom
                        </InputField>

                    </div>

                    <div className="organization-form-part">
                        <SelectField
                            options={this.typeOptions}
                            value={this.state.selectedTypeOption}
                            isMulti={false}
                            closeMenuOnSelect={true}
                            placeholder="Type d'organisme"
                            onChange={this.handleTypeChange}
                            context={this}
                            required={true}
                            isDisabled={this.props.readOnly}
                        />
                    </div>
                    <div className="separator"/>
                    <div className="organization-form-part">
                        <InputField className="input-tiny" name="organizationContactName"
                                    isFocused={this.state.organization?.contactName !== ""}
                                    value={this.state.organization.contactName}
                                    onChange={(e) => this.handleOrganizationchange("contactName", e)}
                                    title="Nom du contact" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Nom du contact
                        </InputField>
                        <InputField className="input-tiny" type="email" name="organizationContactEmail"
                                    isFocused={this.state.organization?.contactEmail !== ""}
                                    value={this.state.organization.contactEmail}
                                    onChange={(e) => this.handleOrganizationchange("contactEmail", e)}
                                    title="Email du contact" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Email du contact
                        </InputField>
                        <InputField className="input-tiny" type="tel" name="organizationContactPhone"
                                    pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                                    isFocused={this.state.organization?.contactPhone !== ""}
                                    value={this.state.organization.contactPhone}
                                    onChange={(e) => this.handleOrganizationchange("contactPhone", e)}
                                    title="Téléphone du contact" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Téléphone du contact
                        </InputField>
                    </div>

                    <div className="organization-form-part">
                        <InputField className="input-tiny" name="organizationAddress"
                                    isFocused={this.state.organization?.address !== ""}
                                    value={this.state.organization.address}
                                    onChange={(e) => this.handleOrganizationchange("address", e)}
                                    title="Adresse" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Adresse
                        </InputField>
                        <InputField className="input-tiny" name="organizationAddress2"
                                    isFocused={this.state.organization?.address2 !== ""}
                                    value={this.state.organization.address2}
                                    onChange={(e) => this.handleOrganizationchange("address2", e)}
                                    title="Adresse 2" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Adresse 2
                        </InputField>
                        <InputField className="input-tiny" name="organizationPostalCode"
                                    isFocused={this.state.organization?.postalCode !== ""}
                                    value={this.state.organization.postalCode}
                                    onChange={(e) => this.handleOrganizationchange("postalCode", e)}
                                    title="Code postal" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Code postal
                        </InputField>
                        <InputField className="input-tiny" name="organizationCity"
                                    isFocused={this.state.organization?.city !== ""}
                                    value={this.state.organization.city}
                                    onChange={(e) => this.handleOrganizationchange("city", e)}
                                    title="Ville" context={this} required={false}
                                    readOnly={this.props.readOnly}>
                            Ville
                        </InputField>
                    </div>

                </div>
                {!this.props.readOnly &&
                    <div className="organization-form-footer">
                        <button className="btn default btn-lg"
                                type="submit"
                                title="Enregistrer les données saisies" onClick={null}
                                ref={this.props.forwardRef}>
                            <FontAwesomeIcon icon="fas fa-save"/> Enregistrer
                        </button>
                        <RequiredText/>
                    </div>
                }
            </form>
        </>
    }
}

/* ================================== GLOBAL FUNCTIONS ================================== */
