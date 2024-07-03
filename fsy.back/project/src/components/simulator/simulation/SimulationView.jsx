import React from "react"
import "./simulationView.css"

export default class SimulationView extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {

        return <article className="simulationView">

            <section className="bo-data-title">
                <h3>Consultation d'une simulation</h3>
            </section>

            <section className="card">
                <h1>W.I.P</h1>
            </section>
        </article>
    }
}