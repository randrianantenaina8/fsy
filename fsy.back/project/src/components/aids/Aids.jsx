import React, {useEffect, useState} from "react"
import {Api, Constants, Session} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import {Loading} from "../general/form/Loading"
import DataTable from "react-data-table-component"
import Helper from "../../services/Helper"
import moment from "moment"
import {toast} from "react-toastify"
import ReactSwitch from "react-switch"
import Modal from "../general/form/Modal"
import {InputField} from "../general/form/Input"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {SelectField} from "../general/form/Select"
import {AidForm} from "./AidForm"
import {
    AID_STATUS_DRAFT,
    AID_STATUS_REFUSED,
    AID_STATUS_VALIDATED,
    AID_STATUS_VALIDATING
} from "fsy.common-library/lib/env/Constants"
import {Chip, Stack} from "@mui/material"
import {TableWithFiltersSkeleton} from "../../services/LoadingHelper"
import {RIGHTS_NOACCESS, RIGHTS_WRITE} from "../../services/Constants"

import "./aids.css"

export default function AidsPage() {
    document.title = "Aides - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="aids" sectionClassName="aids"
                          auth={[Constants.PROFILE_AIDENTRY, Constants.PROFILE_AIDVALIDATION]}>
        <AidList/>
    </HtmlStructure>
}

