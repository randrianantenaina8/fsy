import React from "react"
import {Api, Constants, Session} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import Helper from "../../services/Helper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Loading} from "../general/form/Loading"
import DataTable from "react-data-table-component"
import {InputField} from "../general/form/Input"
import {SelectField} from "../general/form/Select"
import ActiveSwitch from "../general/form/ActiveSwitch"
import _ from "lodash"
import {toast} from "react-toastify"
import Modal from "../general/form/Modal"
import {OrganizationForm} from "./OrganizationForm"
import {TableWithFiltersSkeleton} from "../../services/LoadingHelper"
import {RIGHTS_READ, RIGHTS_WRITE} from "../../services/Constants"

import "./organizations.css"

export default function Organizations() {
    document.title = "Organismes - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="organizations" sectionClassName="organizations"
                          auth={[Constants.PROFILE_ORGANIZATION]}>
        <OrganizationsList/>
    </HtmlStructure>
}

class OrganizationsList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            searching: false,
            organizations: [],
            totalRows: 0,
            perPage: 10,
            editingOrganization: null,
            formType: "create",
            auth: Session.getAuth(Constants.PROFILE_ORGANIZATION)
        }

        this.handlePerRowsChange = this.handlePerRowsChange.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.displayModal = this.displayModal.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleSubmitAfterConfirm = this.handleSubmitAfterConfirm.bind(this)
        this.updateModalModified = this.updateModalModified.bind(this)

        this.refSaveButton = React.createRef()
    }

    componentDidMount() {
        Api.organization.getOrganizationsCount().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
        getOrganizationLines.bind(this)(1)
    }

    getFilters() {
        console.debug("getFilters not initialized !")
        return []
    }

    handlePerRowsChange(newPerPage, page) {
        this.setState({perPage: newPerPage, searching: true}, () => {
            getOrganizationLines.bind(this)(page, this.getFilters())
        })
    }

    handlePageChange(page) {
        this.setState({searching: true}, () => {
            getOrganizationLines.bind(this)(page, this.getFilters())
        })
    }

    handleFilter(filterFunctionFromChild, updateButtonStateFunction) {
        this.setState({searching: true})
        updateButtonStateFunction(true)

        this.getFilters = filterFunctionFromChild
        const filters = this.getFilters()

        Api.organization.getOrganizationsCount(Helper.getFiltersUrlParams(filters)).then((response) => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })

        getOrganizationLines.bind(this)(1, filters, updateButtonStateFunction)
    }

    handleModalClose() {
        this.setState({organizationModalDisplay: false, modalModified: false})
    }

    displayModal(type = "create", organization = null) {
        this.setState({formType: type, editingOrganization: organization, organizationModalDisplay: true})
    }

    handleFormSubmit(success, message) {
        if (success) {
            getOrganizationLines.bind(this)(1, this.getFilters())
            toast.success(message, Helper.getToastOptions())
            this.handleModalClose()
            return
        }
        toast.error(message, Helper.getToastOptions())
    }

    handleSubmitAfterConfirm() {
        this.refSaveButton.current.click()
    }

    updateModalModified(state) {
        if (this.state.auth === RIGHTS_WRITE) {
            this.setState({modalModified: state})
        }
    }

    render() {
        const columns = [
            {name: "id", selector: row => row.id, sortable: false, center: true, width: "3vw"},
            {name: "Nom", selector: row => row.title, sortable: true, width: "30vw"},
            {name: "Type", selector: row => row.type, center: true, width: "8vw"},
            {name: "Contact", selector: row => row.contactName, sortable: true, center: false, width: "20vw"},
            {name: "Mail contact", selector: row => row.contactEmail, center: false, sortable: true, width: "15vw"},
            {name: "Téléphone contact", selector: row => row.contactPhone, center: false, width: "10vw"}
        ]

        return <article className="organizations">

            <section className="bo-data-title">
                <h3>Organismes</h3>

                {this.state.auth === RIGHTS_WRITE &&
                    <button
                        className={`btn btn-lg default addButton ${this.state.loading || this.state.searching ? "disabled" : ""}`}
                        title="Cliquer pour ajouter un nouvel organisme" onClick={() => this.displayModal()}>
                        <FontAwesomeIcon icon="fas fa-add"/> Ajouter un organisme
                    </button>
                }
                <Modal title={`${this.state.formType === "create" ? "Créer" : "Modifier"} un organisme`}
                       hide={this.handleModalClose}
                       isShowing={this.state.organizationModalDisplay}
                       confirm={this.state.modalModified} saveBeforeClose={this.handleSubmitAfterConfirm}>
                    <div className="organization-form">
                        <OrganizationForm
                            type={this.state.formType}
                            organization={this.state.editingOrganization}
                            onSubmit={this.handleFormSubmit}
                            forwardRef={this.refSaveButton}
                            modalModify={this.updateModalModified}
                            readOnly={this.state.auth === RIGHTS_READ}/>
                    </div>
                </Modal>
            </section>

            <section className="bo-data-table card">
                {this.state.loading ? <TableWithFiltersSkeleton linesCount={12} filtersCount={2}/> : <>
                    <OrganizationsFilter onFilter={this.handleFilter}/>
                    <div className="bo-data-table-content">
                        {this.state.searching && <Loading/>}
                        <DataTable
                            columns={columns}
                            data={this.state.organizations}
                            fixedHeader
                            fixedHeaderScrollHeight="75vh"
                            dense
                            persistTableHead
                            highlightOnHover
                            pagination
                            paginationServer
                            paginationTotalRows={this.state.totalRows}
                            onChangeRowsPerPage={this.handlePerRowsChange}
                            onChangePage={this.handlePageChange}
                            responsive
                            className="organizationsTable"
                            subHeaderAlign="center"
                            subHeaderWrap/>
                    </div>
                </>}
            </section>
        </article>
    }
}

