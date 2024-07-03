import React from "react"
import {Api, Constants, Session} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import Helper from "../../services/Helper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import {InputField} from "../general/form/Input"
import {SelectField} from "../general/form/Select"
import ActiveSwitch from "../general/form/ActiveSwitch"
import Modal from "../general/form/Modal"
import _ from "lodash"
import {toast} from "react-toastify"
import {CriterionForm} from "./CriterionForm"
import {TableWithFiltersSkeleton} from "../../services/LoadingHelper"
import {Loading} from "../general/form/Loading"
import {RIGHTS_READ, RIGHTS_WRITE} from "../../services/Constants"
import {Tooltip} from "@mui/material"
import {Paid as PaidIcon, Memory as MemoryIcon, Quiz as QuizIcon} from "@mui/icons-material"

import "./criterion.css"

export default function CriterionPage() {
    document.title = "Critères - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="criterion" sectionClassName="criterion" auth={[Constants.PROFILE_CRITERION]}>
        <CriterionList/>
    </HtmlStructure>
}

class CriterionList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            searching: false,
            criterion: [],
            currentSort: {slug: "shortName", direction: "ASC"},
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            editingCriteria: null,
            formType: "create",
            modalModified: false,
            auth: Session.getAuth(Constants.PROFILE_CRITERION)
        }

        this._handlePerRowsChange = this._handlePerRowsChange.bind(this)
        this._handlePageChange = this._handlePageChange.bind(this)
        this._handleFilter = this._handleFilter.bind(this)
        this._handleModalClose = this._handleModalClose.bind(this)
        this._handleFormSubmit = this._handleFormSubmit.bind(this)
        this._displayModal = this._displayModal.bind(this)
        this.handleSubmitAfterConfirm = this.handleSubmitAfterConfirm.bind(this)
        this.updateModalModified = this.updateModalModified.bind(this)

        this.refSaveButton = React.createRef()
    }

    componentDidMount() {
        Api.criteria.getCriterionCount().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
        getCriterionLines.bind(this)(this.state.currentPage)
    }

    _getFilters() {
        console.debug("_getFilters not initialized !")
        return []
    }

    _handlePerRowsChange(newPerPage, page) {
        this.setState({perPage: newPerPage, currentPage: page, searching: true}, () => {
            getCriterionLines.bind(this)(page, this._getFilters(), null, this.state.currentSort.slug, this.state.currentSort.direction)
        })
    }

    _handlePageChange(page) {
        this.setState({currentPage: page, searching: true}, () => {
            getCriterionLines.bind(this)(page, this._getFilters(), null, this.state.currentSort.slug, this.state.currentSort.direction)
        })
    }

    _handleSort(column, sortDirection) {
        this.setState({searching: true, currentSort: {slug: column.slug, direction: sortDirection}})
        getCriterionLines.bind(this)(this.state.currentPage, this._getFilters(), null, column.slug, sortDirection)
    }

    _handleFilter(filterFunctionFromChild, _updateButtonStateFunction) {
        this.setState({searching: true}, () => {
            _updateButtonStateFunction(true)

            this._getFilters = filterFunctionFromChild
            const filters = this._getFilters()

            Api.criteria.getCriterionCount(Helper.getFiltersUrlParams(filters)).then((response) => {
                const resultObject = Helper.isValidResponse(response)
                if (resultObject) {
                    this.setState({totalRows: resultObject.count})
                }

                if (response?.status !== 200) {
                    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
                }
            })

            getCriterionLines.bind(this)(this.state.currentPage, filters, _updateButtonStateFunction, this.state.currentSort.slug, this.state.currentSort.direction)
        })
    }

    _displayModal(type = "create", criteria = null) {
        this.setState({formType: type, editingCriteria: criteria, criteriaModalDisplay: true})
    }

    _handleModalClose() {
        this.setState({criteriaModalDisplay: false, modalModified: false})
    }

    _handleFormSubmit() {
        this.setState({searching: true}, () => {
            this._handleModalClose()
            getCriterionLines.bind(this)(this.state.currentPage, this._getFilters(), null, this.state.currentSort.slug, this.state.currentSort.direction)
        })
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
            {
                name: "Identifiant",
                selector: row => row.shortName,
                sortable: true,
                center: false,
                width: "7vw",
                slug: "shortName"
            },
            {name: "Nom", selector: row => row.title, sortable: true, width: "57vw", slug: "name"},
            {name: "Type", selector: row => row.type, center: true, width: "8vw"},
            {name: "Obligatoire", selector: row => row.mandatory, sortable: false, center: true, width: "7vw"},
            {name: "Actif", selector: row => row.active, sortable: false, center: true, width: "7vw"}
        ]

        return <article className="criterion">

            <section className="bo-data-title">
                <h3>Critères</h3>

                <Modal title={`${this.state.formType === "create" ? "Créer" : "Modifier"} un critère`}
                       hide={this._handleModalClose}
                       isShowing={this.state.criteriaModalDisplay}
                       confirm={this.state.modalModified} saveBeforeClose={this.handleSubmitAfterConfirm}>
                    <CriterionForm type={this.state.formType} criteria={this.state.editingCriteria}
                                   onSubmit={this._handleFormSubmit}
                                   forwardRef={this.refSaveButton}
                                   modalModify={this.updateModalModified}
                                   readOnly={this.state.auth === RIGHTS_READ}/>
                </Modal>
            </section>

            <section className="bo-data-table card">
                {this.state.loading ? <TableWithFiltersSkeleton linesCount={13} filtersCount={4}/> : <>
                    <CriterionFilter onFilter={this._handleFilter}/>
                    <div className="bo-data-table-content">
                        {this.state.searching && <Loading/>}
                        <DataTable
                            columns={columns}
                            data={this.state.criterion}
                            fixedHeader
                            fixedHeaderScrollHeight="75vh"
                            dense
                            persistTableHead
                            highlightOnHover
                            pagination
                            paginationServer
                            paginationTotalRows={this.state.totalRows}
                            onChangeRowsPerPage={this._handlePerRowsChange}
                            onChangePage={this._handlePageChange}
                            responsive
                            className="criterionTable"
                            subHeaderAlign="center"
                            subHeaderWrap
                            sortServer
                            onSort={this._handleSort.bind(this)}/>
                    </div>
                </>}
            </section>
        </article>
    }
}