class AidList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            searching: false,
            aids: [],
            totalRows: 0,
            perPage: 10,
            changeGeneralState: false,
            formType: "create",
            editingAid: null,
            aidModalDisplay: false,
            aidModalConfirmMessage: "",
            aidModalAfterConfirmAction: "closeModal",
            modalModified: false,
            authEntry: RIGHTS_NOACCESS,
            authValidation: RIGHTS_NOACCESS,
            quickFilter: 0,
            quickFilterCounts: {draft: 0, validating: 0, validated: 0},
            aidModalTitle: ''
        }

        this.handlePerRowsChange = this.handlePerRowsChange.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleSubmitAfterConfirm = this.handleSubmitAfterConfirm.bind(this)
        this.updateModalModified = this.updateModalModified.bind(this)
        this.handleVersionCreate = this.handleVersionCreate.bind(this)
        this.handleVersionSwitched = this.handleVersionSwitched.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleQuickFilter = this.handleQuickFilter.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)

        this.refCreateVersionButton = React.createRef()
        this.refSwitchVersionSelect = React.createRef()
        this.refSaveButton = React.createRef()
        this.refCloseButton = React.createRef()
    }

    componentDidMount() {
        this.setState({authEntry: Session.getAuth(Constants.PROFILE_AIDENTRY)})
        this.setState({authValidation: Session.getAuth(Constants.PROFILE_AIDVALIDATION)})
        this.setState({
            aidModalTitle: this.state.formType === "create" ? "Créer une aide" : `Modifier - une aide`
        })

        Api.aid.getAidCountPerStatus({statusAid: Constants.AID_STATUS_VALIDATING})
            .then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    let quickFilterCounts = this.state.quickFilterCounts
                    for (let i in resultObject) {
                        switch (resultObject[i].status) {
                            case AID_STATUS_VALIDATING:
                                quickFilterCounts["validating"] = resultObject[i].count
                                break
                            case AID_STATUS_DRAFT:
                                quickFilterCounts["draft"] = resultObject[i].count
                                break
                            case AID_STATUS_VALIDATED:
                                quickFilterCounts["validated"] = resultObject[i].count
                                break
                            default:
                                break
                        }
                    }
                    this.setState({quickFilterCounts: quickFilterCounts})
                }

                if (response?.status !== 200) {
                    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
                }
            })

        getDataLines.bind(this)(1)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.changeGeneralState) {
            getDataLines.bind(this)(this.state.page, this.getFilters())
            this.setState({changeGeneralState: false})
        }
    }

    getFilters() {
        console.debug("getFilters not initialized !")
        return []
    }

    refresh() {
        this.setState({changeGeneralState: true}, this.forceUpdate())
    }

    handlePerRowsChange(newPerPage, page) {
        this.setState({perPage: newPerPage, searching: true}, () => {
            getDataLines.bind(this)(page, this.getFilters())
        })
    }

    handlePageChange(page) {
        this.setState({searching: true}, () => {
            getDataLines.bind(this)(page, this.getFilters())
        })
    }

    handleFilter(filterFunctionFromChild, updateButtonStateFunction) {
        this.setState({searching: true})
        updateButtonStateFunction(true)

        this.getFilters = filterFunctionFromChild
        const filters = this.getFilters()

        Api.aid.getAidCount(Helper.getFiltersUrlParams(filters)).then((response) => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })

        getDataLines.bind(this)(1, filters, updateButtonStateFunction)
    }

    handleQuickFilter(status) {
        this.setState({searching: true, quickFilter: status})

        const filters = status === 0 ? {} : {statusAid: status}
        getDataLines.bind(this)(1, filters)
    }

    displayModal(type = "create", aid = null) {
        this.setState({
            formType: type,
            editingAid: aid,
            aidModalDisplay: true,
            aidModalTitle: type === "create" ? "Créer une aide" : `Modifier - ${aid?.name}`
        })
    }

    handleModalClose() {
        this.setState({modalModified: false})
        if (this.state.aidModalAfterConfirmAction === "closeModal") {
            this.setState({aidModalDisplay: false})
        } else if (this.state.aidModalAfterConfirmAction === "createVersion") {
            setTimeout(() => {
                this.refCreateVersionButton.current.click()
            }, 150)
        } else if (this.state.aidModalAfterConfirmAction === "switchVersion") {
            setTimeout(() => {
                this.refSwitchVersionSelect.current.click()
            }, 150)
        }
        this.setState({aidModalAfterConfirmAction: "closeModal"})
    }

    handleVersionCreate(formType, callback) {
        if (this.state.modalModified) {
            this.setState({aidModalAfterConfirmAction: "createVersion"})
            this.refCloseButton.current.click()
            return
        }

        this.setState({formType: formType})
        callback()
    }

    handleVersionSwitched(callback) {
        if (this.state.modalModified) {
            this.setState({aidModalAfterConfirmAction: "switchVersion"})
            this.refCloseButton.current.click()
            return
        }

        callback()
    }

    handleFormSubmit(success, message) {
        if (success) {
            getDataLines.bind(this)(1, this.getFilters())
            toast.success(message, Helper.getToastOptions())
            this.handleModalClose()
            return
        }
        toast.error(message, Helper.getToastOptions())
        this.setState({aidModalAfterConfirmAction: "closeModal"})
    }

    handleSubmitAfterConfirm() {
        this.refSaveButton.current.click()
    }

    updateModalModified(state) {
        if (this.state.authEntry === RIGHTS_WRITE || this.state.authValidation === RIGHTS_WRITE) {
            this.setState({modalModified: state})
        }
    }

    handleNameChange(name) {
        this.setState({
            aidModalTitle: (this.state.formType === "create" ? `Créer` : `Modifier`) + ' - ' + name
        })
    }

    render() {
        const columns = [
            {
                name: "Nom", selector: row => row.title, sortable: true, width: "25vw", sortFunction: (a, b) => {
                    const A = a.raw.name
                    const B = b.raw.name
                    return A > B ? 1 : -1
                }
            },
            {
                name: "Organisme porteur",
                selector: row => row.organization,
                sortable: true,
                width: "15vw",
                sortFunction: (a, b) => {
                    const A = a.raw.organization.name
                    const B = b.raw.organization.name
                    return A > B ? 1 : -1
                }
            },
            {name: "Nature", selector: row => row.nature, sortable: true, width: "10vw"},
            {
                name: "Ouverture",
                selector: row => row.open_date,
                sortable: true,
                width: "7vw",
                center: true,
                sortFunction: (a, b) => {
                    const A = moment(a.raw.openDate)
                    const B = moment(b.raw.openDate)
                    return A > B ? 1 : -1
                }
            },
            {
                name: "Dépôt maximum",
                selector: row => row.deposit_date,
                sortable: true,
                width: "7vw",
                center: true,
                sortFunction: (a, b) => {
                    const A = moment(a.raw.depositDate)
                    const B = moment(b.raw.depositDate)
                    return A > B ? 1 : -1
                }
            },
            {
                name: "Dernière modification",
                selector: row => row.updated_at,
                sortable: true,
                width: "7vw",
                center: true,
                sortFunction: (a, b) => {
                    const A = moment(a.raw.updatedAt)
                    const B = moment(b.raw.updatedAt)
                    return A > B ? 1 : -1
                }
            },
            {name: "Version", selector: row => row.version, sortable: true, center: true, width: "4vw"},
            {
                name: "Version publiée",
                selector: row => row.published_version,
                center: true,
                sortable: true,
                width: "4vw"
            },
            {
                name: "Statut", selector: row => row.status, sortable: true, width: "5vw", sortFunction: (a, b) => {
                    const A = a.raw.status
                    const B = b.raw.status
                    return A > B ? 1 : -1
                }
            },
            {
                name: "Publiée", selector: row => row.active, sortable: true, width: "5vw", sortFunction: (a, b) => {
                    const A = a.raw.active
                    const B = b.raw.active
                    return A > B ? 1 : -1
                }
            }
        ]

        return <article className="aids">
            <section className="bo-data-title">
                <h3>Aides</h3>

                {(this.state.authEntry === RIGHTS_WRITE || this.state.authValidation === RIGHTS_WRITE) &&
                    <button
                        className={`btn btn-lg default addButton ${this.state.loading || this.state.searching ? "disabled" : ""}`}
                        title="Cliquer pour ajouter une aide" onClick={() => this.displayModal()}>
                        <FontAwesomeIcon icon="fas fa-add"/> Ajouter une aide
                    </button>
                }
                <Modal title={this.state.aidModalTitle}
                       hide={this.handleModalClose}
                       isShowing={this.state.aidModalDisplay}
                       confirm={this.state.modalModified}
                       confirmMessage={this.state.aidModalConfirmMessage}
                       saveBeforeClose={this.handleSubmitAfterConfirm}
                       closeButtonRef={this.refCloseButton}
                >
                    <div className="aid-form">
                        <AidForm type={this.state.formType} aid={this.state.editingAid}
                                 onSubmit={this.handleFormSubmit}
                                 onVersionCreate={this.handleVersionCreate}
                                 onVersionSwitched={this.handleVersionSwitched}
                                 onNameChange={this.handleNameChange}
                                 createVersionForwardRef={this.refCreateVersionButton}
                                 switchVersionForwardRef={this.refSwitchVersionSelect}
                                 forwardRef={this.refSaveButton}
                                 modalModify={this.updateModalModified}
                                 readOnly={this.state.authEntry < RIGHTS_WRITE}
                                 canValidate={this.state.authValidation === RIGHTS_WRITE}/>
                    </div>
                </Modal>

                <Stack direction="row" alignItems="center" spacing={1} className="quickfilter-wrap">
                    <Chip label="Toutes les aides" variant="filled" onClick={() => this.handleQuickFilter(0)}
                          color={this.state.quickFilter === 0 ? "success" : "default"}
                          disabled={this.state.loading || this.state.searching}/>
                    <Chip label={`Aides à valider (${this.state.quickFilterCounts.validating})`} variant="filled"
                          onClick={() => this.handleQuickFilter(Constants.AID_STATUS_VALIDATING)}
                          color={this.state.quickFilter === AID_STATUS_VALIDATING ? "success" : "default"}
                          disabled={this.state.loading || this.state.searching}/>
                    <Chip label={`Aides validées (${this.state.quickFilterCounts.validated})`} variant="filled"
                          onClick={() => this.handleQuickFilter(Constants.AID_STATUS_VALIDATED)}
                          color={this.state.quickFilter === AID_STATUS_VALIDATED ? "success" : "default"}
                          disabled={this.state.loading || this.state.searching}/>
                    <Chip label={`Aides en cours de rédaction (${this.state.quickFilterCounts.draft})`}
                          variant="filled" onClick={() => this.handleQuickFilter(Constants.AID_STATUS_DRAFT)}
                          color={this.state.quickFilter === AID_STATUS_DRAFT ? "success" : "default"}
                          disabled={this.state.loading || this.state.searching}/>
                </Stack>
            </section>

            <section className="bo-data-table card">
                {this.state.loading ? <TableWithFiltersSkeleton linesCount={13} filtersCount={5}/> : <>
                    <AidFilters onFilter={this.handleFilter}/>
                    <div className="bo-data-table-content">
                        {this.state.searching && <Loading/>}
                        <DataTable
                            columns={columns}
                            data={this.state.aids}
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
                            className="aidsTable"
                            subHeaderAlign="center"
                            subHeaderWrap/>
                    </div>
                </>}
            </section>
        </article>
    }
}

