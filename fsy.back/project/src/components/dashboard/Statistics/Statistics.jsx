import React, {useEffect, useState} from "react"
import "./statistics.css"
import {Link} from "react-router-dom"
import {routes as Routing} from "../../../services/RoutesHelper"
import {Api, Constants, Session} from "fsy.common-library"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {TextSkeleton} from "../../../services/LoadingHelper"

export default function Statistics() {
    const [response, setResponse] = useState(null)
    const [manageUser, setManageUser] = useState(false)
    const [aid, setAid] = useState(false)
    const [criterion, setCriterion] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Api.statistics.getStatistics().then((r) => {
            setResponse(r?.data)
            setLoading(false)
        })

        const allAuth = Session.getAuth()
        setManageUser(allAuth[Constants.PROFILE_USERMANAGEMENT] > 0)
        setAid(allAuth[Constants.PROFILE_AIDENTRY] > 0 || allAuth[Constants.PROFILE_AIDVALIDATION] > 0)
        setCriterion(allAuth[Constants.PROFILE_CRITERION] > 0)
    }, [])


    return <article className="dashboard-stats">
        <h3>Statistiques</h3>
        <section className="stats-list card">
            {manageUser &&
                <div className="stats-item">
                    <FontAwesomeIcon icon="fas fa-user"/>
                    {loading ? <TextSkeleton/> :
                        <Link to={Routing.bo_users} title="Voir les utilisateurs">
                            <span className="stats-value">{response?.userCount}</span> Utilisateurs
                        </Link>
                    }
                </div>
            }
            <div className="stats-item">
                <FontAwesomeIcon icon="fas fa-clipboard-question"/>
                {loading ? <TextSkeleton/> :
                    <Link to={Routing.bo_simulations} title="Voir les simulations">
                        <span className="stats-value">{response?.simulationCount}</span> Simulations effectuées
                    </Link>
                }
            </div>
            {aid &&
                <div className="stats-item">
                    <FontAwesomeIcon icon="fas fa-newspaper"/>
                    {loading ? <TextSkeleton/> :
                        <Link to={Routing.bo_aid} title="Voir les aides disponibles">
                            <span className="stats-value">{response?.aidCount}</span> Aides disponibles
                        </Link>
                    }
                </div>
            }
            {criterion &&
                <div className="stats-item">
                    <FontAwesomeIcon icon="fas fa-edit"/>
                    {loading ? <TextSkeleton/> :
                        <Link to={Routing.bo_criterion} title="Voir les critères">
                            <span className="stats-value">{response?.criterionCount}</span> Critères
                        </Link>
                    }
                </div>
            }
        </section>
    </article>

}