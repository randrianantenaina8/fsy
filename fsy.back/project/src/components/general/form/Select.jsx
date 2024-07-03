import React from "react"
import ReactSelect from "react-select"
import CreatableSelect from "react-select/creatable"
import {Requiredstar} from "./Input"

import "./select.css"

class SelectField extends React.Component {
    static defaultProps = {
        onChange: null,
        onCreateOption: null,
        isClearable: true,
        creatable: false,
        formatGroupLabel: null,
        optionFocusedBackground: "#bad6c1",
        optionActiveBackground: "#bad6c1",
        classNamePrefix: "reactSelect-custom",
        formatCreateLabel: "Créer :",
        createOptionPosition: "last"
    }

    constructor(props) {
        super(props)
        this._formatGroupLabel = this._formatGroupLabel.bind(this)
        this._handleSelectChange = this._handleSelectChange.bind(this)
        this._handleSelectChange = this._handleSelectChange.bind(this)
        this._handleOptionCreation = this._handleOptionCreation.bind(this)
    }

    _formatGroupLabel(data) {
        let icon = data.icon ?? "fa-user"
        return <div className="reactSelect-custom__groupe">
            <span><i className={`fas ${icon}`}/> {data.label}</span>
            <span className="reactSelect-custom__groupeBadge">{data.options.length}</span>
        </div>
    }

    _handleSelectChange(selectedOptions) {
        this.setState({
            data: selectedOptions
        })
    }

    _handleOptionCreation(option) {
        console.log("New option : " + option)
    }

    render() {
        const {className, value} = this.props

        const selectStyle = {
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused || state.isSelected ? this.props.optionFocusedBackground : undefined,
                ":active": {backgroundColor: this.props.optionActiveBackground}
            })
        }

        const uniqueId = `select-${Math.floor(Math.random() * 1000000000000)}`
        const valuetext = !value || (Array.isArray(value) && value.length === 0) ? "" : value

        let componentProps = {
            // "key": `unique_select_key__${JSON.stringify(value)}`,
            className: className,
            classNamePrefix: this.props.classNamePrefix,
            onChange: this.props.onChange ?? this._handleSelectChange,
            options: this.props.options,
            value: valuetext,
            isMulti: this.props.isMulti,
            isDisabled: this.props.isDisabled,
            isClearable: this.props.isClearable,
            closeMenuOnSelect: this.props.closeMenuOnSelect,
            formatGroupLabel: this.props.formatGroupLabel ?? this._formatGroupLabel,
            styles: selectStyle,
            "aria-label": "Selector",
            required: this.props.required,
            placeholder: this.props.placeholder.toUpperCase() + (this.props.required ? " *" : ""),
            inputId: uniqueId
        }
        if(this.props.creatable){
            componentProps = {
                ...componentProps,
                onCreateOption: this.props.onCreateOption ?? this._handleOptionCreation,
                formatCreateLabel: input => `${this.props.formatCreateLabel} "${input}"`,
                createOptionPosition: this.props.createOptionPosition
            }
        }

        return <div className={`select-wrapper${valuetext !== "" ? " not-empty" : ""}`}>
            {this.props.creatable ? <CreatableSelect {...componentProps}/> : <ReactSelect {...componentProps}/>}
            {this.props.placeholder &&
                <label className="select-label" htmlFor={uniqueId}>
                    {this.props.placeholder} {this.props.required && <Requiredstar/>}
                </label>
            }
        </div>
    }
}

export {SelectField}