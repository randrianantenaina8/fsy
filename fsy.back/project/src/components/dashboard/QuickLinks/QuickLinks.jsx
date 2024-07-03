import React, {useState, useEffect} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import "./quickLinks.css"
import {Link} from "react-router-dom"
import {routes as Routing} from "../../../services/RoutesHelper"
import {Constants, Session} from "fsy.common-library"

export default function QuickLinks() {
    const [manageUser, setManageUser] = useState(false)
    const [simulator, setSimulator] = useState(false)
    const [aid, setAid] = useState(false)
    const [stat, setStat] = useState(false)

    useEffect(() => {
        const allAuth = Session.getAuth()
        setManageUser(allAuth[Constants.PROFILE_USERMANAGEMENT]>0)
        setSimulator(allAuth[Constants.PROFILE_SIMULATOR]>0)
        setAid(allAuth[Constants.PROFILE_AIDENTRY]>0 || allAuth[Constants.PROFILE_AIDVALIDATION]>0)
        setStat(allAuth[Constants.PROFILE_REPORTING]>0)
    }, [])

    return <article className="quickLinks">
        {manageUser &&
            <section className="quickLinks-user">
                <div className="links-container"><span>Utilisateurs <FontAwesomeIcon icon="fas fa-circle-chevron-down"/></span></div>
                <div className="user-links">
                    <Link to={Routing.bo_users} title="Consulter les utilisateurs">
                        <FontAwesomeIcon icon="fas fa-users"/>
                        <span>Gérer</span>
                    </Link>
                    <Link to={Routing.bo_profiles} title="Gérer les profiles">
                        <FontAwesomeIcon icon="fas fa-id-card"/>
                        <span>Profils</span>
                    </Link>
                </div>
            </section>
        }
        {simulator &&
            <section className="quickLinks-simulator">
                <div className="links-container"><span>Simulateur <FontAwesomeIcon icon="fas fa-circle-chevron-down"/></span></div>
                <div className="simulator-links">
                    <Link to={Routing.bo_simulator} title="Gérer les questions du simulateur">
                        <FontAwesomeIcon icon="fas fa-clipboard-question"/>
                        <span>Questions</span>
                    </Link>
                    <Link to={Routing.bo_simulations} title="Consulter les simulations">
                        <FontAwesomeIcon icon="fas fa-clipboard-question"/>
                        <span>Simulations</span>
                    </Link>
                </div>
            </section>
        }
        {aid &&
            <section className="quickLinks-aids">
                <div className="links-container"><span>Aides <FontAwesomeIcon icon="fas fa-circle-chevron-down"/></span></div>
                <div className="aids-links">
                    <Link to={Routing.bo_aid} title="Gérer les aides disponibles">
                        <FontAwesomeIcon icon="fa-regular fa-rectangle-list" />
                        <span>Liste</span>
                    </Link>
                    <Link to={Routing.bo_aid} title="Valider les aides en attente">
                        <FontAwesomeIcon icon="fa-solid fa-check-to-slot" />
                        <span>Validations</span>
                    </Link>
                </div>
            </section>
        }
        {stat &&
            <section className="quickLinks-challenge">
                <div className="links-container"><span>Statistiques <FontAwesomeIcon icon="fas fa-circle-chevron-down"/></span></div>
                <div className="challenge-links">
                    <Link to={Routing.bo_stats} title="Consulter les stats">
                        <FontAwesomeIcon icon="fas fa-chart-line"/>
                        <span>Consulter</span>
                    </Link>
                </div>
            </section>
        }
    </article>
}