import React, {useEffect, useState} from "react"
import {Api, Roles, Session, Constants} from "fsy.common-library"
import {Loading} from "../general/form/Loading"
import moment from "moment"
import Helper from "../../services/Helper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DataTable from "react-data-table-component"
import {InputField} from "../general/form/Input"
import {SelectField} from "../general/form/Select"
import {toast} from "react-toastify"
import Modal from "../general/form/Modal"
import ReactSwitch from "react-switch"
import {UserForm} from "./UserForm"
import {TableWithFiltersSkeleton} from "../../services/LoadingHelper"
import {RIGHTS_READ, RIGHTS_WRITE} from "../../services/Constants"

import "./users.css"

export default class UserList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            searching: false,
            users: [],
            totalRows: 0,
            perPage: 10,
            changeStateUser: false,
            formType: "create",
            editingUser: null,
            userModalDisplay: false,
            modalModified: false,
            auth: Session.getAuth(Constants.PROFILE_USERMANAGEMENT)
        }
        this.handlePerRowsChange = this.handlePerRowsChange.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.refresh = this.refresh.bind(this)
        this.displayModal = this.displayModal.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleSubmitAfterConfirm = this.handleSubmitAfterConfirm.bind(this)
        this.updateModalModified = this.updateModalModified.bind(this)

        this.refSaveButton = React.createRef()
    }

    componentDidMount() {
        Api.user.getUserCount().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
        getUserLines.bind(this)(1)
    }

    componentDidUpdate() {
        if (this.state.changeStateUser) {
            getUserLines.bind(this)(this.state.page, getFilters())
            this.setState({changeStateUser: false})
        }
    }

    refresh() {
        this.setState({changeStateUser: true}, this.forceUpdate())
    }

    handlePerRowsChange(newPerPage, page) {
        this.setState({perPage: newPerPage, searching: true}, () => {
            getUserLines.bind(this)(page, getFilters())
        })
    }

    handlePageChange(page) {
        this.setState({searching: true}, () => {
            getUserLines.bind(this)(page, getFilters())
        })
    }

    handleFilter(filters, updateButtonStateFunction) {
        this.setState({searching: true})
        updateButtonStateFunction(true)

        Api.user.getUserCount(Helper.getFiltersUrlParams(filters)).then((response) => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })

        getUserLines.bind(this)(1, filters, updateButtonStateFunction)
    }

    handleSort(column, sortDirection) {
        getUserLines.bind(this)(this.state.page, this.state.filters, null, column.slug, sortDirection)
    }

    displayModal(type = "create", user = null) {
        this.setState({formType: type, editingUser: user, userModalDisplay: true})
    }

    handleModalClose() {
        this.setState({userModalDisplay: false, modalModified: false})
    }

    handleFormSubmit(success, message) {
        if (success) {
            getUserLines.bind(this)(1, getFilters())
            this.handleModalClose()
            toast.success(message, Helper.getToastOptions())
            this.setState({showModal: false})
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
            {name: "Nom", selector: row => row.name, sortable: true, width: "17vw", slug: "name"},
            {name: "Email", selector: row => row.mail, sortable: true, width: "17vw", slug: "email"},
            {name: "Organisme", selector: row => row.organization, width: "15vw"},
            {name: "Créé le", selector: row => row.creationDate, width: "7vw"},
            {name: "Profil attribué", selector: row => row.role, width: "15vw"},
            {name: "Etat", selector: row => row.active, width: "88px"},
            {name: "Date de l'état", selector: row => row.dateActive, width: "7vw"},
            {name: "Statut", selector: row => row.status, width: "6vw"}
        ]

        return <article className="users">

            <section className="bo-data-title">
                <h3>Utilisateurs</h3>
                {this.state.auth === RIGHTS_WRITE &&
                    <button
                        className={`btn btn-lg default addButton ${this.state.loading || this.state.searching ? "disabled" : ""}`}
                        title="Cliquer pour ajouter un utilisateur" onClick={() => this.displayModal()}>
                        <FontAwesomeIcon icon="fas fa-add"/> Ajouter un utilisateur
                    </button>
                }

                <Modal title={`${this.state.formType === "create" ? "Créer" : "Modifier"} un utilisateur`}
                       hide={this.handleModalClose}
                       isShowing={this.state.userModalDisplay}
                       confirm={this.state.modalModified} saveBeforeClose={this.handleSubmitAfterConfirm}>
                    <div className="user-form">
                        <UserForm
                            type={this.state.formType}
                            user={this.state.editingUser}
                            onSubmit={this.handleFormSubmit}
                            forwardRef={this.refSaveButton}
                            modalModify={this.updateModalModified}
                            readOnly={this.state.auth === RIGHTS_READ}/>
                    </div>
                </Modal>
            </section>

            <section className="bo-data-table card">
                {this.state.loading ? <TableWithFiltersSkeleton linesCount={13} filtersCount={4}/> : <>
                    <UserFilters onFilter={this.handleFilter}/>
                    <div className="bo-data-table-content">
                        {this.state.searching && <Loading/>}
                        <DataTable
                            columns={columns}
                            data={this.state.users}
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
                            className="usersTable"
                            subHeaderAlign="center"
                            subHeaderWrap
                            paginationPerPage={this.state.perPage}
                            sortServer
                            onSort={this.handleSort.bind(this)}/>
                    </div>
                </>}
            </section>

        </article>
    }
}

