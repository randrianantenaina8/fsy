import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import moment from "moment-timezone"
import {Api, Session} from "fsy.common-library"
import Helper from "../../services/Helper"
import {toast} from "react-toastify"

import "./profileTable.css"

export default class ProfileTable extends React.Component {
    static defaultProps = {
        data: [],
        legend: false
    }

    constructor(props) {
        super(props)
        this.rights = {
            aidEntry: "Saisie des aides",
            aidValidation: "Validation des aides",
            aidSimulation: "Simulation d'aides",
            requestSupport: "Accompagnement des demandes",
            aidCatalog: "Catalogue d'aides (API)",
            reporting: "Reporting de suivi",
            userManagement: "Gestion des utilisateurs",
            criterion: "Gestion des critères",
            simulator: "Gestion du simulateur",
            organization: "Gestion des organismes"
        }
        this.state = {
            isUpdating: false,
            displayFeedback: false
        }
        this.dataToSave = {}
        this.lastDataChanged = null
        this.timer = null
        this.handleRightsChange = this.handleRightsChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.save = this.save.bind(this)
        this.displayModificationForm = this.displayModificationForm.bind(this)
    }

    componentDidMount() {
        // Check if we need to save form every 200ms
        this.timer = window.setInterval(() => {
            // launch save if :
            // there is data to save AND last changed was made since 0.8 seconds or more AND there is no update currently running
            if (!this.state.isUpdating &&
                moment().diff(this.lastDataChanged, "seconds") > 0.8 &&
                Object.keys(this.dataToSave).length !== 0
            ) {
                this.setState({isUpdating: true, displayFeedback: true})
                this.save()
            }
        }, 200)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleRightsChange(trigram, right, access) {
        this.dataToSave[trigram] = {...this.dataToSave[trigram], [right]: access}
        this.lastDataChanged = moment()
    }

    save() {
        // quickly copy and reset dataTosave object to avoid multiple calls
        const data = this.dataToSave
        this.dataToSave = {}
        Api.profile.updateProfiles(data).then((response) => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject?.updated) {
                this.setState({isUpdating: false}, () => {
                    window.setTimeout(() => {
                        // Hide confirmation message
                        this.setState({displayFeedback: false})
                    }, 1500)
                })
                Session.clearAuth();
            } else {
                toast.error("Oops ! Une erreur est survenue pendant la mise à jour. Actualisez, réessayez et avertissez l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
    }

    handleDelete(profile) {
        this.props.onDelete(profile)
    }

    displayModificationForm(profile) {
        this.props.onEdit(profile)
    }

    render() {
        let header = []
        for (const key in this.rights) {
            header = [...header, <div className="profileTable-head-left" key={key}>{this.rights[key]}</div>]
        }
        return <>
            {this.props.legend && <div className="profileTable-legend">
                Légende :
                <div className="profileTable-legend-noaccess">
                    <FontAwesomeIcon icon="fa-ban"/> Aucun accès
                </div>
                <div className="profileTable-legend-readaccess">
                    <FontAwesomeIcon icon="fa-eye"/> Accès en lecture
                </div>
                <div className="profileTable-legend-writeaccess">
                    <FontAwesomeIcon icon="fa-pen-to-square"/> Accès en écriture
                </div>
            </div>}
            <div className={`profileTable ${this.props.className}`}>
                <div className="profileTable-column">
                    <div className="profileTable-head-top profileTable-empty"></div>
                    {header}
                </div>
                {this.props.data.map((profile) => {
                    let contents = []
                    for (const key in this.rights) {
                        contents = [...contents, <div className="profileTable-content" key={key}>
                            <ProfileRights right={key} access={profile[key]}
                                       trigram={profile.trigram}
                                       onChange={this.handleRightsChange}
                                       readOnly={this.props.readOnly}/>
                        </div>]
                    }
                    return <div className="profileTable-column" key={profile.trigram}>
                        <div className="profileTable-head-top" title={profile.label}>
                            <span className="profileTable-title" title={"Modifier le profil: " + profile.label}
                                  onClick={() => this.displayModificationForm(profile)}>{profile.trigram}</span>
                            {!this.props.readOnly &&
                                <span className="profileTable-delete" title="Supprimer le profil"
                                    onClick={() => this.handleDelete(profile)}><FontAwesomeIcon
                                    icon="fa-trash"/></span>
                            }
                        </div>
                        {contents}
                    </div>
                })}
            </div>
            {this.state.displayFeedback &&
                <div className={`profileTable-loading ${this.state.isUpdating ? "working" : "valid"}`}>
                    {this.state.isUpdating &&
                        <><FontAwesomeIcon icon="fa-solid fa-circle-notch" spin={true}/> Synchronisation en cours</>}
                    {!this.state.isUpdating &&
                        <><FontAwesomeIcon icon="fa-solid fa-check-double"/> Modifications sauvegardées </>}
                </div>
            }
        </>
    }
}


class ProfileRights extends React.Component {
    static defaultProps = {
        right: "",
        access: 0,
        trigram: null,
        onChange: () => {
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            currentAccess: this.props.access
        }
        this.accessList = {
            0: {
                icon: "fa-ban",
                description: "Aucun accès",
                className: "profileTable-access--noaccess",
                nextAccess: 1
            },
            1: {
                icon: "fa-eye",
                description: "Accès en lecture",
                className: "profileTable-access--read",
                nextAccess: 2
            },
            2: {
                icon: "fa-pen-to-square",
                description: "Accès en écriture",
                className: "profileTable-access--write",
                nextAccess: 0
            }
        }
        this.nextAccess = this.nextAccess.bind(this)
    }

    nextAccess() {
        this.setState((prevState) => {
            return {currentAccess: this.accessList[prevState.currentAccess].nextAccess}
        }, () => {
            this.props.onChange(this.props.trigram, this.props.right, this.state.currentAccess)
        })


    }

    render() {
        return <div className={`profileTable-access ${this.accessList[this.state.currentAccess].className} ${this.props.readOnly ? 'disabled':''}`}
                    onClick={!this.props.readOnly?this.nextAccess:null} title={this.accessList[this.state.currentAccess].description}>
            <FontAwesomeIcon icon={this.accessList[this.state.currentAccess].icon}/>
        </div>
    }
}

