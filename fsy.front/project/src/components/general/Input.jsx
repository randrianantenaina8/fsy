import React from "react"
import "./input.css"

class InputField extends React.Component {

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
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
        const {type, children, name, value, title, context, onChange, forwardedRef, required, placeHolder} = this.props
        const currentContext = context ?? this
        const inputType = type ?? "text"
        const placeHolderText = placeHolder ?? ''
        // eslint-disable-next-line no-unused-vars
        const isRequired = required ? "required" :"" //todo: use this required props
        const onInputChange = onChange ?? this.handleChange.bind(currentContext)
        return <div className={"formField formField-input"}>
            <input type={inputType} id={name} name={name} title={title}
                   ref={forwardedRef} value={value} placeholder={placeHolderText}
                   onChange={onInputChange} onFocus={this.getFocus.bind(currentContext)}
                   onBlur={this.looseFocus.bind(currentContext)}></input>
            <label htmlFor={name}>{children}</label>
            <span className={"formField-underline"}></span>
        </div>
    }
}

class TextareaField extends React.Component {

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
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
        const {children, name, value, title, rows, cols, context} = this.props
        return <div className={"formField formField-textarea"}>
            <textarea id={name} name={name} title={title} rows={rows} cols={cols}
                      value={value} onChange={this.handleChange.bind(context)} onFocus={this.getFocus.bind(context)}
                      onBlur={this.looseFocus.bind(context)}></textarea>
            <label htmlFor={name}>{children}</label>
            <span className={"formField-underline"}></span>
        </div>
    }
}

export {
    InputField, TextareaField
}