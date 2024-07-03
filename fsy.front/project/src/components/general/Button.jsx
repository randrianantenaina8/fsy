import React from "react"
import Helper from "../../services/Helper"
import "./button.css"
import moment from "moment"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

class ButtonPrimary extends React.Component {

    handleClick() {
        // console.log("button clicked")
    }

    handleHover() {
        // console.log("button clicked")
    }

    getUniqueId() {
        return Helper.generateUUID(5)
    }

    render() {
        let {type, className, name, title, context, onClick, onMouseEnter, children, disabled} = this.props

        type = type ?? "button"
        onClick = onClick ?? this.handleClick.bind(context)
        onMouseEnter = onMouseEnter ?? this.handleHover.bind(context)
        className = className ?? ""

        //id={`button-${this.getUniqueId()}`}
        return <button type={type} className={`neoButton-primary ${className}`}
                       name={name} title={title} onClick={onClick} onMouseEnter={onMouseEnter} disabled={disabled}>
            {children}
        </button>
    }
}

class TimingButton extends React.Component {
    static defaultProps = {
        step: 1,
        delay: 60000,
        eventType: "évènement",
        classPrefix: "event",
        iconClassName: "fa-clipboard-question",
        buttonName: "button",
        nextEventTime: 0
    }

    constructor(props) {
        super(props)
        this.state = {
            nextEventTime: 0,
            eventStatus: false
        }
        this.decrement = this.decrement.bind(this)
    }

    componentDidMount() {
        this.setState((prevState, props) => ({
            nextEventTime: props.nextEventTime,
            eventStatus: props.nextEventTime === 0
        }))
        this.play()
    }

    decrement() {
        this.setState((prevState, props) => {
            let nextEventTime = prevState.nextEventTime - props.step
            nextEventTime = (nextEventTime < 0) ? 0 : nextEventTime
            return {
                nextEventTime: nextEventTime,
                eventStatus: nextEventTime === 0
            }
        })
    }

    play() {
        setInterval(this.decrement, this.props.delay)
    }

    render() {
        const timeLeft = moment.utc(moment.duration(this.props.nextEventTime, "minutes").asMilliseconds()).format("HH:mm")
        const icon = (this.state.eventStatus) ? this.props.iconClassName : "fa-lock"
        const locked = (!this.state.eventStatus && this.state.nextEventTime !== 0)
        const eventType = this.props.eventType.charAt(0).toUpperCase() + this.props.eventType.slice(1)
        return <>
            <ButtonPrimary type="button" name={this.props.buttonName} disabled={locked}>
                <FontAwesomeIcon icon={`fas ${icon}`}/> <span>{eventType} du jour</span>
            </ButtonPrimary>
            <span className={`${this.props.classPrefix}-timer-message`}>
                {locked ?
                    <><FontAwesomeIcon icon="fas fa-lock"/> Prochain {this.props.eventType} disponible
                        dans {timeLeft} heures</>
                    : <>Nouveau {this.props.eventType} disponible !</>}
            </span>
        </>
    }
}

export {
    ButtonPrimary, TimingButton
}