import React from "react"
import {Constants} from "fsy.common-library"
import HtmlStructure from "../general/HtmlStructure"
import UserList from "./UserList"
import UserTabs from "./userTabs"
import ProfileList from "./ProfileList"

export function UsersPage() {
    return createUserSubPage("Utilisateurs - ", "users", UserList)
}

export function UserCreatePage() {
    return createUserSubPage("Utilisateurs - ", "userForm", UserList, false)
}

export function UserEditPage(props) {
    return createUserSubPage("Modification d'un utilisateur - ", "userForm", UserList, false, props)
}

export function ProfilePage() {
    return createUserSubPage("Profils d'accès - ", "profiles", ProfileList)
}


function createUserSubPage(titleString, sectionClassName, Component, withTabs = true, props) {
    document.title = titleString + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="users" sectionClassName={`${sectionClassName} bo-with-tabs`} auth={[Constants.PROFILE_USERMANAGEMENT]}>
        {withTabs && <UserTabs/>}
        <Component {...props}/>
    </HtmlStructure>
}