class AidFilters extends React.Component {
    static defaultProps = {
        onFilter: () => {
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            aidFilterText: "",
            selectedOrganization: null,
            selectedNature: null,
            selectedStatusOptions: null,
            selectedActiveOptions: null,
            hasFilters: false,
            loading: false,
            organizationList: [],
            organizationListFiltered: [],
            natureList: []
        }
        this.statusOptions = [{
            label: "statut", icon: "fa-list-check", options: [
                {value: AID_STATUS_DRAFT, label: "Brouillon"},
                {value: AID_STATUS_VALIDATING, label: "À valider"},
                {value: AID_STATUS_REFUSED, label: "Refusée"},
                {value: AID_STATUS_VALIDATED, label: "Validée"}
            ]
        }]
        this.activeOptions = [{
            label: "état", icon: "fa-table-list", options: [
                {value: true, label: "Publiée"},
                {value: false, label: "Non publiée"}
            ]
        }]

        this.typeOrganization = [
            Constants.ORGANISM_TYPE_FSY,
            Constants.ORGANISM_TYPE_ORGANISM,
            Constants.ORGANISM_TYPE_PARTNER,
            Constants.ORGANISM_TYPE_OTHER
        ]

        this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
        this.handleClearFilter = this.handleClearFilter.bind(this)
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.handleActiveChange = this.handleActiveChange.bind(this)
        this.handleOrganizationChange = this.handleOrganizationChange.bind(this)
        this.handleTextInput = this.handleTextInput.bind(this)
        this.updateButtonState = this.updateButtonState.bind(this)
        this.handleNatureChange = this.handleNatureChange.bind(this)
        this.getFilters = this.getFilters.bind(this)
    }

