import React from "react"
import {NavLink} from "react-router-dom"
import {routes as Routing} from "../../services/RoutesHelper"


export default class UserTabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        // this.handleTabClick = this.handleTabClick.bind(this)
    }

    render() {
        return <article className="bo-tabs">
            <div className="bo-tabs-item">
                <NavLink to={Routing.bo_users} title="Gérer les utilisateurs">
                    <span>Utilisateurs</span>
                </NavLink>
            </div>
            <div className="bo-tabs-item">
                <NavLink to={Routing.bo_profiles} title="Gérer les profiles">
                    <span>Profils</span>
                </NavLink>
            </div>
        </article>
    }
}