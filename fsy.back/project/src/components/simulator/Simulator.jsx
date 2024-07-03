import React from "react"
import {Constants} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import {SimulatorList} from "./simulator/SimulatorList"
import SimulatorTabs from "./SimulatorTabs"
import QuestionForm from "./simulator/question/QuestionForm"
import SimulationList from "./simulation/SimulationList"
import SimulationView from "./simulation/SimulationView"

import "./simulator.css"

export function SimulatorPage() {
    return createSimulatorSubPage("Simulateur - ", "simulator", SimulatorList)
}

export function SimulatorEditPage(props) {
    return createSimulatorSubPage("Détails simulateur - ", "simulatorForm", QuestionForm, false, props)
}

export function SimulationsPage() {
    return createSimulatorSubPage("Simulations - ", "simulations", SimulationList)
}

export function SimulationViewPage(props) {
    return createSimulatorSubPage("Consultation d'un simulation - ", "simulationView", SimulationView, false, props)
}


function createSimulatorSubPage(titleString, sectionClassName, Component, withTabs = true, props) {
    document.title = titleString + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="simulator" sectionClassName={`${sectionClassName} bo-with-tabs`} auth={[Constants.PROFILE_SIMULATOR]}>
        {withTabs && <SimulatorTabs/>}
        <Component {...props}/>
    </HtmlStructure>

}