    getFilters() {
        let filters = {}
        if (this.state.aidFilterText !== "") {
            filters.aidFilterText = this.state.aidFilterText
        }

        if (this.state.selectedStatusOptions !== null && Object.keys(this.state.selectedStatusOptions).length !== 0) {
            filters.statusAid = this.state.selectedStatusOptions.value
        }

        if (this.state.selectedActiveOptions !== null && Object.keys(this.state.selectedActiveOptions).length !== 0) {
            filters.active = this.state.selectedActiveOptions.value
        }

        if (this.state.selectedOrganization !== null && Object.keys(this.state.selectedOrganization).length !== 0) {
            filters.organizations = [this.state.selectedOrganization.value]
        }

        if (this.state.selectedNature !== null && Object.keys(this.state.selectedNature).length !== 0) {
            filters.aidNature = [this.state.selectedNature.value]
        }

        this.setState(() => {
            return {hasFilters: Object.keys(filters).length !== 0}
        })

        return filters
    }


    handleStatusChange(selectedOptions) {
        this.setState({
            selectedStatusOptions: selectedOptions
        })
    }

    handleActiveChange(selectedOptions) {
        this.setState({
            selectedActiveOptions: selectedOptions
        })
    }

    handleOrganizationChange(selectedOptions) {
        this.setState({
            selectedOrganization: selectedOptions
        })
    }

    handleNatureChange(selectedOptions) {
        this.setState({
            selectedNature: selectedOptions
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
            aidFilterText: "",
            selectedOrganization: [],
            selectedNature: [],
            selectedStatusOptions: [],
            selectedActiveOptions: [],
            hasFilters: false
        }, () => {
            this.handleFilterSubmit()
        })
    }

    updateButtonState(isLoading = false) {
        this.setState({loading: isLoading})
    }

