import React from "react"
import "./button.css"

class ButtonPrimary extends React.Component {

    handleClick() {
        // console.log("button clicked")
    }

    handleHover() {
        // console.log("button hover")
    }

    render() {
        let {type, className, name, title, context, onClick, onMouseEnter, children, disabled} = this.props

        type = type ?? "button"
        onClick = onClick ?? this.handleClick.bind(context)
        onMouseEnter = onMouseEnter ?? this.handleHover.bind(context)
        className = className ?? ""

        return <button type={type} className={`neoButton-primary ${className}`}
                       name={name} title={title} onClick={onClick} onMouseEnter={onMouseEnter} disabled={disabled}>
            {children}
        </button>
    }
}

export {
    ButtonPrimary
}