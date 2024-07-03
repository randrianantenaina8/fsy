import React from "react"
import {NavLink} from "react-router-dom"
import {routes as Routing} from "../../services/RoutesHelper"


export default class SimulatorTabs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        // this.handleTabClick = this.handleTabClick.bind(this)
    }

    render() {
        return <article className="bo-tabs">
            <div className="bo-tabs-item">
                <NavLink to={Routing.bo_simulator} title="Gérer le simulateur">
                    <span>Simulateur</span>
                </NavLink>
            </div>
            <div className="bo-tabs-item">
                <NavLink to={Routing.bo_simulations} title="Consulter les simulations effectuées">
                    <span>Simulations</span>
                </NavLink>
            </div>
        </article>
    }
}