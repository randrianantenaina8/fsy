import React from "react"
import {Loading} from "./Loading"
import {SelectField} from "./Select"
import Helper from "../../../services/Helper"
import _ from "lodash"

export default class SelectWithData extends React.Component {
    static defaultProps = {
        isMulti: true,
        closeMenuOnSelect: false,
        selectType: "Default",
        placeholder: "Sélectionner une valeur",
        context: this,
        options: [{label: "Type", icon: "fa-list-check", options: []}],
        selected: 0,
        noPadding: false
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedOptions: [],
            loading: true
        }

        this.handleChange = this.handleChange.bind(this)
        this.loadOptions = this.loadOptions.bind(this)
        this.addOption = this.addOption.bind(this)

        this.options = this.props.options
    }

    componentDidMount() {
        (async function () {
            await this.loadOptions()
        }).bind(this)()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Useful when component has been already rendered when the "selected" props changed
        if (prevProps.selected !== this.props.selected) {
            const selectedOption = _.find(this.options[0].options, {value: this.props.selected})
            this.setState({
                selectedOptions: selectedOption
            })
        }
    }

    /* ---------------------- Load Types ---------------------- */
    async loadOptions() {
        const resultTypes = await this.props.apiFunction()
        const resultObject = Helper.isValidResponse(resultTypes)

        let option = []
        if (resultObject) {
            if (this.props.selectType === "Default") {
                resultObject.forEach((object) => {
                    option = this.addOption({value: object.id, label: `${object.name}`}, object.id, option)
                })
            }
            if (this.props.selectType === "Language") {
                resultObject.forEach((object) => {
                    option = this.addOption({
                        value: object.id,
                        label: `${object.code} | ${object.name}`
                    }, object.id, option)
                })
            }
        }

        if (!this.props.isMulti) {
            option = option[0] ?? []
        }
        this.setState({loading: false, selectedOptions: option})

    }

    addOption(value, objectId, option) {
        this.options[0].options.push(value)
        if (this.props.selected === objectId) {
            option.push(value)
        }
        return option
    }

    clearOptions() {
        this.setState({selectedOptions: []})
    }

    handleChange(selectedOptions) {
        this.setState({
            selectedOptions: selectedOptions
        })
        this.props.onChange(selectedOptions)
    }

    render() {
        let {className, isMulti, closeMenuOnSelect, noPadding} = this.props
        const paddingClass = noPadding ? "formField--nopadding" : ""
        return <div className={className}>
            {this.state.loading && <Loading/>}
            <SelectField
                className={`formField ${paddingClass}`}
                options={this.options}
                value={this.state.selectedOptions}
                isMulti={isMulti}
                closeMenuOnSelect={closeMenuOnSelect}
                placeholder={this.props.placeholder}
                onChange={this.handleChange}
                context={this.props.context}
            />
        </div>
    }

}
