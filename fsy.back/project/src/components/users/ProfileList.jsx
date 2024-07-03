import React from "react"
import {Api, Session, Constants} from "fsy.common-library"
import Helper from "../../services/Helper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import ProfileTable from "./ProfileTable"
import Modal from "../general/form/Modal"
import {ProfileForm} from "./ProfileForm"
import {toast} from "react-toastify"
import {TableSkeleton} from "../../services/LoadingHelper"
import {RIGHTS_READ, RIGHTS_WRITE} from "../../services/Constants"

import "./profiles.css"

export default class ProfileList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            profiles: [],
            formType: "create",
            editingProfile: null,
            profileModalDisplay: false,
            showDeleteModal: false,
            profileToDelete: null,
            auth: Session.getAuth(Constants.PROFILE_USERMANAGEMENT)
        }

        this._handleDelete = this._handleDelete.bind(this)
        this._displayModal = this._displayModal.bind(this)
        this._handleEdit = this._handleEdit.bind(this)
        this._handleFormSubmit = this._handleFormSubmit.bind(this)
        this._handleModalClose = this._handleModalClose.bind(this)
        this._hideDeleteModal = this._hideDeleteModal.bind(this)
        this._handleConfirmDelete = this._handleConfirmDelete.bind(this)
        this.handleSubmitAfterConfirm = this.handleSubmitAfterConfirm.bind(this)
        this.updateModalModified = this.updateModalModified.bind(this)

        this.refSaveButton = React.createRef()
    }

    componentDidMount() {
        this._updateList()
    }

    _updateList() {
        Api.profile.getProfiles().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({
                    profiles: resultObject,
                    loading: false
                })
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
    }

    _handleEdit(profile) {
        this.setState({editingProfile: profile})
        this._displayModal("edit", profile)
    }

    _handleFormSubmit(success, message) {
        if (success) {
            toast.success(message, Helper.getToastOptions())
            this._updateList()
            this._handleModalClose()
            return
        }
        toast.error(message, Helper.getToastOptions())
    }

    _displayModal(type = "create", profile = null) {
        this.setState({formType: type, editingProfile: profile, profileModalDisplay: true})
    }

    _handleModalClose() {
        this.setState({profileModalDisplay: false, modalModified: false})
    }

    _handleDelete(profile) {
        this.setState({
            showDeleteModal: true,
            profileToDelete: profile
        })
    }

    _hideDeleteModal() {
        this.setState({
            showDeleteModal: false,
            profileToDelete: null
        })
    }

    _handleConfirmDelete() {
        Api.profile.deleteProfile(this.state.profileToDelete.id)
            .then(response => {
                if (response.status === 200) {
                    toast.success("Profil supprimé", Helper.getToastOptions())
                    this._updateList()
                } else if (response.code === 400) {
                    toast.error(response.message, Helper.getToastOptions())
                }
            })
            .finally(() => {
                this.setState({
                    profileToDelete: null,
                    showDeleteModal: false
                })
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
        return <article className="profiles">

            <section className="bo-data-title">
                <h3>Profils utilisateurs</h3>

                {this.state.auth === RIGHTS_WRITE &&
                    <button className={`btn btn-lg default addButton ${this.state.loading ? "disabled" : ""}`}
                            title="Cliquer pour ajouter un nouveau profil" onClick={() => this._displayModal()}>
                        <FontAwesomeIcon icon="fas fa-add"/> Créer un profil
                    </button>
                }

                <Modal title={`${this.state.formType === "create" ? "Créer" : "Modifier"} un profil`}
                       hide={this._handleModalClose}
                       isShowing={this.state.profileModalDisplay}
                       confirm={this.state.modalModified} saveBeforeClose={this.handleSubmitAfterConfirm}>
                    <div className="profile-form">
                        <ProfileForm
                            type={this.state.formType}
                            profile={this.state.editingProfile}
                            onSubmit={this._handleFormSubmit}
                            forwardRef={this.refSaveButton}
                            modalModify={this.updateModalModified}/>
                    </div>
                </Modal>

                <Modal title="Suppression"
                       hide={this._hideDeleteModal}
                       isShowing={this.state.showDeleteModal}>
                    <div className="modal-body">
                        Etes-vous sûr de vouloir supprimer le
                        profil <strong>{this.state.profileToDelete?.trigram}</strong> - <strong>{this.state.profileToDelete?.label}</strong>?
                    </div>
                    <div className="modal-footer flex-end">
                        <button className="btn" onClick={this._hideDeleteModal}>Non</button>
                        <button className="btn alert" onClick={this._handleConfirmDelete}>Oui</button>
                    </div>
                </Modal>
            </section>

            <section className="bo-data-table card">
                <div className="bo-data-table-content">
                    {this.state.loading ? <TableSkeleton linesCount={11} size="large"/> :
                        <ProfileTable
                            data={this.state.profiles}
                            onEdit={this._handleEdit}
                            onDelete={this._handleDelete}
                            className=""
                            legend={true}
                            readOnly={this.state.auth === RIGHTS_READ}
                        />}
                </div>
            </section>
        </article>
    }
}


/* ================================== GLOBAL FUNCTIONS ================================== */