    componentDidMount() {
        Api.organization.getOrganizations()
            .then((response) => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    this.setState({organizationList: resultObject},
                        () => {
                            this.updateOrganizationList()
                        })
                }

                if (response?.status !== 200) {
                    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
                }
            })

        Api.aid.getAidNatures()
            .then((response) => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const natureList = resultObject.map(element => {
                        return {
                            label: element.name,
                            value: element.id
                        }
                    })
                    this.setState({natureList: natureList})
                }

                if (response?.status !== 200) {
                    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
                }
            })
    }

    updateOrganizationList = () => {
        let filtered = []
        this.typeOrganization.forEach(type => {
            filtered = [...filtered, {
                label: type,
                options: this.state.organizationList.filter(element => {
                    switch (type) {
                        case Constants.ORGANISM_TYPE_ORGANISM:
                            if (element.organism) {
                                return true
                            }
                            break
                        case Constants.ORGANISM_TYPE_PARTNER:
                            if (element.partner) {
                                return true
                            }
                            break
                        case Constants.ORGANISM_TYPE_OTHER:
                            if (element.other) {
                                return true
                            }
                            break
                        case Constants.ORGANISM_TYPE_FSY:
                            if (!element.organism && !element.partner && !element.other) {
                                return true
                            }
                            break
                        default:
                            break
                    }
                    return false
                }).map(element => {
                    return {label: element.name, value: element.id}
                })
            }]
        })
        this.setState({
            organizationListFiltered: filtered
        })
    }

    render() {
        return <div className="bo-data-filters">
            <InputField className="input-tiny aids-text" name="aidFilterText"
                        onKeyDown={this.handleTextInput}
                        value={this.state.aidFilterText}
                        title="Texte à rechercher" context={this}>
                Texte à rechercher
            </InputField>
            <SelectField
                options={this.state.organizationListFiltered}
                value={this.state.selectedOrganization}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Organisme porteur"
                onChange={this.handleOrganizationChange}
                context={this}
            />
            <SelectField
                options={this.state.natureList}
                value={this.state.selectedNature}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Nature"
                onChange={this.handleNatureChange}
                context={this}
            />
            <SelectField
                options={this.activeOptions}
                value={this.state.selectedActiveOptions}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Etat"
                onChange={this.handleActiveChange}
                context={this}
            />
            <SelectField
                options={this.statusOptions}
                value={this.state.selectedStatusOptions}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Statut"
                onChange={this.handleStatusChange}
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
async function getDataLines(page = 1, filters = null, callback = null) {
    const filtersUrlParams = filters === null ? {} : Helper.getFiltersUrlParams(filters)
    Api.aid.getAidCount(filtersUrlParams).then((response) => {
        const resultObject = Helper.isValidResponse(response)
        if (resultObject) {
            this.setState({totalRows: resultObject.count})
        }

        if (response?.status !== 200) {
            toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
        }
    })

    Helper.getDataTableLines.bind(this)(
        Api.aid.getAids,
        {"order[id]": "asc", "per_page": this.state.perPage},
        "aids",
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
 * @param response
 */
async function FormatRow(response) {
    const aid = response.aid
    const activeVersion = response.activeVersion
    const active = <ActiveSwitch currentObject={aid} objectId={aid.id}
                                 apiFunction={Api.aid.updateAid} idPrefix="aid"
                                 listeObj={this}
                                 className="aids-active-switch"
                                 disabled={this.state.authValidation < RIGHTS_WRITE}/>

    const statuses = ["Brouillon", "À valider", "Refusée", "Validée"]

    const name = Helper.FormatClickableText(aid.name, () => this.displayModal("edit", aid))

    return {
        title: name,
        organization: Helper.FormatOrganization(aid.organization),
        nature: aid.nature.name,
        open_date: aid.openDate ? moment(aid.openDate).format("DD/MM/YYYY") : "",
        deposit_date: aid.depositDate ? moment(aid.depositDate).format("DD/MM/YYYY") : "",
        updated_at: moment(aid.updatedAt).format("DD/MM/YYYY HH:mm"),
        version: aid.version,
        published_version: activeVersion > 0 ? activeVersion : "aucune",
        status: <div className="badge-display"><span
            className={`badge status-row status-${aid.status}`}>{statuses[aid.status - 1]}</span></div>,
        active: active,
        raw: aid
    }
}

/**
 * Return a switch component that update the question active state (question object passed in props)
 *
 * @param props {object}
 * @return {JSX.Element}
 */
function ActiveSwitch(props) {
    const [showModal, setShowModal] = useState(false)
    const [active, setActive] = useState(props.currentObject.active)

    useEffect(() => {
        setActive(props.currentObject.active)
    }, [setActive, props.currentObject.active])

    const triggerHideModal = () => {
        setShowModal(false)
    }

    const handleChange = activeState => {
        if (activeState) {
            if (props.currentObject.status !== AID_STATUS_VALIDATED) {
                toast.error("Vous ne pouvez pas publier une aide sans l'avoir validée !", Helper.getToastOptions())
            } else {
                toggleActive(true)
            }
        } else {
            setShowModal(true)
        }
    }

    const handleConfirmDeactivate = () => {
        toggleActive(false)
    }

    const toggleActive = (activeState) => {
        Api.aid.updateAid(
            props.currentObject.id,
            {active: activeState}
        ).then(response => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject) {
                setActive(resultObject.active)
                toast.success("Enregistré!", Helper.getToastOptions())
                props.listeObj.refresh()
            } else {
                toast.error("Une erreur est survenue", Helper.getToastOptions())
            }
        }).finally(
            setShowModal(false)
        )
    }

    return <>
        <ReactSwitch
            checked={active ?? false}
            className={props.className}
            id={`aid-${props.currentObject.id}`}
            onColor="#a6d290"
            offColor="#fc9999"
            onChange={handleChange}
            disabled={props.disabled}/>


        <Modal title="Désactivation"
               hide={triggerHideModal}
               isShowing={showModal}>
            <div className="modal-body">
                Etes-vous sûr de vouloir désactiver
                l'aide {props.currentObject.name} ?
            </div>
            <div className="modal-footer flex-end">
                <button className="btn" onClick={triggerHideModal}>Non</button>
                <button className="btn alert" onClick={handleConfirmDeactivate}>Oui</button>
            </div>
        </Modal>
    </>
}
