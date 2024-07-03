import React from "react"

export class UserAvatar extends React.Component {
    static defaultProps = {
        user: null
    }

    constructor(props) {
        super(props)

        this.state = {
            avatarType: 1
            // avatarType: 2
        }
    }

    render() {
        const imgLink = (this.props.user.sexe === "féminin") ? "/img/avatar-femme2.png" : "/img/avatar.png"
        return (
            <div className="user-avatar-full">
                <img src={imgLink} alt="user avatar"/>
                <div className="avatar-sub-message">
                    Bon retour parmi nous {this.props.user.pseudo}
                </div>
            </div>
        )
    }
}