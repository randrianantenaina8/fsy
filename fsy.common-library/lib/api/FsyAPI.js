import requestApi from "../helpers/ApiService.js"
import Aid from "./Aid.js"
import Log from "./Log.js"
import Question from "./Question.js"
import User from "./User.js"
import Criteria from "./Criteria.js"
import Organization from "./Organization.js"
import Profile from "./Profile.js"
import CriterionType from "./CriterionType.js"
import Statistics from "./Statistics.js"
import Simulator from "./Simulator.js"
import Parameter from "./Parameter.js"
import Region from "./Region.js"
import Department from "./Department.js"
import CriterionTheme from "./CriterionTheme.js"
import UserNotification from "./UserNotification.js"
import SpeciesGroup from "./SpeciesGroup.js";
import QuestionDependency from "./QuestionDependency.js"

export default {
    requestApi: requestApi,
    user: User,
    log: Log,
    question: Question,
    questionDependency: QuestionDependency,
    aid: Aid,
    criteria: Criteria,
    organization: Organization,
    profile: Profile,
    criterionType: CriterionType,
    CriterionTheme: CriterionTheme,
    statistics: Statistics,
    simulator: Simulator,
    parameter: Parameter,
    region: Region,
    department: Department,
    userNotification: UserNotification,
    speciesGroup: SpeciesGroup
}
