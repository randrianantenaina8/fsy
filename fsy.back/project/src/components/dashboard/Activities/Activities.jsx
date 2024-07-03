import React from "react"
import {Api} from "fsy.common-library"
import moment from "moment"
import "./activities.css"
import Helper from "../../../services/Helper"
import {toast} from "react-toastify"
import {TableSkeleton} from "../../../services/LoadingHelper"
import {Chip} from "@mui/material"
import _ from "lodash"
import {
    LOG_API_ERROR,
    LOG_API_INFO,
    LOG_GENERAL_ERROR,
    LOG_GENERAL_INFO,
    LOG_USER_ACTION,
    LOG_USER_ERROR,
    LOG_WARNING
} from "fsy.common-library/lib/env/Constants"

export default class Activities extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            authorizedTypes: getTypes("all"),
            currentFilter: "all",
            counts: {"all": 0, "info": 0, "warning": 0, "alert": 0},
            logs: []
        }
        this._generateTableLines = this._generateTableLines.bind(this)
        this._filterList = this._filterList.bind(this)
        this._countByType = this._countByType.bind(this)
    }

    componentDidMount() {
        Api.log.getLogs("order[id]=desc").then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({logs: resultObject, isLoading: false, counts: this._countByType(resultObject)})
            }

            if (response?.status !== 200) {
                toast.error("Oops ! Une erreur est survenue pendant le chargement des logs. Réessayez et veuillez avertir l'administrateur si le problème persiste", Helper.getToastOptions())
            }
        })
    }

    _countByType(list) {
        let counts = {"all": 0, "info": 0, "warning": 0, "alert": 0}
        counts.all = _.filter(list, function (l) {
            return _.includes(getTypes("all"), l.type)
        }).length
        counts.info = _.filter(list, function (l) {
            return _.includes(getTypes("info"), l.type)
        }).length
        counts.warning = _.filter(list, function (l) {
            return _.includes(getTypes("warning"), l.type)
        }).length
        counts.alert = _.filter(list, function (l) {
            return _.includes(getTypes("alert"), l.type)
        }).length

        return counts
    }

    _filterList(filter) {
        this.setState({authorizedTypes: getTypes(filter), currentFilter: filter})
    }

    _generateTableLines() {
        if (this.state.logs)
            return this.state.logs.map(l => {
                if (this.state.authorizedTypes.includes(l.type)) {
                    const date = moment(l.timeStamp).format("DD/MM/YYYY HH:mm")
                    const userInfo = (l.user !== null) ? `${l.user}` : "/"
                    const errorClass = l.type.endsWith("_error") ? "log-error" : (l.type.endsWith("_warning") ? "log-warning" : "")
                    return <tr key={l.id} data-id={l.id} className={errorClass}>
                        <td>{date}</td>
                        <td>{l.type}</td>
                        <td>{userInfo}</td>
                        <td>{l.info}</td>
                    </tr>
                }
                return null
            })
    }

    render() {
        const tableLines = this._generateTableLines()
        return <article className="activity">
            <h3>Activités (logs)</h3>
            <section className="activity-table card">
                <div className="activity-filters">
                    <Chip variant={`${this.state.currentFilter === "all" ? "filled" : "outlined"}`} size="small"
                          color="success" onClick={() => this._filterList("all")}
                          label={`Toutes (${this.state.counts.all})`}/>
                    <Chip variant={`${this.state.currentFilter === "info" ? "filled" : "outlined"}`} size="small"
                          color="info" onClick={() => this._filterList("info")}
                          label={`Informations (${this.state.counts.info})`}/>
                    <Chip variant={`${this.state.currentFilter === "warning" ? "filled" : "outlined"}`} size="small"
                          color="warning" onClick={() => this._filterList("warning")}
                          label={`Avertissements (${this.state.counts.warning})`}/>
                    <Chip variant={`${this.state.currentFilter === "alert" ? "filled" : "outlined"}`} size="small"
                          color="error" onClick={() => this._filterList("alert")}
                          label={`Erreurs (${this.state.counts.alert})`}/>
                </div>

                <div className="activity-table-content">
                    {this.state.isLoading ? <TableSkeleton linesCount={18} size="small"/> :
                        <table>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Utilisateur</th>
                                <th>Message</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableLines}
                            </tbody>
                        </table>
                    }
                </div>
            </section>
        </article>
    }

}

function getTypes(filter) {
    let types = []
    switch (filter) {
        case "all":
            types = [
                LOG_USER_ERROR, LOG_USER_ACTION, LOG_API_INFO, LOG_API_ERROR, LOG_GENERAL_INFO, LOG_GENERAL_ERROR, LOG_WARNING
            ]
            break
        case "info":
            types = [LOG_USER_ACTION, LOG_API_INFO, LOG_GENERAL_INFO]
            break
        case "warning":
            types = [LOG_WARNING]
            break
        case "alert":
            types = [LOG_USER_ERROR, LOG_API_ERROR, LOG_GENERAL_ERROR]
            break
        default:
            break
    }
    return types
}