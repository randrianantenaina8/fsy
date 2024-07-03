import {Constants} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import UserMenu from "./UserMenu/UserMenu"
import Activities from "./Activities/Activities"
import QuickLinks from "./QuickLinks/QuickLinks"
import Statistics from "./Statistics/Statistics"
import {GeneralParameters} from "./GeneralParameters/GeneralParameters"
import {useDate} from "../../hooks/customHooks"
import {routes as Routing} from "../../services/RoutesHelper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Link} from "react-router-dom"

import "./dashboard.css"

export default function Dashboard() {
    document.title = "Dashboard - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="Dashboard" sectionClassName="dashboard" auth="all">
        <DateTime/>
        <UserMenu/>
        <Activities/>
        <div className="dashboard-rightPanel">
            <Statistics/>
            <GeneralParameters/>
        </div>
        <QuickLinks/>
        <Helpcenter/>
    </HtmlStructure>
}

function DateTime() {
    const [currentDate] = useDate(10000) // 10s. interval
    return <>
        <div className="dashboard-datetime">
            <span className="dashboard-time">{currentDate.format("HH:mm")}</span>
            <span className="dashboard-date">{currentDate.format("dddd DD MMMM YYYY")}</span>
        </div>
    </>
}

function Helpcenter() {
    return <>
        <div className="dashboard-help">
            <h3>Centre d'aide</h3>
            <div>
                <Link to={Routing.bo_dashboard} title="Accéder à l'aide">
                    <FontAwesomeIcon icon="fas fa-circle-question"/>
                    <span>Aide</span>
                </Link>
                <Link to={Routing.bo_dashboard} title="Contacter le support">
                    <FontAwesomeIcon icon="fas fa-headset"/>
                    <span>Support</span>
                </Link>
                <Link to={Routing.bo_dashboard} title="Voir le changelog">
                    <FontAwesomeIcon icon="fas fa-file-contract"/>
                    <span>Changelog</span>
                </Link>
                <Link to={Routing.bo_dashboard} title="Accéder aux paramètres">
                    <FontAwesomeIcon icon="fas fa-cog"/>
                    <span>Paramètres</span>
                </Link>
            </div>
        </div>
    </>
}