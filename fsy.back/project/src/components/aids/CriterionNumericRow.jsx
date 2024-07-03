import React from "react"
import TooltipSlider from "../general/form/TooltipSlider"
import Helper from "../../services/Helper"

import "rc-slider/assets/index.css"
import {Constants} from "fsy.common-library";
import {Requiredstar} from "../general/form/Input";

class CriterionNumericRow extends React.Component {
    static defaultProps = {
        onInputChange: () => {
        },
        requiredNumericFields: false,
        checkField: false,
        key: Helper.generateUUID(),
        criterion: null,
        readOnly: false,
        aidCriterions: null
    }

    constructor(props) {
        super(props)

        this.state = {
            criterion: props.criterion,
            aidCriterions: props.aidCriterions,
            value: [
                props.aidCriterions[props.criterion.id] ? props.aidCriterions[props.criterion.id].value.min ?? props.criterion.valueMin : props.criterion.valueMin,
                props.aidCriterions[props.criterion.id] ? props.aidCriterions[props.criterion.id].value.max ?? props.criterion.valueMax : props.criterion.valueMax
            ],
            checked: !!props.aidCriterions[props.criterion.id],
            marks: {
                [props.criterion.valueMin]: {
                    style: {
                        fontWeight: "bold",
                        fontSize: "0.8em"
                    },
                    label: props.criterion.valueMin + " " + props.criterion.unit
                },
                [props.criterion.valueMax]: {
                    style: {
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        fontSize: "0.8em"
                    },
                    label: props.criterion.valueMax + " " + props.criterion.unit
                }
            },
            visible: false,
            showError: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.setAidCriterionValue = this.setAidCriterionValue.bind(this)
        this.onSliderChange = this.onSliderChange.bind(this)
        this.onAfterSliderChange = this.onAfterSliderChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.checkField !== prevProps.checkField && this.props.checkField) {
            this.setState({
                showError: this.state.criterion.mandatory && !this.state.checked
            }, () => {
                if (this.state.showError) {
                    const msg = this.props.criterion.valueMin + " " + this.props.criterion.unit + " (Critère obligatoire)"
                    this.setState({
                        marks: {
                            ...this.state.marks,
                            [this.props.criterion.valueMin]: {
                                ...this.state.marks[this.props.criterion.valueMin],
                                label: msg,
                                style: {
                                    fontWeight: "bold",
                                    transform: "translateX(-10%)",
                                    color: "red",
                                    background: "white"
                                }
                            }
                        }
                    })
                }
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            checked: e.target.checked
        }, () => {
            this.setAidCriterionValue(e.target.checked)
        })
    }

    onSliderChange = (value) => {
        this.setState({
            value: value
        })
    }

    onAfterSliderChange = () => {
        this.setState({
            checked: true
        }, () => {
            this.setAidCriterionValue(true)
        })
    }

    setAidCriterionValue = (isChecked) => {
        const aidCriterions = this.state.aidCriterions

        if (!isChecked) {
            aidCriterions[this.state.criterion.id].remove = true
        } else {
            aidCriterions[this.state.criterion.id] = {
                ...(aidCriterions[this.state.criterion.id]),
                criterion: this.state.criterion,
                value: {min: +this.state.value[0], max: +this.state.value[1]},
                type: this.state.criterion.type.shortName,
                remove: false
            }
        }

        this.setState({
            aidCriterions: aidCriterions
        }, () => {
            this.props.onInputChange(this.state.criterion, this.state.aidCriterions)
        })
    }

    render() {
        return <div className="aidCriteria-list-item" title={this.state.criterion.name}>
            <div className="text-truncate w-100">
                {this.state.criterion.name}{this.props.aid.status.value !== Constants.AID_STATUS_DRAFT && this.state.criterion.mandatory &&
                <Requiredstar style={{position: "relative", display: "inline", top: "-3px", left: "3px"}}/>}
            </div>

            <div className="aidCriteria-slider">
                <TooltipSlider
                    range
                    min={this.props.criterion.valueMin}
                    max={this.props.criterion.valueMax}
                    value={this.state.value}
                    marks={this.state.marks}
                    disabled={this.props.readOnly}
                    onChange={this.onSliderChange}
                    onAfterChange={this.onAfterSliderChange}
                    tipFormatter={(value) => `${value} ${this.props.criterion.unit}`}
                    tipProps={{placement: "bottom"}}
                    visible={this.state.visible}
                    step={this.props.criterion.step ?? 1}
                />
                <input type="checkbox" checked={this.state.checked} hidden={true}
                       onChange={this.handleChange}/>
            </div>
            <div className="aidCriteria-slider-value flex">
                <span>{this.state.value[0]}</span> ↔ <span>{this.state.value[1]}</span>
            </div>
            <br/>
        </div>
    }
}

export default CriterionNumericRow