class CriterionFilter extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            criterionFilterText: "",
            selectedTypeOptions: null,
            selectedMandatoryOptions: null,
            selectedActiveOptions: null,
            hasFilters: false,
            loading: false,
            typeOptions: []
        }

        this.activeOptions = [
            {value: true, label: "Actif"},
            {value: false, label: "inactif"}
        ]
        this.mandatoryOptions = [
            {value: true, label: "Oui"},
            {value: false, label: "Non"}
        ]

        this._handleFilterSubmit = this._handleFilterSubmit.bind(this)
        this._handleClearFilter = this._handleClearFilter.bind(this)
        this._handleSelectChange = this._handleSelectChange.bind(this)
        this._handleTextInput = this._handleTextInput.bind(this)
        this._updateButtonState = this._updateButtonState.bind(this)
        this._getFilters = this._getFilters.bind(this)
    }

    componentDidMount() {
        Api.criterionType.getCriterionTypes().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({
                    typeOptions: _.map(resultObject, (o) => {
                        return {value: o.id, label: o.label}
                    })
                })
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
    }

    _getFilters() {
        let filters = {}
        // retrieves typed text
        if (this.state.criterionFilterText !== "") {
            filters.criterionFilterText = this.state.criterionFilterText
        }

        // retrieves selected types
        if (this.state.selectedTypeOptions !== null && Object.keys(this.state.selectedTypeOptions).length !== 0) {
            filters.criterionTypes = _.map(this.state.selectedTypeOptions, "value").join(",")
        }

        if (this.state.selectedActiveOptions !== null && Object.keys(this.state.selectedActiveOptions).length !== 0) {
            filters.active = this.state.selectedActiveOptions.value
        }

        if (this.state.selectedMandatoryOptions !== null && Object.keys(this.state.selectedMandatoryOptions).length !== 0) {
            filters.mandatory = this.state.selectedMandatoryOptions.value
        }

        this.setState(() => {
            return {hasFilters: Object.keys(filters).length !== 0}
        })

        return filters
    }

    _handleSelectChange(selectedOptions, name) {
        let property
        switch (name) {
            case "type" :
                property = "selectedTypeOptions"
                break
            case "active" :
                property = "selectedActiveOptions"
                break
            case "mandatory" :
                property = "selectedMandatoryOptions"
                break
            default:
                break
        }
        this.setState({[property]: selectedOptions})
    }

    _handleTextInput(e) {
        if (e.key === "Enter") {
            this._handleFilterSubmit()
        }
    }

    _handleFilterSubmit() {
        this.props.onFilter(this._getFilters, this._updateButtonState)
    }

    _handleClearFilter() {
        this.setState({
            criterionFilterText: "",
            selectedTypeOptions: [],
            selectedMandatoryOptions: [],
            selectedActiveOptions: [],
            hasFilters: false
        }, () => {
            this._handleFilterSubmit()
        })
    }

    _updateButtonState(isLoading = false) {
        this.setState({loading: isLoading})
    }

    render() {
        return <div className="bo-data-filters">
            <InputField className="input-tiny" name="criterionFilterText"
                        onKeyDown={this._handleTextInput}
                        value={this.state.criterionFilterText}
                        title="Texte à rechercher" context={this}>
                Texte à rechercher
            </InputField>

            <SelectField
                options={this.state.typeOptions}
                value={this.state.selectedTypeOptions}
                isMulti={true}
                closeMenuOnSelect={false}
                placeholder="Type de critère"
                onChange={v => this._handleSelectChange(v, "type")}
                context={this}
            />

            <SelectField
                options={this.mandatoryOptions}
                value={this.state.selectedMandatoryOptions}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Obligatoire"
                onChange={v => this._handleSelectChange(v, "mandatory")}
                context={this}
            />

            <SelectField
                options={this.activeOptions}
                value={this.state.selectedActiveOptions}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Status"
                onChange={v => this._handleSelectChange(v, "active")}
                context={this}
            />
            <div>
                <button type="button" className="btn default filterButton"
                        title="Filtrer les résultats"
                        disabled={this.state.loading}
                        onClick={this._handleFilterSubmit}>
                    <FontAwesomeIcon icon="fas fa-filter"/>
                </button>
                {this.state.hasFilters &&
                    <button type="button" className="btn warning resetButton"
                            title="Effacer les filtres"
                            onClick={this._handleClearFilter}>
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
 * @param orderby
 * @param order
 * @return {Promise<void>}
 */
async function getCriterionLines(page = 1, filters = null, callback = null, orderby = "shortName", order = "asc") {
    Helper.getDataTableLines.bind(this)(
        Api.criteria.getCriterion,
        {[`order[${orderby}]`]: order, "per_page": this.state.perPage},
        "criterion",
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
 * @param criteria {object}
 */
async function FormatRow(criteria) {
    const active = <ActiveSwitch objectActive={criteria.active} objectId={criteria.id}
                                 apiFunction={Api.criteria.updateCriteria} idPrefix="criteria-active"
                                 className="criterion-active-switch"
                                 disabled={this.state.auth === RIGHTS_READ}/>
    const mandatory = <ActiveSwitch objectActive={criteria.mandatory} objectId={criteria.id}
                                    apiFunction={Api.criteria.updateCriteria} idPrefix="criteria-mandatory"
                                    className="criterion-mandatory-switch" property="mandatory"
                                    disabled={this.state.auth === RIGHTS_READ}/>
    const shortName = <div className="criterion-specific">
        {criteria.shortName}
        {criteria.specific && <Tooltip title="Critère spécifique" arrow><MemoryIcon/></Tooltip>}
        {criteria.financial && <Tooltip title="Critère de financement" arrow><PaidIcon/></Tooltip>}
        {criteria.simulatorOnly && <Tooltip title="Critère simulateur uniquement" arrow><QuizIcon/></Tooltip>}
    </div>

    return {
        id: criteria.id,
        title: Helper.FormatClickableText(criteria.name, () => {
            this._displayModal("edit", criteria)
        }),
        shortName: shortName,
        type: Helper.FormatCriterionType(criteria),
        active: active,
        mandatory: mandatory
    }
}