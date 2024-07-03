import React from "react";
import {Link, Navigate} from "react-router-dom";
import {routes as Routing} from "../../services/RoutesHelper";

export class CountDown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timer: 3,
            redirect: false
        }

        const interval = setInterval(() => {
            if (this.state.timer) {
                this.setState({
                    timer: (this.state.timer - 1)
                })

                if (this.state.timer === 1) {
                    clearInterval(interval)
                    this.setState({
                        redirect: true
                    })
                }
            }
        }, 1000);
    }

    render() {
        return <React.Fragment>
            <p className="login-notification">{this.props.message}</p>
            <p style={{textAlign: "center"}}>
                Vous serez redirigé vers la page du login dans <span
                style={{display: 'inline-block', width: '8px'}}>{this.state.timer}</span> secondes.
                <br/>
                <br/>
                <Link to={Routing.app_login}>Cliquez
                    ici si la redirection ne fonctionne pas</Link>
            </p>
            {this.state.redirect && <Navigate to="/login"/>}
        </React.Fragment>
    }
}
