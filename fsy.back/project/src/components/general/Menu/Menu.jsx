import React from "react"
import {Constants, Roles, Session} from "fsy.common-library"
import {Link, NavLink} from "react-router-dom"
import "./menu.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {routes as Routing} from "../../../services/RoutesHelper"

export default class Menu extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.sessionUser = Session.getSessionUser()

        this.state = {
            isAuthenticated: Session.isLoggedIn(),
            user: this.sessionUser,
            display: {
                aid: false,
                criterion: false,
                simulator: false,
                organization: false,
                users: false,
                stats: false
            }
        }
    }

    componentDidMount(){
        const allAuth = Session.getAuth()
        this.setState({
            display: {
                aid: allAuth[Constants.PROFILE_AIDENTRY]>0 || allAuth[Constants.PROFILE_AIDVALIDATION]>0,
                criterion: allAuth[Constants.PROFILE_CRITERION]>0,
                simulator: allAuth[Constants.PROFILE_SIMULATOR]>0,
                organization: allAuth[Constants.PROFILE_ORGANIZATION]>0,
                users: allAuth[Constants.PROFILE_USERMANAGEMENT]>0,
                stats: allAuth[Constants.PROFILE_REPORTING]>0,
            }
        })
    }

    render() {
        return <aside className="menu">
            <div className="menu-title">
                <NavLink to={Routing.app_home} title="Retour à l'accueil">
                    <img src="/img/Logo-Fransylva-small.png" alt="Fransylva" title="Backoffice simulateur Fransylva"/>
                </NavLink>
            </div>

            <nav className="menu-nav" role="menu">
                {Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && DashboardMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.criterion) && CriterionMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.aid) && AidMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.simulator) && SimulatorMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.organization) && OrganizationMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.users) && UserMenu(this.props.nameMenu)}
                {(Roles.isGranted(this.state.user?.roles[0], Constants.ROLE_ADMIN) && this.state.display.stats) && StatsMenu(this.props.nameMenu)}
            </nav>
            <div className="menu-footer">
                <div className="menu-user" title={`Actuellement connecté en tant que ${this.state.user?.name}`}>
                    <span className="menu-user-name">
                        <FontAwesomeIcon icon="fas fa-circle-user"/> {this.state.user?.name}
                    </span>
                    <span className="menu-user-role"
                          title={this.state.user?.profile?.label}>{this.state.user?.profile?.trigram}</span>
                    <span className="menu-user-society">{this.state.user?.organization?.name}</span>
                    <Link to={Routing.app_logout} title="Déconnexion" className="menu-user-logout">
                        <FontAwesomeIcon icon="fas fa-arrow-right-from-bracket"/>
                    </Link>
                </div>
                <div className="menu-version">{process.env.REACT_APP_VERSION}</div>
            </div>
        </aside>
    }
}

function DashboardMenu(nameMenu) {
    return generateMenuItem(Routing.bo_dashboard, "fas fa-tachometer-alt", "Dashboard", (nameMenu === "dashboard"))
}

function UserMenu(nameMenu) {
    return generateMenuItem(Routing.bo_users, "fas fa-users", "Utilisateurs", (nameMenu === "users"))
}

function OrganizationMenu(nameMenu) {
    return generateMenuItem(Routing.bo_organizations, "fas fa-building-user", "Organismes", (nameMenu === "organizations"))
}

function SimulatorMenu(nameMenu) {
    return generateMenuItem(Routing.bo_simulator, "fas fa-list-check", "Simulateur", (nameMenu === "simulator"))
}

function AidMenu(nameMenu) {
    return generateMenuItem(Routing.bo_aid, "fas fa-folder-open", "Aides", (nameMenu === "aids"))
}

function CriterionMenu(nameMenu) {
    return generateMenuItem(Routing.bo_criterion, "fas fa-pen-to-square", "Critères", (nameMenu === "criterion"))
}

function StatsMenu(nameMenu) {
    return generateMenuItem(Routing.bo_stats, "fas fa-chart-line", "Stats", (nameMenu === "stats"))
}

function generateMenuItem(link, iconClassName, label, isActive = false, title = null) {
    const activeClass = isActive ? "active" : ""
    return <NavLink to={link} title={title ?? label} className={`menu-item ${activeClass}`} role="menuitem">
        <FontAwesomeIcon icon={iconClassName} className="menu-icon"></FontAwesomeIcon>
        <span className="menu-text">{label}</span>
    </NavLink>
}
