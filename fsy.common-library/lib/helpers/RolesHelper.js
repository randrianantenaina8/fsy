import {ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_USER} from "../env/Constants.js"
import _ from "lodash"

/**
 *
 * @param role {string}
 * @param minRole {string}
 * @return boolean
 */
function isGranted(role, minRole = ROLE_USER) {
    if (minRole === ROLE_SUPER_ADMIN) {
        return _.includes([ROLE_SUPER_ADMIN], role)
    }
    if (minRole === ROLE_ADMIN) {
        return _.includes([ROLE_SUPER_ADMIN, ROLE_ADMIN], role)
    }
    if (minRole === ROLE_USER) { // Admin and super_admin are granted with ROLE_USER by default
        return _.includes([ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER], role)
    }
}

function getRoleString(role) {
    const roleStrings = {
        [ROLE_SUPER_ADMIN]: "Super administrateur",
        [ROLE_ADMIN]: "Administrateur",
        [ROLE_USER]: "Utilisateur"
    }

    return _.get(roleStrings, role)
}

const exportedFunctions = {isGranted, getRoleString}
export default exportedFunctions