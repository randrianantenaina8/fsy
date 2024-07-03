import React from "react"
import {Constants} from "fsy.common-library"
import HtmlStructure from "../HtmlStructure"
import "./errorPage.css"

export default function ErrorPage(props) {
    const {code, title, message} = props
    document.title = `${title} - ${Constants.DOCUMENT_TITLE_BACKOFFICE}`

    return <HtmlStructure menuName="error" sectionClassName="error-content">
        <div className="error-code">{code}</div>
        <div className="error-title">{title}</div>
        <div className="error-message">{message}</div>
    </HtmlStructure>
}