class OrganizationsFilter extends React.Component {
    static defaultProps = {
        onFilter: () => {
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            organizationFilterText: "",
            selectedTypeOptions: null,
            hasFilters: false,
            loading: false
        }
        this.typeOptions = [{
            label: "type", icon: "fa-list-check", options: [
                {value: Constants.ORGANISM_TYPE_PARTNER, label: Constants.ORGANISM_TYPE_PARTNER},
                {value: Constants.ORGANISM_TYPE_ORGANISM, label: Constants.ORGANISM_TYPE_ORGANISM},
                {value: Constants.ORGANISM_TYPE_FSY, label: Constants.ORGANISM_TYPE_FSY},
                {value: Constants.ORGANISM_TYPE_OTHER, label: Constants.ORGANISM_TYPE_OTHER}
            ]
        }]

        this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
        this.handleClearFilter = this.handleClearFilter.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleTextInput = this.handleTextInput.bind(this)
        this.updateButtonState = this.updateButtonState.bind(this)
        this.getFilters = this.getFilters.bind(this)
    }

    getFilters() {
        let filters = {}

        // retrieves typed text
        if (this.state.organizationFilterText !== "") {
            filters.organizationFilterText = this.state.organizationFilterText
        }

        // retrieves selected types
        if (this.state.selectedTypeOptions !== null && Object.keys(this.state.selectedTypeOptions).length !== 0) {
            filters.organizationType = _.map(this.state.selectedTypeOptions, "value").join(",")
        }

        this.setState(() => {
            return {hasFilters: Object.keys(filters).length !== 0}
        })

        return filters
    }

    handleTypeChange(selectedOptions) {
        this.setState({
            selectedTypeOptions: selectedOptions
        })
    }

    handleTextInput(e) {
        if (e.key === "Enter") {
            this.handleFilterSubmit()
        }
    }

    handleFilterSubmit() {
        this.props.onFilter(this.getFilters, this.updateButtonState)
    }

    handleClearFilter() {
        this.setState({
            organizationFilterText: "",
            selectedTypeOptions: [],
            hasFilters: false
        }, () => {
            this.handleFilterSubmit()
        })
    }

    updateButtonState(isLoading = false) {
        this.setState({loading: isLoading})
    }

    render() {
        return <div className="bo-data-filters">
            <InputField className="input-tiny organizations-text" name="organizationFilterText"
                        value={this.state.organizationFilterText} onKeyDown={this.handleTextInput}
                        title="Texte à rechercher" context={this}>
                Texte à rechercher
            </InputField>

            <SelectField
                options={this.typeOptions}
                value={this.state.selectedTypeOptions}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder="Type d'organisme"
                onChange={this.handleTypeChange}
                context={this}
            />
            <div>
                <button type="button" className="btn default filterButton"
                        title="Filtrer les résultats"
                        disabled={this.state.loading}
                        onClick={this.handleFilterSubmit}>
                    <FontAwesomeIcon icon="fas fa-filter"/>
                </button>
                {this.state.hasFilters &&
                    <button type="button" className="btn warning resetButton"
                            title="Effacer les filtres"
                            onClick={this.handleClearFilter}>
                        <FontAwesomeIcon icon="fas fa-filter-circle-xmark"/>
                    </button>
                }
            </div>
        </div>
    }
}


/* ================================== GLOBAL FUNCTIONS ================================== */

/**
 * Call questions Api and update table state with the result of the api call
 *
 * @param page {int}
 * @param filters {object|null}
 * @param callback {Function|null}
 * @return {Promise<void>}
 */
async function getOrganizationLines(page = 1, filters = null, callback = null) {
    Helper.getDataTableLines.bind(this)(
        Api.organization.getOrganizations,
        {"order[id]": "asc", "per_page": this.state.perPage},
        "organizations",
        FormatRow,
        page,
        filters,
        callback
    ).then(() => {
        this.setState({searching: false})
    })
}

/**
 * Create a jsx object that will be interpreted by the DataTable
 *
 * @param organization {object}
 */
async function FormatRow(organization) {
    const active = <ActiveSwitch objectActive={organization.active} objectId={organization.id}
                                 apiFunction={Api.organization.updateOrganization} idPrefix="organization"
                                 className="organizations-active-switch"
                                 disabled={this.state.auth === RIGHTS_READ}/>

    return {
        id: organization.id,
        title: Helper.FormatClickableText(organization.name, () => this.displayModal("edit", organization)),
        type: Helper.FormatType(organization),
        contactName: Helper.FormatText(organization.contactName),
        contactEmail: Helper.FormatMail(organization.contactEmail),
        contactPhone: Helper.FormatPhone(organization.contactPhone),
        active: active
    }
}