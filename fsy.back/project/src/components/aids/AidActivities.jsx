import React from "react"
import {Api} from "fsy.common-library"
import Helper from "../../services/Helper"
import moment from "moment"

export class AidActivities extends React.Component {
    static defaultProps = {aidId: null}

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            activities: []
        }
    }

    componentDidMount() {
        Api.aid.getAidHistory(this.props.aidId).then(response => {
            const resultObject = Helper.isValidResponse(response)
            if (resultObject) {
                this.setState({activities: resultObject})
            }
            this.setState({loading: false})
        })
    }

    render() {
        return <>
            {(this.state.activities === null || this.state.activities.length === 0)
                ? <span>{this.state.loading ? "Chargement..." : "Aucune donnée disponible"}</span> :
                <div className="activities-list flex-start flex-column">
                    {this.state.activities.map(row => (
                        <div className="activities-item flex-start align-items-start" key={row.id}>
                            <div>{row.user}</div>
                            <div className="flex-start align-items-start flex-column">
                                <span className="activities-action">{row.action}</span>
                                <span className="activities-date">{moment(row.date).format("DD/MM/YYYY HH:mm")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    }
}
