import API from "./api/FsyAPI.js"
import SESS from "./helpers/SessionHelper.js"
import ROLES from "./helpers/RolesHelper.js"
import CONSTS from "./env/Constants.js"

let library = {
    Api: API,
    Session: SESS,
    Roles: ROLES,
    Constants: CONSTS,
}

export default library
