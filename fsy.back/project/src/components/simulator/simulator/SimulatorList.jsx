import React from "react"
import {Api, Constants, Session} from "fsy.common-library"
import Helper from "../../../services/Helper"
import {toast} from "react-toastify"
import ActiveSwitch from "../../general/form/ActiveSwitch"
import {Loading} from "../../general/form/Loading"
import DataTable from "react-data-table-component"
import moment from "moment"
import _ from "lodash"

import "./simulatorList.css"
import {RIGHTS_READ} from "../../../services/Constants"

export class SimulatorList extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            simulators: [],
            totalRows: 0,
            perPage: 10,
            auth: Session.getAuth(Constants.PROFILE_SIMULATOR)
        }

        this._handlePerRowsChange = this._handlePerRowsChange.bind(this)
        this._handlePageChange = this._handlePageChange.bind(this)
        this._handleVersionClicked = this._handleVersionClicked.bind(this)
    }

    componentDidMount() {
        Api.simulator.getSimulatorsCount().then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({totalRows: resultObject.count})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des informations. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
        getSimulatorLines.bind(this)(1)
    }

    _handlePerRowsChange(newPerPage, page) {
        this.setState({perPage: newPerPage, loading: true}, () => {
            getSimulatorLines.bind(this)(page)
        })
    }

    _handlePageChange(page) {
        this.setState({loading: true}, () => {
            getSimulatorLines.bind(this)(page)
        })
    }

    _handleVersionClicked(version) {
        console.log(version)
    }

    render() {
        const columns = [
            {name: "Identifiant", selector: row => row.id, sortable: true, center: true, width: "7vw"},
            {name: "Version", selector: row => row.version, sortable: true, center: true, width: "10vw"},
            {name: "Origine", selector: row => row.origin, center: true, width: "10vw"},
            {name: "Nombre d'étapes", selector: row => row.steps, center: true, width: "10vw"},
            {name: "Nombre de questions", selector: row => row.questions, center: true, width: "10vw"},
            {name: "Créé par", selector: row => row.createdBy, center: true, width: "15vw"},
            {name: "Créé le", selector: row => row.createdAt, center: true, width: "15vw"},
            {name: "Publié", selector: row => row.published, sortable: false, center: true, width: "7vw"}
        ]

        return <article className="simulator">

            <section className="bo-data-title">
                <h3>Versions du simulateur</h3>
            </section>

            <section className="bo-data-table card">
                <div className="bo-data-table-content">
                    {this.state.loading && <Loading/>}
                    <DataTable
                        columns={columns}
                        data={this.state.simulators}
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
                        className="simulatorTable"
                        subHeaderAlign="center"
                        subHeaderWrap/>
                </div>
            </section>
        </article>
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
async function getSimulatorLines(page = 1, filters = null, callback = null) {
    Helper.getDataTableLines.bind(this)(
        Api.simulator.getSimulators,
        {"order[id]": "asc", "per_page": this.state.perPage},
        "simulators",
        FormatRow,
        page,
        filters,
        callback
    )
}

/**
 * Create a jsx object that will be interpreted by the DataTable
 *
 * @param simulator {object}
 */
async function FormatRow(simulator) {
    const published = <ActiveSwitch objectActive={simulator.published} objectId={simulator.id}
                                    apiFunction={Api.simulator.updateSimulator} idPrefix="simulator-active"
                                    className="simulator-active-switch"
                                    disabled={this.state.auth === RIGHTS_READ}/>

    return {
        id: simulator.id,
        version: Helper.FormatClickableText(`Version ${simulator.versionNumber}`, () => {
            this._handleVersionClicked(simulator)
        }),
        origin: Helper.FormatText((simulator.parent !== null) ? `version ${simulator.parent?.versionNumber}` : "/"),
        steps: Helper.FormatText(simulator.steps.length + ""),
        questions: Helper.FormatText(countQuestions(simulator.steps)),
        createdBy: Helper.FormatText(`${simulator.createdBy.name} ${simulator.createdBy.surname} (${simulator.createdBy.organization.name})`),
        createdAt: Helper.FormatText(moment(simulator.createdAt).format("DD-MM-YYYY HH:mm")),
        published: published
    }
}

function countQuestions(steps) {
    let counter = 0
    _.each(steps, (s) => {
        counter += s.questions.length
    })
    return counter
}