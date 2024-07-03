import React from "react";
import TooltipSlider from "./TooltipSlider";

class SliderRange extends React.Component {
    constructor(props) {
        super(props)
        const value = this.getMinMaxPropsValue()

        this.state = {
            value: value,
            marks: {
                [props.min]: {
                    style: {
                        fontWeight: "bold",
                        fontSize: "0.8em"
                    },
                    label: props.min + " " + props.unit
                },
                [props.max]: {
                    style: {
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        fontSize: "0.8em"
                    },
                    label: props.max + " " + props.unit
                }
            },
        }

        this.getMinMaxPropsValue = this.getMinMaxPropsValue.bind(this)
        this.onSliderChange = this.onSliderChange.bind(this)
        this.onAfterSliderChange = this.onAfterSliderChange.bind(this)
    }

    getMinMaxPropsValue() {
        return [
            this.props.value && this.props.value[0] ? this.props.value[0] : this.props.min,
            this.props.value && this.props.value[1] ? this.props.value[1] : this.props.max,
        ]
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                value: this.getMinMaxPropsValue()
            })
        }
    }

    onSliderChange = (value) => {
        this.setState({
            value: value
        })
    }

    onAfterSliderChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.value)
        }
    }

    render() {
        return <div className={'aidCriteria-list-item'}>
            <div className="text-truncate w-100">
                {this.props.label}
            </div>
            <div className={'aidCriteria-slider'}>
                <TooltipSlider
                    range
                    min={this.props.min}
                    max={this.props.max}
                    value={this.state.value}
                    marks={this.state.marks}
                    disabled={this.props.disabled}
                    onChange={this.onSliderChange}
                    onAfterChange={this.onAfterSliderChange}
                    tipFormatter={(value) => `${value} ${this.props.unit}`}
                    tipProps={{placement: "bottom"}}
                    visible={this.state.visible}
                />
            </div>
            <div className="aidCriteria-slider-value flex">
                <span>{this.state.value[0]}</span> ↔ <span>{this.state.value[1]}</span>
            </div>
            <br/>
        </div>
    }
}

export default SliderRange