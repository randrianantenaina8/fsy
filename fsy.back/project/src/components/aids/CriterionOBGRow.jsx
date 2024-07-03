import React from "react"
import Helper from "../../services/Helper"
import {Constants} from "fsy.common-library";
import {Requiredstar} from "../general/form/Input";
import {FormControl, FormControlLabel, Radio, RadioGroup, ThemeProvider} from "@mui/material";
import fsyTheme from "../general/form/FsyTheme";

class CriterionOBGRow extends React.Component {
    static defaultProps = {
        onChange: () => {
        }, requiredFields: false, key: Helper.generateUUID(), criterion: null, readOnly: false, aidCriterions: null
    }

    constructor(props) {
        super(props)

        const criterionOptions = props.criterion.criterionValues.map(criterionValue => {
            return {value: criterionValue.id, label: criterionValue.value}
        })
        let selectedOption = [];
        if (props.aidCriterions[props.criterion.id]) {
            selectedOption = criterionOptions.filter(element => element.value === props.aidCriterions[props.criterion.id].value.answer);
        }

        this.state = {
            criterion: props.criterion,
            aidCriterions: props.aidCriterions,
            criterionOptions: criterionOptions,
            value: selectedOption.length ? selectedOption[0].value : "",
            visible: false,
            showError: false
        }

        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.checkField !== prevProps.checkField && this.props.checkField) {
            this.setState({
                showError: this.state.criterion.mandatory && !this.state.value
            }, () => {

            });
        }
    }

    handleChange = (event) => {
        const value = event.target.value
        const criterion = this.state.criterion
        const aidCriterions = this.state.aidCriterions

        if (typeof aidCriterions[criterion.id] === "undefined") {
            aidCriterions[criterion.id] = {};
        }

        if (value) {
            aidCriterions[criterion.id] = {
                ...(aidCriterions[criterion.id]),
                criterion: criterion,
                value: {answer: +value},
                type: criterion.type.shortName,
                remove: false
            }
        } else {
            aidCriterions[criterion.id].remove = true
        }

        this.setState({
            value: value, aidCriterions: aidCriterions
        }, () => {
            this.props.onChange(this.state.criterion, this.state.aidCriterions)
        })
    }

    render() {
        const criterion = this.props.criterion
        return <div className="aidCriteria-list-item">
            <div className="text-truncate w-100" title={criterion.name}>
                {criterion.name}{this.props.aid.status.value !== Constants.AID_STATUS_DRAFT && criterion.mandatory &&
                <Requiredstar style={{position: "relative", display: "inline", top: "-3px", left: "3px"}}/>}
            </div>
            <div className={this.state.showError ? "is-invalid" : ""}>
                <ThemeProvider theme={fsyTheme}>
                    <FormControl>
                        <RadioGroup value={this.state.value}>
                            {this.state.criterionOptions.map((option, index) => {
                                return <FormControlLabel key={index}
                                                         control={<Radio size="small" value={option.value}/>}
                                                         title={option.label}
                                                         onChange={this.handleChange}
                                                         disabled={this.props.readOnly}
                                                         label={option.label}/>
                            })}
                        </RadioGroup>
                    </FormControl>
                </ThemeProvider>

                {this.state.showError && <div className="error">Champ obligatoire</div>}
            </div>
        </div>
    }
}

export default CriterionOBGRow