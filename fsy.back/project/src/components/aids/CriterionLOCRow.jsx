import React from "react"
import Helper from "../../services/Helper"
import {SelectField} from "../general/form/Select";
import {Api, Constants} from "fsy.common-library";
import _ from "lodash";
import {Requiredstar} from "../general/form/Input";

class CriterionLOCRow extends React.Component {
    static defaultProps = {
        onChange: () => {
        },
        requiredFields: false,
        key: Helper.generateUUID(),
        criterion: null,
        readOnly: false,
        aidCriterions: null
    }

    constructor(props) {
        super(props)

        let locationTypeOptions = [{
            label: "Type de localisation", icon: "fa-list-check", options: [
                {value: Constants.LOCATION_TYPE_NATIONAL, label: "Nationale"},
                {value: Constants.LOCATION_TYPE_REGIONAL, label: "Régionale"},
                {value: Constants.LOCATION_TYPE_DEPARTMENTAL, label: "Départementale"}
            ]
        }]

        let locationTypeValue = [];
        if (props.aidCriterions[props.criterion.id]) {
            locationTypeValue = locationTypeOptions[0].options.filter(element => element.value === props.aidCriterions[props.criterion.id].value.type);
        }

        this.state = {
            criterion: props.criterion,
            aidCriterions: props.aidCriterions,
            locationTypeOptions: locationTypeOptions,
            regionOptions: [],
            departmentOptions: [],
            locationValueOptions: [],
            locationTypeValue: locationTypeValue.length ? locationTypeValue[0] : "",
            value: "",
            visible: false,
            showError: false
        }

        this.handleLocationTypeChange = this.handleLocationTypeChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        (async function () {
            await Api.region.getRegions().then(response => {
                const resultObject = Helper.isValidResponse(response)
                if (resultObject) {
                    // Format and add regions in the correct group (see: state.regionsOptions declaration)
                    let regionOptions = [
                        {label: "Régions", icon: "fa-earth-europe", options: []},
                        {label: "Régions personnalisées", icon: "fa-user-pen", options: []}
                    ]
                    _.forEach(resultObject, r => {
                        regionOptions[r.custom ? 1 : 0].options.push(this.formatOptions(r))
                    })
                    // Save region values
                    this.setState({regionOptions: regionOptions}, () => this.initState())
                }
            })
            await Api.department.getDepartments().then(response => {
                const resultObject = Helper.isValidResponse(response)
                if (resultObject) {
                    let departmentOptions = [
                        {label: "Départements", icon: "fa-earth-europe", options: []}
                    ]
                    _.forEach(resultObject, r => {
                        departmentOptions[0].options.push(this.formatOptions(r))
                    })
                    // Save department values
                    this.setState({departmentOptions: departmentOptions}, () => this.initState())
                }
            })
        }).bind(this)()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.checkField !== prevProps.checkField && this.props.checkField) {
            const criterion = this.state.criterion
            this.setState({
                showError: criterion.mandatory && (!this.state.locationTypeValue ||
                    (this.state.locationTypeValue && this.state.locationTypeValue.value !== Constants.LOCATION_TYPE_NATIONAL
                        && !this.state.value))
            }, () => {

            });
        }
    }

    initState = () => {
        if (this.state.locationTypeValue) {
            let value;
            if (this.props.aidCriterions[this.props.criterion.id]) {
                value = this.props.aidCriterions[this.props.criterion.id].value.answer
            }
            this.setLocationValueOptions(this.state.locationTypeValue.value, value)
        }
    }

    handleLocationTypeChange = (locationTypeValue) => {
        this.setState({
            locationTypeValue: locationTypeValue
        }, () => {
            this.setAidCriterionValue(locationTypeValue, locationTypeValue && locationTypeValue.value === Constants.LOCATION_TYPE_NATIONAL ? {value: null} : null)
            this.setLocationValueOptions(locationTypeValue ? locationTypeValue.value : '')
        })
    }

    handleChange = (locationValue) => {
        this.setAidCriterionValue(this.state.locationTypeValue, locationValue)
    }

    setAidCriterionValue = (locationTypeValue, locationValue) => {
        const criterion = this.state.criterion
        const aidCriterions = this.state.aidCriterions

        if (typeof aidCriterions[criterion.id] === "undefined") {
            aidCriterions[criterion.id] = {
                criterion: criterion
            };
        }

        if (locationValue) {
            aidCriterions[criterion.id] = {
                ...(aidCriterions[criterion.id]),
                criterion: criterion,
                value: {type: locationTypeValue.value, answer: locationValue ? locationValue.value : ""},
                type: criterion.type.shortName,
                remove: false
            }
        } else {
            aidCriterions[criterion.id].remove = true
        }

        this.setState({
            value: locationValue,
            aidCriterions: aidCriterions
        }, () => {
            this.props.onChange(this.state.criterion, this.state.aidCriterions)
        })
    }


    setLocationValueOptions = (locationType, value) => {
        let locationValueOptions = []
        if (locationType) {
            switch (locationType) {
                case Constants.LOCATION_TYPE_REGIONAL:
                    locationValueOptions = this.state.regionOptions
                    break
                case Constants.LOCATION_TYPE_DEPARTMENTAL:
                    locationValueOptions = this.state.departmentOptions
                    break
                default:
                    locationValueOptions = []
                    break
            }
        }

        this.setState({
            value: "",
            locationValueOptions: locationValueOptions
        })

        if (value) {
            let selectedOption = [];
            _.map(locationValueOptions, l => {
                if (!selectedOption.length) {
                    selectedOption = l.options.filter(locationValueOption => locationValueOption.value === value);
                }
            })

            this.setState({
                value: selectedOption.length ? selectedOption[0] : "",
            })
        }
    }

    formatOptions(r) {
        return {
            value: r.id,
            label: r.number !== null ? `${r.label} (${r.number})` : r.label,
            object: r
        }
    }

    render() {
        const criterion = this.props.criterion
        return <div className="aidCriteria-list-item">
            <div className="text-truncate w-100" title={criterion.name}>
                {criterion.name}{this.props.aid.status.value === Constants.AID_STATUS_VALIDATED && criterion.mandatory &&
                <Requiredstar style={{position: "relative", display: "inline", top: "-3px", left: "3px"}}/>}
            </div>
            <div className={this.state.showError ? "is-invalid" : ""}>
                <SelectField
                    options={this.state.locationTypeOptions}
                    value={this.state.locationTypeValue}
                    isMulti={false}
                    closeMenuOnSelect={true}
                    required={false}
                    placeholder={this.state.locationTypeOptions[0].label}
                    isDisabled={this.props.readOnly}
                    onChange={this.handleLocationTypeChange}
                    context={this}
                />
                <SelectField
                    options={this.state.locationValueOptions}
                    value={this.state.value}
                    isMulti={false}
                    closeMenuOnSelect={true}
                    required={false}
                    placeholder={this.state.locationValueOptions.length ? this.state.locationValueOptions[0].label : ''}
                    isDisabled={this.props.readOnly || (this.state.locationTypeValue && this.state.locationTypeValue.value === Constants.LOCATION_TYPE_NATIONAL)}
                    onChange={this.handleChange}
                    context={this}
                />
                {this.state.showError && <div className="error">Champ obligatoire</div>}
            </div>
        </div>
    }
}

export default CriterionLOCRow