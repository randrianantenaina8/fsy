import React from "react"

export class UserLevel extends React.Component {
    static defaultProps = {
        user: null
    }

    constructor(props) {
        super(props)

        this.state = {
            currentLevel: null,
            currentXp: 0
        }
        this.getCurrentLevel = this.getCurrentLevel.bind(this)
    }

    componentDidMount() {
        this.setState({
            currentXp: (this.props.user.hasOwnProperty("currentExperience")) ? this.props.user.currentExperience : 0,
            currentLevel: (this.props.user.hasOwnProperty("level")) ? this.props.user.level.name : null
        })

        // todo : make a request to get levels ?
        // this.levels = [
        //     {"name": "Débutant", "minExperience": 0, "maxExperience": 100},
        //     {"name": "Confirmé", "minExperience": 100, "maxExperience": 250},
        //     {"name": "Expert", "minExperience": 250, "maxExperience": 500},
        //     {"name": "Dieu", "minExperience": 500, "maxExperience": Infinity}
        // ]

        this.getCurrentLevel()
    }

    getCurrentLevel() {
        this.setState({
            currentLevel: {"name": "Intermédiaire", "minExperience": 100, "maxExperience": 250}
        })
    }

    render() {
        const currentPercent = (this.state.currentLevel === null) ? 0 : (((this.state.currentXp - this.state.currentLevel.minExperience) / (this.state.currentLevel.maxExperience - this.state.currentLevel.minExperience)) * 100).toFixed(2)
        const levelName = (this.state.currentLevel === null) ? "undefined" : this.state.currentLevel.name

        return <div className="user-level">
            <div className="user-currentLevel">{levelName}</div>
            <div className="userxp-wrapper">
                <div title={levelName} className="userxp-progress"
                     style={{width: `${currentPercent}%`}}>{currentPercent}%
                </div>
            </div>
        </div>
    }
}