class UserFilters extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)
        this.state = {
            userFilterText: "",
            selectedStatusOptions: null,
            selectedActiveOptions: null,
            selectedProfile: null,
            hasFilters: false,
            loading: false,
            profileList: []
        }
        this.statusOptions = [{
            label: "statut", icon: "fa-list-check", options: [
                {value: false, label: "À valider"},
                {value: true, label: "Validé"}
            ]
        }]
        this.activeOptions = [{
            label: "état", icon: "fa-table-list", options: [
                {value: true, label: "Active"},
                {value: false, label: "Inactif"}
            ]
        }]

        this.handleFilterSubmit = this.handleFilterSubmit.bind(this)
        this.handleClearFilter = this.handleClearFilter.bind(this)
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.handleActiveChange = this.handleActiveChange.bind(this)
        this.handleProfileChange = this.handleProfileChange.bind(this)
        this.handleTextInput = this.handleTextInput.bind(this)
        this.updateButtonState = this.updateButtonState.bind(this)
        // eslint-disable-next-line no-func-assign
        getFilters = getFilters.bind(this)
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

    handleProfileChange(selectedOptions) {
        this.setState({
            selectedProfile: selectedOptions
        })
    }


    handleTextInput(e) {
        if (e.key === "Enter") {
            this.handleFilterSubmit()
        }
    }

    handleFilterSubmit() {
        //TODO: fix weird state when changing page, maybe by changing the way this function is called
        const filters = getFilters()
        this.props.onFilter(filters, this.updateButtonState)
    }

    handleClearFilter() {
        this.setState({
            userFilterText: "",
            selectedStatusOptions: [],
            selectedActiveOptions: [],
            selectedProfile: [],
            hasFilters: false
        }, () => {
            this.handleFilterSubmit()
        })
    }

    updateButtonState(isLoading = false) {
        this.setState({loading: isLoading})
    }

    componentDidMount() {
        Api.profile.getProfiles()
            .then((response) => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const profileList = resultObject.map(element => {
                        return {
                            label: element.label,
                            value: element.id
                        }
                    })
                    this.setState({profileList: profileList})
                }

                if (response?.status !== 200) {
                    toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
                }
            })
            .catch((e) => {
                // console.log('error', e)
            })
    }

    render() {
        return <div className="bo-data-filters">
            <InputField className="input-tiny users-text" name="userFilterText"
                        onKeyDown={this.handleTextInput}
                        value={this.state.userFilterText}
                        title="Texte à rechercher" context={this}>
                Texte à rechercher
            </InputField>
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
                options={this.state.profileList}
                value={this.state.selectedProfile}
                isMulti={false}
                closeMenuOnSelect={true}
                placeholder="Profil"
                onChange={this.handleProfileChange}
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
 * @param orderby {string}
 * @param order {string}
 * @return {Promise<void>}
 */
async function getUserLines(page = 1, filters = null, callback = null, orderby = "id", order = "desc") {
    let urlParams = {[`order[${orderby}]`]: order, "per_page": this.state.perPage}
    Helper.getDataTableLines.bind(this)(
        Api.user.getUsers,
        urlParams,
        "users",
        FormatRow,
        page,
        filters,
        callback
    ).then(()=>{
        this.setState({searching: false})
    })
}

/**
 * Create a jsx object that will be interpreted by the DataTable
 *
 * @param user {object}
 */
async function FormatRow(user) {
    let active, name, username = `${user.name} ${user.surname}`
    const currentUser = Session.getUser()

    if (user.email === currentUser.username || !Roles.isGranted(currentUser.roles[0], user.roles[0])) {
        active = Helper.FormatText(user.active ? "✔" : "x")
        name = Helper.FormatText(username)
    } else {
        name = Helper.FormatClickableText(username, () => this.displayModal("edit", user))
        active = <ActiveSwitch user={user} listeObj={this}
                               className="users-active-switch"
                               readOnly={this.state.auth === RIGHTS_READ}/>
    }

    return {
        id: user.id,
        name: name,
        mail: Helper.FormatText(user.email),
        creationDate: Helper.FormatText(moment(user.creationDate).format("DD/MM/YYYY HH:mm")),
        role: Helper.FormatText(user.profile.label),
        active: active,
        organization: Helper.FormatOrganization(user.organization),
        dateActive: Helper.FormatText(moment(user.activationDate).format("DD/MM/YYYY HH:mm")),
        status: <div className="badge-display">
            {user.status ? <span className="badge green">Validé</span> :
                <span className="badge red">À valider</span>
            }
        </div>
    }
}

/*
 * Create an object
 *
 * @return {object}
 */
function getFilters() {
    let filters = {}

    if (this.state.userFilterText !== "") {
        filters.userFilterText = this.state.userFilterText
    }

    if (this.state.selectedStatusOptions !== null && Object.keys(this.state.selectedStatusOptions).length !== 0) {
        filters.status = this.state.selectedStatusOptions.value
    }

    if (this.state.selectedActiveOptions !== null && Object.keys(this.state.selectedActiveOptions).length !== 0) {
        filters.active = this.state.selectedActiveOptions.value
    }

    if (this.state.selectedProfile !== null && Object.keys(this.state.selectedProfile).length !== 0) {
        filters.profiles = [this.state.selectedProfile.value]
    }

    this.setState(() => {
        return {hasFilters: Object.keys(filters).length !== 0}
    })

    return filters
}

/**
 * Return a switch component that update the question active state (question object passed in props)
 *
 * @param props {object}
 * @return {JSX.Element}
 */
function ActiveSwitch(props) {
    const [showModal, setShowModal] = useState(false)
    const [active, setActive] = useState(props.user.active)

    useEffect(() => {
        setActive(props.user.active)
    }, [setActive, props.user.active])

    const triggerHideModal = () => {
        setShowModal(false)
    }

    const handleChange = activeState => {
        if (activeState) {
            if (!props.user.status) {
                toast.error("Vous ne pouvez pas activer un utilisateur non validé", Helper.getToastOptions())
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
        Api.user.updateUser(
            props.user.id,
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
            id={`user-${props.user.id}`}
            onColor="#a6d290"
            offColor="#fc9999"
            onChange={handleChange}
            disabled={props.readOnly}/>


        <Modal title="Désactivation"
               hide={triggerHideModal}
               isShowing={showModal}>
            <div className="modal-body">
                Etes-vous sûr de vouloir désactiver l'utilisateur {props.user.name} {props.user.surname}?
            </div>
            <div className="modal-footer flex-end">
                <button className="btn" onClick={triggerHideModal}>Non</button>
                <button className="btn alert" onClick={handleConfirmDeactivate}>Oui</button>
            </div>
        </Modal>
    </>
}
