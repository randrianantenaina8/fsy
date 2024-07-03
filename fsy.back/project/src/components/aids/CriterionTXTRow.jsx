import React from "react"
import Helper from "../../services/Helper"
import {SelectField} from "../general/form/Select";
import {Constants} from "fsy.common-library";
import {Requiredstar} from "../general/form/Input";

class CriterionTXTRow extends React.Component {
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

        const criterionOptions = props.criterion.criterionValues.filter(criterionValue => criterionValue.active).map(criterionValue => {
            return {value: criterionValue.id, label: criterionValue.value}
        })
        let selectedOption = [];
        if (props.aidCriterions[props.criterion.id]) {
            selectedOption = criterionOptions.filter(criterionOption => props.aidCriterions[props.criterion.id].value.answers.includes(criterionOption.value));
        }

        this.state = {
            criterion: props.criterion,
            aidCriterions: props.aidCriterions,
            criterionOptions: criterionOptions,
            value: (props.criterion.multi ? selectedOption : (selectedOption.length ? selectedOption[0] : "")),
            visible: false,
            showError: false
        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.checkField !== prevProps.checkField && this.props.checkField) {
            const criterion = this.state.criterion
            this.setState({
                showError: this.state.criterion.mandatory
                    && ((!criterion.multi && !this.state.value) || (criterion.multi && !this.state.value.length))
            }, () => {

            });
        }
    }

    handleChange = (criterionValues) => {
        const criterion = this.state.criterion
        const aidCriterions = this.state.aidCriterions

        if (typeof aidCriterions[criterion.id] === "undefined") {
            aidCriterions[criterion.id] = {};
        }

        if ((!criterion.multi && criterionValues)
            || (criterion.multi && criterionValues.length)
        ) {
            let criterionValueIds = [];
            if (criterion.multi) {
                criterionValueIds = criterionValues.map(criterionValue => criterionValue.value)
            } else {
                criterionValueIds = [criterionValues.value];
            }

            aidCriterions[criterion.id] = {
                ...(aidCriterions[criterion.id]),
                criterion: criterion,
                value: {answers: criterionValueIds},
                type: criterion.type.shortName,
                remove: false
            }
        } else {
            aidCriterions[criterion.id].remove = true
        }

        this.setState({
            value: criterionValues,
            aidCriterions: aidCriterions
        }, () => {
            this.props.onChange(this.state.criterion, this.state.aidCriterions)
        })
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
                    options={this.state.criterionOptions}
                    value={this.state.value}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    required={false}
                    placeholder=""
                    isDisabled={this.props.readOnly}
                    onChange={this.handleChange}
                    context={this}
                />
                {this.state.showError && <div className="error">Champ obligatoire</div>}
            </div>
        </div>
    }
}

export default CriterionTXTRow