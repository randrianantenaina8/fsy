import React from "react"
import {Constants} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import "./stats.css"

export default function StatsPage() {
    document.title = "Statistiques - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="stats" sectionClassName="stats" auth={[Constants.PROFILE_REPORTING]}>
        <Stats/>
    </HtmlStructure>
}

class Stats extends React.Component {
    static defaultProps = {}

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {

        return <article className="stats">

            <section className="bo-data-title">
                <h3>Statistiques</h3>
            </section>

            <section className="card">
                <h1>W.I.P</h1>
            </section>
        </article>
    }
}


/* ================================== GLOBAL FUNCTIONS ================================== */
