import React from "react"
import {ButtonPrimary} from "../general/Button"
import {NavLink} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

export class UserPoints extends React.Component {
    static defaultProps = {
        user: null
    }

    constructor(props) {
        super(props)

        this.state = {
            currentPoints: 0
        }
    }

    componentDidMount() {
        this.setState({
            currentPoints: this.props.user.points
        })
    }

    render() {
        return <div className="user-points">
            {/*Todo: redirect to history page*/}
            <NavLink to="/game" title="Accéder à l'historique">
                <ButtonPrimary type="button" name="pointsButton">
                    <FontAwesomeIcon icon={`fas fa-star`}/>
                </ButtonPrimary>
                <div className="user-currentPoints">{this.state.currentPoints} points</div>
            </NavLink>
        </div>
    }
}