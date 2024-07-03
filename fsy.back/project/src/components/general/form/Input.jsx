import React from "react"
import "./input.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

class InputField extends React.Component {
    static defaultProps = {
        onChange: null,
        onFocus: null,
        onBlur: null,
        onKeyDown: null,
        required: false,
        disabled: "",
        readOnly: "",
        placeholder: "",
        center: false,
        isFocused: false,
        pattern: null,
        value: "",
        forwardedRef: null,
        type: "text",
        title: "",
        name: "",
        inputStyle: "classic", //or "futurist"
        className: ""
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleKeyDown(e) {
        //TODO: change code here if needed
    }

    getFocus(e) {
        e.target.classList.add("formField--focused")
    }

    looseFocus(e) {
        const element = e.target
        if (element.value === "") {
            element.classList.remove("formField--focused")
        }
    }

    render() {
        const currentContext = this.props.context ?? this
        let attributes = {
            id: this.props.name,
            name: this.props.name,
            title: this.props.title,
            className: `${this.props.isFocused ? "formField--focused" : ""} ${this.props.disabled ? "disabled" : ""} ${this.props.center ? "center" : ""}`,
            type: this.props.type,
            ref: this.props.forwardedRef,
            value: this.props.value,
            onChange: this.props.onChange ?? this.handleChange.bind(currentContext),
            onFocus: this.getFocus.bind(currentContext),
            onBlur: this.looseFocus.bind(currentContext),
            onKeyDown: this.props.onKeyDown ?? this.handleKeyDown.bind(currentContext),
            required: this.props.required,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
            placeholder: this.props.placeholder
        }
        if (this.props.pattern !== null) {
            attributes.pattern = this.props.pattern
        }

        return <div
            className={`formField formField-input formField-style-${this.props.inputStyle} ${this.props.className}`}>
            <input {...attributes}></input>
            <label htmlFor={this.props.name}>{this.props.children} {this.props.required && <Requiredstar/>}</label>
            <span className="formField-underline"></span>
        </div>
    }
}

class TextareaField extends React.Component {
    static defaultProps = {
        onChange: null,
        onFocus: null,
        onBlur: null,
        onKeyDown: null,
        required: false,
        disabled: "",
        readOnly: "",
        placeholder: "",
        center: false,
        value: "",
        ref: null,
        title: "",
        name: "",
        inputStyle: "classic", //or "futurist"
        className: "",
        rows: 1,
        cols: 1
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleKeyDown(e) {
        //TODO: change code here if needed
    }

    getFocus(e) {
        e.target.classList.add("formField--focused")
    }

    looseFocus(e) {
        const element = e.target
        if (element.value === "") {
            element.classList.remove("formField--focused")
        }
    }


    render() {
        const currentContext = this.props.context ?? this
        let attributes = {
            id: this.props.name,
            name: this.props.name,
            title: this.props.title,
            className: `${this.props.isFocused ? "formField--focused" : ""} ${this.props.disabled ? "disabled" : ""} ${this.props.center ? "center" : ""}`,
            type: this.props.type,
            ref: this.props.forwardedRef,
            value: this.props.value,
            onChange: this.props.onChange ?? this.handleChange.bind(currentContext),
            onFocus: this.getFocus.bind(currentContext),
            onBlur: this.looseFocus.bind(currentContext),
            onKeyDown: this.props.onKeyDown ?? this.handleKeyDown.bind(currentContext),
            required: this.props.required,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
            placeholder: this.props.placeHolder,
            rows: this.props.rows,
            cols: this.props.cols
        }
        return <div
            className={`formField formField-textarea formField-style-${this.props.inputStyle} ${this.props.className}`}>
            <textarea {...attributes}></textarea>
            <label htmlFor={this.props.name}>{this.props.children} {this.props.required && <Requiredstar/>}</label>
            <span className="formField-underline"></span>
        </div>
    }
}

const Requiredstar = ({style}) => {
    return <div className="required-star" style={style}><FontAwesomeIcon icon="fas fa-star-of-life"></FontAwesomeIcon>
    </div>
}

const RequiredText = () => {
    return <div className="required-text"><FontAwesomeIcon icon="fas fa-star-of-life"></FontAwesomeIcon> Champs
        obligatoires</div>
}

export {
    InputField, TextareaField, Requiredstar, RequiredText
}