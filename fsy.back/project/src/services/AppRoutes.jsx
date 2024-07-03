import {Route, Routes, Navigate, useLocation} from "react-router-dom"
import Dashboard from "../components/dashboard/Dashboard"
import {LoginPage, LogoutPage} from "../components/login/LoginPage"
import {Session, Roles, Constants} from "fsy.common-library"
import {routes as Routing} from "./RoutesHelper"
import ErrorPage from "../components/general/Error/ErrorPage"
import {SimulatorPage,SimulatorEditPage,SimulationViewPage,SimulationsPage} from "../components/simulator/Simulator"
import {ProfilePage, UserEditPage, UsersPage, UserCreatePage} from "../components/users/Users"
import AidsPage from "../components/aids/Aids"
import AidEditPage from "../components/aids/AidForm"
import Organizations from "../components/organization/Organizations"
import CriterionPage from "../components/criterion/Criterion"
import StatsPage from "../components/stats/Stats"
import {ResetPasswordPage} from "../components/login/ResetPasswordPage";

function getIdFromLocation(location) {
    const locationSplit = location.pathname.split("/")
    if (locationSplit[locationSplit.length - 2] === "new") {
        return "new"
    }
    return locationSplit[locationSplit.length - 3]
}


function AppRoutes() {
    const location = useLocation()

    return <Routes>
        <Route path={Routing.app_home} element={<Navigate to={Routing.bo_dashboard} replace/>}/>
        <Route path={Routing.app_login} element={<LoginPage/>}/>
        <Route path={Routing.app_logout} element={<LogoutPage/>}/>
        <Route path={Routing.bo_active_user} element={<ResetPasswordPage pageType={'activate'}/>}/>
        <Route path={Routing.bo_reset_password} element={<ResetPasswordPage pageType={'reset-password'}/>}/>
        <Route path={Routing.bo_dashboard} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={Dashboard}/>}/>
        <Route path={Routing.bo_users} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={UsersPage}/>}/>
        <Route path={Routing.bo_user_create} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={UserCreatePage}/>}/>
        <Route path={Routing.bo_user_edit} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={UserEditPage}/>}/>
        <Route path={Routing.bo_profiles} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={ProfilePage}/>}/>
        <Route path={Routing.bo_organizations} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={Organizations}/>}/>
        <Route path={Routing.bo_aid} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={AidsPage}/>}/>
        <Route path={Routing.bo_aid_edit} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={AidEditPage} aidId={getIdFromLocation(location)}/>}/>
        <Route path={Routing.bo_simulator} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={SimulatorPage}/>} exact/>
        <Route path={Routing.bo_simulator_edit} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={SimulatorEditPage} simulatorId={getIdFromLocation(location)}/>} exact/>
        <Route path={Routing.bo_simulations} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={SimulationsPage}/>} exact/>
        <Route path={Routing.bo_simulation_view} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={SimulationViewPage} simulationId={getIdFromLocation(location)}/>} exact/>
        <Route path={Routing.bo_criterion} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={CriterionPage}/>}/>
        <Route path={Routing.bo_stats} element={<SecureRoute minRole={Constants.ROLE_ADMIN} component={StatsPage}/>}/>
        <Route path="*" element={<ErrorPage code="404" title="Page non trouvée"
                                   message="Désolé, la page que vous essayez de charger n'existe pas"/>}/>
    </Routes>
}

function SecureRoute({component: Component, minRole, ...props}) {
    const user = Session.getUser()

    if (!Session.isLoggedIn() || user === null) {
        return <Navigate to={Routing.app_login} replace/>
    }

    if (minRole != null && !Roles.isGranted(user?.roles[0], minRole)) {
        return <ErrorPage code="403" title="Accès refusé"
                          message="Vous n'avez pas les droits suffisants pour accéder à cette page"/>
    }

    return <Component {...props}/>
}

export default AppRoutes
