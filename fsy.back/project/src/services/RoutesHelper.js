import React from 'react';
import {useParams} from 'react-router-dom';

export const routes = {
    app_home: "/",
    app_login: "/login",
    app_logout: "/logout",
    bo_dashboard: "/dashboard",
    bo_active_user: "/activate",
    bo_reset_password: "/reset-password",
    bo_users: "/users",
    bo_user_create: "/user/create",
    bo_user_edit: "/user/edit/:id",
    bo_profiles: "/profiles",
    bo_profiles_edit: "/profiles/edit/:id",
    bo_organizations: "/organization",
    bo_organization_edit: "/organization/edit/:id",
    bo_aid: "/aids",
    bo_aid_edit: "/aids/edit/:id",
    bo_simulator: "/simulator",
    bo_simulator_edit: "/simulator/edit/:id",
    bo_simulations: "/simulation",
    bo_simulation_view: "/simulation/:id",
    bo_criterion: "/criterion",
    bo_stats: "/stats"
}

/**
 * Return a route string url with parameters
 *
 * @param route {string} - the original route with param
 * @param params {object}
 * @return {string} - the formatted route
 */
export function setRouteParameters(route, params) {
    for (const [key, value] of Object.entries(params)) {
        route = route.replace(`:${key}`, value)
    }
    return route
}

export const withRouter = WrappedComponent => props => {
    const params = useParams();

    return (
        <WrappedComponent
            {...props}
            params={params}
        />
    );
};

const exported = {routes, setRouteParameters, withRouter}
export default exported
