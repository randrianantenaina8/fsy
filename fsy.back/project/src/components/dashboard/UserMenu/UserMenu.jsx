import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Api, Session} from "fsy.common-library"
import {Link} from "react-router-dom"
import {routes as Routing} from "../../../services/RoutesHelper"
import {Tooltip, Badge, IconButton, Paper, Divider, Avatar, Button} from "@mui/material"
import {
    ClearAll as ClearAllIcon,
    DeleteOutline as DeleteOutlineIcon,
    Person as PersonIcon,
    Logout as LogoutIcon
} from "@mui/icons-material"
import Helper from "../../../services/Helper"
import {toast} from "react-toastify"
import {PREFIX_LOCAL_STORAGE} from "fsy.common-library/lib/env/Constants"
import moment from "moment"
import "./userMenu.css"

export default class UserMenu extends React.Component {

    static defaultProps = {}

    constructor(props) {
        super(props)

        const user = Session.getSessionUser()

        this.COOKIE_NAME = `${PREFIX_LOCAL_STORAGE}_lsn`
        this.TOOLTIP_COOKIE_NAME = `${PREFIX_LOCAL_STORAGE}_lsn_info`

        this.state = {
            isAuthenticated: Session.isLoggedIn(),
            userNotification: [],
            userNotificationCount: 0,
            showNotifications: false,
            user: user,
            displayTooltip: false
        }
        this._handleNotificationsClick = this._handleNotificationsClick.bind(this)
        this._handleExpandClick = this._handleExpandClick.bind(this)
        this._getNotificationsList = this._getNotificationsList.bind(this)
    }

    /*
    * TODO: Sauvegarder en session le dernier id vu
    *  - Ajouter un bouton "marquer tout comme lu"
    *  - Ajouter un bouton "tout supprimer"
    *  - Les notifications lues sont supprimées tous les soirs à minuit
    *  - Par défaut on affiche uniquement les 10 dernières notifications
    *  - Ajouter un bouton "voir tout" ?
    */

    componentDidMount() {
        Api.userNotification.getNotificationOfUser(this.state.user.id).then((response) => {
            const resultObject = Helper.isValidResponse(response)

            if (resultObject) {
                this.setState({userNotification: resultObject, userNotificationCount: resultObject.length})
                let lastSeenNotification = Session.getCookie(this.COOKIE_NAME)?.id
                const lastNotificationGet = resultObject[0].id

                if (lastSeenNotification === null || lastSeenNotification === undefined) {
                    lastSeenNotification = 0
                    Session.setCookie(this.COOKIE_NAME, {id: 0}, 365)
                }
                if (lastSeenNotification < lastNotificationGet
                    && Session.getCookie(this.TOOLTIP_COOKIE_NAME)?.id !== lastNotificationGet) {
                    this.setState({displayTooltip: true})
                    Session.setCookie(this.TOOLTIP_COOKIE_NAME, {id: lastNotificationGet}, 365)
                }
            }

            if (response?.status !== 200) {
                toast.warning("Oops ! Un problème est survenu lors de la récupération de vos notifications", Helper.getToastOptions())
            }
        })

    }

    _handleNotificationsClick() {
        this.setState(prevState => {
            return {showNotifications: !prevState.showNotifications}
        })
    }

    _handleExpandClick() {
        console.log("expand !")
    }

    _getNotificationsList() {
        let notifs = []
        for (const notif of this.state.userNotification) {
            notifs.push(<div className={`notification-item w-100 ${!notif.seen && "unread"}`} key={notif.id}>
                <Link to={Routing[notif.path]} title="Cliquez pour accéder à la page concernée">
                    <div className="notification-item-text">
                        <span className="notification-item-content">{notif.content}</span>
                        <span
                            className="notification-item-date">{moment(notif.createdAt).format("DD-MM-YYYY HH:mm")}</span>
                    </div>
                </Link>
                <div className="notification-item-icon" title="Supprimer la notification">
                    <DeleteOutlineIcon/>
                </div>
            </div>)
        }
        return notifs
    }

    render() {
        return <aside className="userMenu">
            <div className="userMenu-icon" title="Accéder à votre profil">
                <Avatar alt={this.state.user.name} src="/avatar.png" variant="rounded"><PersonIcon/></Avatar>
            </div>
            <div className="userMenu-account">
                <span>Hello </span>
                <span>{this.state.user.name}</span>
            </div>
            <div className="userMenu-notification" title="Afficher les notifications">
                <Badge className={`notification-badge ${this.state.userNotificationCount > 0 && "hasNotif"}`}
                       color="warning" badgeContent={this.state.userNotificationCount} max={10}
                       onClick={this._handleNotificationsClick}>
                    <Tooltip title="Nouvelles notifications !" arrow open={this.state.displayTooltip}>
                        <span><FontAwesomeIcon icon="fas fa-bell"/></span>
                    </Tooltip>
                </Badge>
                {this.state.showNotifications && <Paper elevation={1} className="notification-list">
                    <div className="notification-list-header flex-sb">
                        <span>Notifications</span>
                        <IconButton aria-label="Tout marquer comme lu" title="Tout marquer comme lu">
                            <ClearAllIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <div className="notification-list-content">
                        {this._getNotificationsList()}
                    </div>
                    <Divider/>
                    <div className="notification-list-footer flex w-100">
                        <div onClick={this._handleExpandClick} aria-label="show more" title="Afficher tout">
                            Voir toutes les notifications
                        </div>
                    </div>
                </Paper>}
            </div>
            <Button href={Routing.app_logout} title="Déconnexion" className="userMenu-logout" color="error"
                    variant="contained" size="large" disableElevation>
                <LogoutIcon/>
            </Button>
        </aside>
    }
}