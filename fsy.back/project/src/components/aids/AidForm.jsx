import React from "react"
import {Api, Constants} from "fsy.common-library"
import {Loading} from "../general/form/Loading"
import Helper from "../../services/Helper"
import HtmlStructure from "../general/HtmlStructure"
import {toast} from "react-toastify"
import {Navigate} from "react-router-dom"
import {routes as Routing} from "../../services/RoutesHelper"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {InputField, RequiredText, TextareaField} from "../general/form/Input"
import {SelectField} from "../general/form/Select"
import ReactSwitch from "react-switch"
import _ from "lodash"
import moment from "moment/moment"
import {Nav, Navs} from "../general/Navs/Navs"
import CriterionNumericRow from "./CriterionNumericRow"
import {
    AID_STATUS_DRAFT, AID_STATUS_REFUSED, AID_STATUS_VALIDATED, AID_STATUS_VALIDATING
} from "fsy.common-library/lib/env/Constants"
import CriterionOBGRow from "./CriterionOBGRow"
import CriterionTXTRow from "./CriterionTXTRow"
import CriterionLOCRow from "./CriterionLOCRow"
import AidFundingPlan from "./AidFundingPlan"
import {Divider} from "@mui/material"
import {AidActivities} from "./AidActivities"
import fsyTheme from "../general/form/FsyTheme"
import {ThemeProvider} from "@mui/material"

import "./aidForm.css"
import SliderRange from "../general/form/SliderRange";
import AidFundingScale from "./AidFundingScale";
import AidFundingFixedAmount from "./AidFundingFixedAmount";
import AidHelper from "../../services/AidHelper";

export default function AidEditPage() {
    document.title = "Aides - " + Constants.DOCUMENT_TITLE_BACKOFFICE

    return <HtmlStructure menuName="aids" sectionClassName="aids">
        <AidForm/>
    </HtmlStructure>
}

export class AidForm extends React.Component {
    static defaultProps = {type: "create", aid: null}

    constructor(props) {
        super(props)

        this.typeOrganism = [Constants.ORGANISM_TYPE_FSY, Constants.ORGANISM_TYPE_ORGANISM, Constants.ORGANISM_TYPE_PARTNER, Constants.ORGANISM_TYPE_OTHER]

        this.statusOptions = [{
            label: "statut", icon: "fa-list-check", options: [{value: AID_STATUS_DRAFT, label: "Brouillon"}, {
                value: AID_STATUS_VALIDATING, label: "À valider"
            }, {value: AID_STATUS_REFUSED, label: "Refusée"}, {value: AID_STATUS_VALIDATED, label: "Validée"}]
        }]

        this.state = {
            loading: true,
            aid: getEmptyAidObject(),
            organismList: [],
            natureList: [],
            complexityList: [],
            schemesList: [],
            environmentsList: [],
            criterionList: [],
            formList: [],
            fundingList: [],
            aidFundingPlans: [],
            aidFundingScales: [],
            aidFundingFixedAmounts: [],
            organismListFiltered: [{label: "Organisme", options: []}],
            aidHasData: false,
            aidId: null,
            aidStatus: null,
            aidActive: null,
            aidEdition: true,
            aidInitialStatus: null,
            aidCriterions: {},
            selectVersionId: null,
            lastVersion: null,
            lastActiveVersion: null,
            aidParent: null,
            forceLocation: false,
            startDate: new Date(),
            activeLabel: "",
            listVersionOptions: [],
            requiredFields: [],
            requiredNumericFields: false,
            checkField: false,
            currentThemeMenu: "Global",
            themeList: []
        }

        this.editAid = this.editAid.bind(this)
        this.initStateObjects = this.initStateObjects.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleActiveChange = this.handleActiveChange.bind(this)
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.handleVersionSelect = this.handleVersionSelect.bind(this)
        this.handleVersionChange = this.handleVersionChange.bind(this)
        this.handleOrganismChange = this.handleOrganismChange.bind(this)
        this.handleNatureChange = this.handleNatureChange.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleFundingChange = this.handleFundingChange.bind(this)
        this.handleComplexityChange = this.handleComplexityChange.bind(this)
        this.handleSchemeChange = this.handleSchemeChange.bind(this)
        this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this)
        this.handleNumericRowChange = this.handleNumericRowChange.bind(this)
        this.handleOBGRowChange = this.handleOBGRowChange.bind(this)
        this.handleTXTRowChange = this.handleTXTRowChange.bind(this)
        this.handleLOCRowChange = this.handleLOCRowChange.bind(this)
        this.handleChangeAmountRate = this.handleChangeAmountRate.bind(this)
        this.handleChangeAmountPerPlant = this.handleChangeAmountPerPlant.bind(this)
        this.handleChangeAmountPerHectare = this.handleChangeAmountPerHectare.bind(this)
        this.checkValidAidFundingSpeciesGroup = this.checkValidAidFundingSpeciesGroup.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.createVersion = this.createVersion.bind(this)
        this.canChangeStatus = this.canChangeStatus.bind(this)
        this._getCriterionFormByType = this._getCriterionFormByType.bind(this)
        this._navigateToTheme = this._navigateToTheme.bind(this)
        this._showActivities = this._showActivities.bind(this)

        this.initRef()
    }

    componentDidMount() {
        (async function () {
            if (this.props.type === "edit") {
                await this.editAid(this.props.aid.id)
            } else {
                this.setState({aid: getEmptyAidObject(), aidHasData: false})
                this.setActiveLabel(false)
                this.setStatus(AID_STATUS_DRAFT) // brouillon par défaut
            }

            Api.CriterionTheme.getCriteriontThemes().then(response => {
                const themeList = Helper.isValidResponse(response)
                this.setState({themeList: !themeList ? [] : themeList})
            })
            Api.organization.getOrganizations().then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    this.setState({organismList: resultObject}, () => {
                        this._updateOrganismList()
                    })
                }
            })
            Api.aid.getAidNatures().then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const natureList = resultObject.map(element => {
                        return {value: element.id, label: element.name}
                    })
                    this.setState({natureList: natureList})
                }
            })
            Api.aid.getAidComplexities().then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const complexityList = resultObject.map(element => {
                        return {value: element.id, label: element.name}
                    })
                    this.setState({complexityList: complexityList})
                }
            })


            const entities = ['Schemes', 'Environments']
            entities.forEach(entity => {
                Api.aid['getAid' + entity]().then(response => {
                    const resultObject = Helper.isValidResponse(response)

                    if (resultObject) {
                        const list = resultObject.map(element => {
                            return {value: element.id, label: element.name}
                        })
                        this.setState({
                            [(entity.toLowerCase() + 'List')]: list
                        })
                    }
                })
            })

            Api.aid.getAidForms().then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const formList = resultObject.map(element => {
                        return {value: element.id, label: element.name}
                    })
                    this.setState({formList: formList})
                }
            })
            Api.aid.getAidFundings().then(response => {
                const resultObject = Helper.isValidResponse(response)

                if (resultObject) {
                    const fundingList = _.map(resultObject, element => {
                        return {value: element.id, label: element.label, object: element}
                    })
                    this.setState({fundingList: fundingList})
                }
            })

            await Api.criteria.getCriterion(1, {
                "order[position]": "ASC", "groupBy[theme]": "true", active: true, simulatorOnly: false
            }).then(response => {
                const resultObject = Helper.isValidResponse(response)
                if (resultObject) {
                    const aidCriterion = {}
                    _.each(resultObject, themedCriterion => {
                        _.each(themedCriterion, item => {
                            if (item.type.shortName === Constants.CRITERION_TYPE_NUM) {
                                aidCriterion[item.id] = {min: "", max: ""}
                            }
                            if (item.type.shortName === Constants.CRITERION_TYPE_TXT) {
                                aidCriterion[item.id] = {answers: []}
                            }
                            if (item.type.shortName === Constants.CRITERION_TYPE_OBG) {
                                aidCriterion[item.id] = {answer: null}
                            }
                            if (item.type.shortName === Constants.CRITERION_TYPE_LOC) {
                                aidCriterion[item.id] = {type: "national", answer: null}
                            }
                        })
                    })

                    this.setState({criterionList: resultObject})
                }
            })
            this.setLoading(false)
        }).bind(this)()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.aid.status !== prevState.aid.status) {
            if (this.state.aid.status && this.state.aid.status.value === AID_STATUS_DRAFT) {
                this.setState({
                    requiredFields: ["name", "organization", "nature"], requiredNumericFields: false
                })
            } else {
                this.setState({
                    requiredFields: ["name", "description", "organization", "nature", "openDate", "form", "funding", "taxCreditPercent", "complexity", "contactName", "documentUrl", "requestUrl", "status", "environment"],
                    requiredNumericFields: true
                })
            }
        }

        if (this.state.aid.id !== prevState.aid.id && this.state.lastVersion) {
            const can_edit = this.props.canValidate || //case: user can validate so have full access
                (!this.props.canValidate && !this.props.readOnly && (this.state.aid.status === AID_STATUS_DRAFT)) // case: user can only edit draft and send drafts to validation

            this.setState({
                aidEdition: can_edit && this.state.aid.status !== AID_STATUS_VALIDATED && (this.state.aid.id === this.state.lastVersion.id || !this.state.aid.id)
            })
        }
    }

    initRef() {
        this.nameField = React.createRef()
        this.descriptionField = React.createRef()
        this.organizationField = React.createRef()
        this.natureField = React.createRef()
        this.openDateField = React.createRef()
        this.formField = React.createRef()
        this.fundingField = React.createRef()
        this.taxCreditPercentField = React.createRef()
        this.complexityField = React.createRef()
        this.contactNameField = React.createRef()
        this.contactEmailField = React.createRef()
        this.documentUrlField = React.createRef()
        this.requestUrlField = React.createRef()
        this.statusField = React.createRef()
        this.environmentField = React.createRef()
    }

    initStateObjects(resultObject) {
        const aid = {
            ...resultObject,
            leadtime: resultObject.leadtime ?? "",
            contractDuration: resultObject.contractDuration ?? "",
            taxCreditPercent: resultObject.taxCreditPercent ?? "",
            openDate: resultObject.openDate ? moment(resultObject.openDate).format("YYYY-MM-DD") : "",
            depositDate: resultObject.depositDate ? moment(resultObject.depositDate).format("YYYY-MM-DD") : "",
            organization: {label: resultObject.organization.name, value: resultObject.organization.id},
            nature: {label: resultObject.nature.name, value: resultObject.nature.id},
            form: resultObject.form ? {label: resultObject.form.name, value: resultObject.form.id} : "",
            funding: resultObject.funding ? {label: resultObject.funding.label, value: resultObject.funding.id} : "",
            aidFundingScales: resultObject.aidFundingScales,
            aidFundingPlans: resultObject.aidFundingPlans,
            aidFundingFixedAmounts: resultObject.aidFundingFixedAmounts,
            complexity: resultObject.complexity ? {
                label: resultObject.complexity.name, value: resultObject.complexity.id
            } : "",
            scheme: resultObject.scheme ? {
                label: resultObject.scheme.name, value: resultObject.scheme.id
            } : "",
            environment: resultObject.environment ? {
                label: resultObject.environment.name, value: resultObject.environment.id
            } : "",
            version: {value: resultObject.id, label: `Version ${resultObject.version}`},
            contactName: resultObject.contactName ?? "",
            contactEmail: resultObject.contactEmail ?? "",
            documentUrl: resultObject.documentUrl ?? "",
            requestUrl: resultObject.requestUrl ?? "",
            originUrl: resultObject.originUrl ?? "",
            parent: resultObject.parent ? resultObject.parent : ""
        }

        const aidCriterions = this.state.aidCriterions
        aid.aidCriterions.forEach(aidCriterion => {
            aidCriterions[aidCriterion.criterion.id] = aidCriterion
            aidCriterions[aidCriterion.criterion.id].remove = false
        })

        this.setState({
            aid: aid,
            aidCriterions: aidCriterions,
            aidHasData: true,
            aidId: aid.id,
            aidStatus: aid.status,
            aidActive: aid.active
        }, function () {
            this.setActiveLabel(aid.active)
            this.setStatus(aid.status)
        })
    }

    async editAid(id) {
        const versionsResponse = await Api.aid.getAidVersions(id)

        const resultObject = Helper.isValidResponse(versionsResponse)
        if (resultObject) {
            const aid = resultObject.filter(item => {
                return item.id === +id
            })

            const listVersionOptions = resultObject.map(item => {
                return {value: item.id, label: `Version ${item.version}`}
            })

            const activeVersions = resultObject.filter(item => {
                return item.active
            })

            const lastVersion = resultObject.length ? resultObject.reduce((prev, curr) => +prev.version > +curr.version ? prev : curr) : null
            const lastActiveVersion = activeVersions.length ? activeVersions.reduce((prev, curr) => +prev.version > +curr.version ? prev : curr) : null
            const aidParent = resultObject.reduce((prev, curr) => curr.parent == null ? curr : prev)

            if (aid.length) {
                this.initStateObjects(aid[0])
                this.setState({
                    lastVersion: lastVersion,
                    lastActiveVersion: lastActiveVersion,
                    aidParent: aidParent,
                    listVersionOptions: listVersionOptions,
                    aidInitialStatus: aid[0].status
                })
            }
        }
    }

    handleChange(e) {
        const field = e.target.name
        let value = e.target.value

        if (["leadtime", "contractDuration", "taxCreditPercent"].includes(field) && value < 0) {
            value = 0
        }

        if (field === "name") {
            this.props.onNameChange(value)
        }

        this.setState((prevState) => {
            let aid = prevState.aid
            aid[field] = value
            return {aid: aid}
        })
        this.props.modalModify(true)
    }

    _updateOrganismList = () => {
        this.setState({
            organismListFiltered: Helper.FormatOrganismListFiltered(this.typeOrganism, this.state.organismList)
        })
    }

    handleDelete() {
        (async function () {
            this.setLoading()
            let response
            let message = "Aide supprimée"

            response = await Api.aid.deleteAid(this.state.aidId)

            if (response?.status !== 204) {
                message = "Une erreur est survenue. Merci de rééssayer ultérieurement"
                toast.error(message, Helper.getToastOptions())
            } else {
                toast.success(message, Helper.getToastOptions())
                setTimeout(() => {
                    this.setState({forceLocation: true})
                }, 1500)
            }
        }).bind(this)()
    }

    setLoading(status = true) {
        this.setState({loading: status})
    }

    handleOrganismChange = (selectedOptions) => {
        this.setState({
            aid: {...this.state.aid, organization: selectedOptions}
        })
        this.props.modalModify(true)
    }

    handleNatureChange = (selectedOptions) => {
        this.setState({
            aid: {...this.state.aid, nature: selectedOptions}
        })
        this.props.modalModify(true)
    }

    handleFormChange = (selectedOptions) => {
        this.setState({
            aid: {...this.state.aid, form: selectedOptions}
        })
        this.props.modalModify(true)
    }

    handleFundingChange = (selectedOptions) => {
        this.setState({
            aid: {...this.state.aid, funding: selectedOptions}
        })
        this.props.modalModify(true)
    }

    handleComplexityChange = (selectedOptions) => {
        this.setState({
            aid: {
                ...this.state.aid, complexity: selectedOptions
            }
        })
        this.props.modalModify(true)
    }

    handleSchemeChange = (selectedOptions) => {
        this.setState({
            aid: {
                ...this.state.aid, scheme: selectedOptions
            }
        })
        this.props.modalModify(true)
    }

    handleEnvironmentChange = (selectedOptions) => {
        this.setState({
            aid: {
                ...this.state.aid, environment: selectedOptions
            }
        })
        this.props.modalModify(true)
    }

    handleNumericRowChange = (criterion, aidCriterions) => {
        this._aidCriterionsFormatRow(criterion, aidCriterions)
    }

    handleOBGRowChange = (criterion, aidCriterions) => {
        this._aidCriterionsFormatRow(criterion, aidCriterions)
        this.setState({
            checkField: false
        })
    }

    handleTXTRowChange = (criterion, aidCriterions) => {
        this._aidCriterionsFormatRow(criterion, aidCriterions)
        this.setState({
            checkField: false
        })
    }

    handleLOCRowChange = (criterion, aidCriterions) => {
        this._aidCriterionsFormatRow(criterion, aidCriterions)
        this.setState({
            checkField: false
        })
    }

    handleChangeAmountRate = (value) => {
        this.setState({
            aid: {
                ...this.state.aid,
                minimumRate: value[0],
                maximumRate: value[1],
            }
        })
        this.props.modalModify(true)
    }

    handleChangeAmountPerPlant = (value) => {
        this.setState({
            aid: {
                ...this.state.aid,
                minimumAmountPerPlant: value[0],
                maximumAmountPerPlant: value[1],
            }
        })
        this.props.modalModify(true)
    }

    handleChangeAmountPerHectare = (value) => {
        this.setState({
            aid: {
                ...this.state.aid,
                minimumAmountPerHectare: value[0],
                maximumAmountPerHectare: value[1],
            }
        })
        this.props.modalModify(true)
    }

    _aidCriterionsFormatRow(criterion, aidCriterions) {
        const aidCriterionsArray = []
        Object.keys(aidCriterions).forEach(key => {
            aidCriterionsArray.push({
                ...aidCriterions[key]
            })
        })

        this.setState({
            aid: {...this.state.aid, aidCriterions: aidCriterionsArray}
        }, () => {
            this.props.modalModify(true)
        })
    }

    handleStatusChange(selectedOptions) {
        let changeStatus = false
        if (!this.props.canValidate) {
            switch (selectedOptions.value) {
                case AID_STATUS_DRAFT:
                    changeStatus = true
                    break
                case AID_STATUS_VALIDATING:
                    toast.warn("Attention! Une fois passée en validation, vous ne pouvez plus modifier cette aide", Helper.getToastOptions())
                    changeStatus = true
                    break
                case AID_STATUS_REFUSED:
                case AID_STATUS_VALIDATED:
                    toast.error("Vous n'avez pas le droit de valider une aide", Helper.getToastOptions())
                    break
                default:
                    break
            }
        } else {
            changeStatus = true
        }
        if (changeStatus) {
            this.setState({
                aid: {
                    ...this.state.aid, status: selectedOptions
                }
            })
            this.props.modalModify(true)
        }
    }

    async handleVersionSelect(version) {
        this.setState({selectVersionId: version.value}, () => {
            this.props.onVersionSwitched(async () => {
                await this.handleVersionChange()
            })
        })
    }

    async handleVersionChange() {
        this.setLoading()
        await this.editAid(this.state.selectVersionId)
        this.setLoading(false)
    }

    handleActiveChange(activeState) {
        const statusOption = this.state.aid.status || {value: 0}
        if (activeState) {
            if ((statusOption.value !== AID_STATUS_VALIDATED || (this.state.aid.id && this.state.aid.id !== this.state.lastVersion.id))) {
                toast.error(`Vous ne pouvez pas publier une aide sans l'avoir validée !`, Helper.getToastOptions())
            } else {
                this.setActiveLabel(activeState)
                this.props.modalModify(true)
            }
        } else {
            if (this.state.aid.id && this.state.aid.id !== this.state.lastVersion.id) {
                toast.error(`Vous ne pouvez pas dé-publier cette version car une autre plus récente existe`, Helper.getToastOptions())
            } else {
                this.setActiveLabel(activeState)
                this.props.modalModify(true)
            }
        }
    }

    setStatus = status => {
        let statusLabel
        this.statusOptions[0].options.forEach((s) => {
            if (s.value === status) {
                statusLabel = s.label
            }
        })

        this.setState({
            aid: {...this.state.aid, status: {label: statusLabel, value: status}}
        })
    }

    setActiveLabel = activeState => {
        this.setState({
            aid: {...this.state.aid, active: activeState}, activeLabel: activeState ? "Publiée" : "Non publiée"
        })
    }

    createVersion = () => {
        this.props.onVersionCreate("create", () => {
            const lastVersionNumber = +this.state.lastActiveVersion.version + 1
            const lastVersionOption = {value: 0, label: `Version ${lastVersionNumber}`}

            const aidCriterions = this.state.aid.aidCriterions
            aidCriterions.forEach(aidCriterion => {
                delete aidCriterion["aid"]
                delete aidCriterion["id"]
            })

            const aidFundingScales = this.state.aid.aidFundingScales
                .map(value => {
                    delete value.id
                    value.criteria = value.criteria.map(c => {
                        delete c.id
                        return c
                    })
                    return value
                })

            const aidFundingPlans = this.state.aid.aidFundingPlans
                .map(value => {
                    delete value.id
                    return value
                })

            const aidFundingFixedAmounts = this.state.aid.aidFundingFixedAmounts
                .map(value => {
                    delete value.id
                    value.criteria = value.criteria.map(c => {
                        delete c.id
                        return c
                    })
                    return value
                })

            this.setState({
                aidId: null,
                aidStatus: this.statusOptions[0].options[0],
                aidActive: false,
                loading: true,
                aidInitialStatus: AID_STATUS_DRAFT,
                aid: {
                    ...this.state.aid,
                    id: null,
                    active: false,
                    parent: this.state.aidParent,
                    version: lastVersionOption,
                    activateAt: null,
                    aidCriterions: aidCriterions,
                    aidFundingScales: aidFundingScales,
                    aidFundingPlans: aidFundingPlans,
                    aidFundingFixedAmount: aidFundingFixedAmounts,
                }
            }, () => {
                this.state.listVersionOptions.push(lastVersionOption)

                this.setState({
                    listVersionOptions: this.state.listVersionOptions
                })
                this.setStatus(AID_STATUS_DRAFT)
                setTimeout(() => {
                    this.setState({loading: false})
                }, 1000)
            })
        })

    }

    checkForm() {
        let valid = true

        const requiredFields = this.state.requiredFields
        for (const id in requiredFields) {
            if (_.trim(this.state.aid[requiredFields[id]]) === "") {
                this[requiredFields[id] + "Field"].current.classList.add("is-invalid")
                this[requiredFields[id] + "Field"].current.classList.remove("is-valid")
                valid &&= false
            } else {
                this[requiredFields[id] + "Field"].current.classList.add("is-valid")
                this[requiredFields[id] + "Field"].current.classList.remove("is-invalid")
                valid &&= true
            }
        }

        // Specific test for email field
        this.contactEmailField.current.className = "form-block is-valid"
        if (this.state.aid.contactEmail) {
            if (!this.state.aid.contactEmail.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)) {
                this.contactEmailField.current.className = "form-block is-invalid"
                valid &&= false
            }
        }

        let requiredCriterionIds = []
        _.each(this.state.themeList, theme => {
            requiredCriterionIds = [...requiredCriterionIds, ...this.state.criterionList[theme.id].filter(criterion => criterion.mandatory).map(criterion => criterion.id)]
        })

        let allRequiredCriterionsExist = this.state.aid.status.value === AID_STATUS_DRAFT

        if (this.state.aid.status.value !== AID_STATUS_DRAFT) {
            allRequiredCriterionsExist = this.state.aid.aidCriterions.filter(aidCriterion => {
                return aidCriterion.criterion.mandatory && !aidCriterion.remove
            }).length === requiredCriterionIds.length
        }

        this.setState({
            checkField: !allRequiredCriterionsExist
        })

        valid &&= allRequiredCriterionsExist

        valid &&= this.checkValidAidFundingSpeciesGroup()
        valid &&= this.checkRequiredAidFundingValue()
        valid &&= this.checkUniqueAidFundingValue()

        if (this.state.aid.funding.value === Constants.AID_FUNDING_SCALE_ID && this.state.aid.aidFundingScales.length) {
            valid &&= this.checkValidAidFundingScaleRateValue()
        }

        if (this.state.aid.funding.value === Constants.AID_FUNDING_FIXED_AMOUNT_ID && this.state.aid.aidFundingFixedAmounts.length) {
            valid &&= this.checkValidAidFundingFixedAmountValue()
        }

        return valid
    }

    checkUniqueAidFundingValue() {
        let hasUniqueAidFundingValue = true

        if (this.state.aid.funding.value === Constants.AID_FUNDING_SCALE_ID) {
            hasUniqueAidFundingValue = this.state.aid.aidFundingScales
                .map(value => {
                    delete value.id
                    value.criteria = value.criteria.map(c => {
                        delete c.id
                        return Helper.orderObjectByKeys(c)
                    })

                    value.rate = +value.rate
                    value.maximumAmountOfWork = +value.maximumAmountOfWork
                    value = Helper.orderObjectByKeys(value)

                    return JSON.stringify(value)
                })
                .every((value, index, self) => {
                    return self.indexOf(value) === index
                })
        }

        if (this.state.aid.funding.value === Constants.AID_FUNDING_PLAN_ID) {
            hasUniqueAidFundingValue = this.state.aid.aidFundingPlans
                .map(value => ((value.specieGroup && value.specieGroup.id) ? value.specieGroup.id : '-') + '-' + ((value.specie && value.specie.id) ? value.specie.id : '-'))
                .every((value, index, self) => {
                    return self.indexOf(value) === index
                })
        }

        if (this.state.aid.funding.value === Constants.AID_FUNDING_FIXED_AMOUNT_ID) {
            hasUniqueAidFundingValue = this.state.aid.aidFundingFixedAmounts
                .map(value => {
                    delete value.id
                    value.criteria = value.criteria.map(c => {
                        delete c.id
                        return Helper.orderObjectByKeys(c)
                    })

                    value.amount = +value.amount
                    value = Helper.orderObjectByKeys(value)

                    return JSON.stringify(value)
                })
                .every((value, index, self) => {
                    return self.indexOf(value) === index
                })
        }

        return hasUniqueAidFundingValue
    }

    checkValidAidFundingSpeciesGroup() {
        let hasValidSpecieGroup = true

        if (this.state.aid.funding.value === Constants.AID_FUNDING_PLAN_ID && this.state.aid.aidFundingPlans.length) {
            hasValidSpecieGroup = this.state.aid.aidFundingPlans.every(value => {
                return value.specieGroup && value.specieGroup.id
            })
        }

        return hasValidSpecieGroup
    }

    checkValidAidFundingScaleRateValue() {
        let hasValidRate = true

        if (this.state.aid.aidFundingScales.length) {
            hasValidRate = this.state.aid.aidFundingScales.every(value => {
                return value.rate
            })
        }

        return hasValidRate
    }

    checkValidAidFundingFixedAmountValue() {
        let hasValidAmount = true

        if (this.state.aid.aidFundingFixedAmounts.length) {
            hasValidAmount = this.state.aid.aidFundingFixedAmounts.every(value => {
                return value.amount
            })
        }

        return hasValidAmount
    }

    checkRequiredAidFundingValue() {
        let hasRequiredValue = true

        if (this.state.aid.funding.id === Constants.AID_FUNDING_FIXED_AMOUNT_ID) {
            hasRequiredValue = this.state.aid.aidFundingFixedAmounts
                .every(value => value.criteria.filter(c => c.id).length > 0)

        }

        return hasRequiredValue
    }

    handleFormSubmit(e) {
        e.preventDefault()
        this.setLoading(true)
        if (this.checkForm()) {
            const aid = {...this.state.aid}
            aid.organization = {id: aid.organization.value}
            aid.nature = {id: aid.nature.value}
            aid.leadtime = +aid.leadtime
            aid.contractDuration = +aid.contractDuration
            aid.taxCreditPercent = +aid.taxCreditPercent
            aid.status = aid.status ? aid.status.value : AID_STATUS_DRAFT
            aid.aidCriterions = this.state.aid.aidCriterions.filter(aidCriterion => !aidCriterion.remove)

            aid.aidFundingPlans = []
            aid.aidFundingFixedAmounts = []
            aid.aidFundingScales = []

            switch (aid.funding.value) {
                case Constants.AID_FUNDING_PLAN_ID:
                    aid.aidFundingPlans = this.state.aid.aidFundingPlans.map(item => AidHelper.formatAidPlanValue(item))
                    break

                case Constants.AID_FUNDING_SCALE_ID:
                    aid.aidFundingScales = this.state.aid.aidFundingScales
                        .map(item => AidHelper.formatAidScaleValue(item))
                        .filter(item => item.criteria.length)
                    break

                case Constants.AID_FUNDING_FIXED_AMOUNT_ID:
                    aid.aidFundingFixedAmounts = this.state.aid.aidFundingFixedAmounts
                        .map(item => AidHelper.formatAidFixedAmountValue(item))
                        .filter(item => item.criteria.length)
                    break

                default:
                    break
            }


            delete aid.version
            delete aid.activateAt
            delete aid.updatedAt

            if (!aid.form) {
                delete aid.form
            } else {
                aid.form = {id: aid.form.value}
            }
            if (!aid.complexity) {
                delete aid.complexity
            } else {
                aid.complexity = {id: aid.complexity.value}
            }
            if (!aid.scheme) {
                delete aid.scheme
            } else {
                aid.scheme = {id: aid.scheme.value}
            }

            if (!aid.environment) {
                delete aid.environment
            } else {
                aid.environment = {id: aid.environment.value}
            }

            if (!aid.funding) {
                delete aid.funding
            } else {
                aid.funding = {id: aid.funding.value}
            }
            if (!aid.openDate) {
                delete aid.openDate
            }
            if (!aid.depositDate) {
                delete aid.depositDate
            }
            if (!aid.parent) {
                delete aid.parent
            }

            if (this.state.aidId === null || this.props.type === "create") {
                Api.aid.createAid(aid).then((r) => {
                    if (r?.status !== 201) {
                        this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la création de l'aide : ${r.message}`)
                        return
                    }

                    const result = Helper.isValidResponse(r)
                    if (result) {
                        this.props.onSubmit(true, `L'aide a été créée`)
                    }
                    this.setLoading(false)
                })
            } else {
                Api.aid.updateAid(this.state.aidId, aid).then((r) => {
                    if (r?.status !== 200) {
                        this.props.onSubmit(false, `Oops ! Une erreur est survenue lors de la modification de l'aide : ${r.message}`)
                        return
                    }

                    const result = Helper.isValidResponse(r)
                    if (result) {
                        this.props.onSubmit(true, `L'aide a été mise à jour`)
                    }
                    this.setLoading(false)
                })
            }
        } else {
            this.setLoading(false)

            if (!this.checkValidAidFundingSpeciesGroup()) {
                this.props.onSubmit(false, `Veuillez renseigner tous les champs vide du groupe d'essence`)
                return
            }

            if (!this.checkUniqueAidFundingValue()) {
                if (this.state.aid.funding.value === Constants.AID_FUNDING_SCALE_ID) {
                    this.props.onSubmit(false, `Financement au barème: deux lignes ne peuvent pas avoir la même combinaison de données.`)
                }

                if (this.state.aid.funding.value === Constants.AID_FUNDING_PLAN_ID) {
                    this.props.onSubmit(false, `Les valeurs du groupe d'essence et de l'essence doivent être uniques pour chaque ligne.`)
                }

                if (this.state.aid.funding.value === Constants.AID_FUNDING_FIXED_AMOUNT_ID) {
                    this.props.onSubmit(false, `Financement sur montant fixe: deux lignes ne peuvent pas avoir la même combinaison de données.`)
                }
                return
            }

            if (this.state.aid.funding.value === Constants.AID_FUNDING_SCALE_ID && !this.checkValidAidFundingScaleRateValue()) {
                this.props.onSubmit(false, `Financement au barème: le taux d'aide en % doit être renseigner`)
                return
            }

            if (this.state.aid.funding.value === Constants.AID_FUNDING_FIXED_AMOUNT_ID && !this.checkValidAidFundingFixedAmountValue()) {
                this.props.onSubmit(false, `Financement sur montant fixe: le montant à l'hectare doit être renseigner`)
                return
            }

            this.props.onSubmit(false, `Veuillez renseigner tous les champs obligatoires avant d'enregistrer l'aide`)
        }
    }

    canChangeStatus() {
        if (this.props.readOnly) {
            return
        }
        if (this.state.aidInitialStatus && this.state.aidInitialStatus === AID_STATUS_VALIDATED) {
            return false
        }
        if (!this.state.aid || (this.state.aid && !this.state.aid.id) || !this.state.lastActiveVersion) {
            return true
        }

        return this.state.aid.id === this.state.lastVersion.id && !this.state.aidActive
    }

    /** Return jsx form element corresponding to the criterion type passed in parameter */
    _getCriterionFormByType(criterion) {
        /* NUM criterion type */
        if (criterion.type.shortName === Constants.CRITERION_TYPE_NUM) {
            return <CriterionNumericRow onInputChange={this.handleNumericRowChange}
                                        requiredNumericFields={this.state.requiredNumericFields}
                                        checkField={this.state.checkField}
                                        key={criterion.id}
                                        criterion={criterion}
                                        readOnly={!this.state.aidEdition}
                                        aid={this.state.aid}
                                        aidCriterions={this.state.aidCriterions}/>
        }

        /* TXT criterion type */
        if (criterion.type.shortName === Constants.CRITERION_TYPE_TXT) {
            return <CriterionTXTRow key={criterion.id}
                                    checkField={this.state.checkField}
                                    criterion={criterion}
                                    aidCriterions={this.state.aidCriterions}
                                    readOnly={!this.state.aidEdition}
                                    aid={this.state.aid}
                                    onChange={this.handleOBGRowChange}/>
        }

        /* OBG criterion type */
        if (criterion.type.shortName === Constants.CRITERION_TYPE_OBG) {
            return <CriterionOBGRow key={criterion.id}
                                    checkField={this.state.checkField}
                                    criterion={criterion}
                                    aidCriterions={this.state.aidCriterions}
                                    readOnly={!this.state.aidEdition}
                                    aid={this.state.aid}
                                    onChange={this.handleOBGRowChange}/>
        }

        /* LOC criterion type */
        if (criterion.type.shortName === Constants.CRITERION_TYPE_LOC) {
            return <CriterionLOCRow key={criterion.id}
                                    checkField={this.state.checkField}
                                    criterion={criterion}
                                    aidCriterions={this.state.aidCriterions}
                                    readOnly={!this.state.aidEdition}
                                    aid={this.state.aid}
                                    onChange={this.handleLOCRowChange}/>
        }
    }

    /** scroll to a form part on menu item click (criterion form)*/
    _navigateToTheme(event) {
        // get menu key cliked and scroll to the corresponding theme in criterion form
        this.setState({currentThemeMenu: event.target.dataset.key})
        const elt = document.querySelector(`div.aidCriteria-theme-section[data-theme="${event.target.dataset.key}"]`)
        elt.scrollIntoView({behavior: "smooth"})
    }

    _showActivities(visible = true) {
        this.setState({showActivities: visible})
    }

    render() {
        // Used to redirect to aid list after a delete request
        if (this.state.forceLocation) {
            return <Navigate to={Routing.bo_simulator} replace/>
        }

        return <article className="aid-form">
            <ThemeProvider theme={fsyTheme}>

                <form onSubmit={this.handleFormSubmit} noValidate className="flex-sb flex-column">
                    {this.state.loading && <Loading/>}
                    {/* ----------------------------------------- Right panel ----------------------------------------- */}
                    <div className="aid-right-panel">
                        <div className="aid-info">
                            {this.state.loading && <Loading/>}
                            {this.state.lastVersion && this.state.lastVersion.id === this.state.aid.id && this.state.aidActive && <>
                                <div className="flex-end">
                                    <button className="btn btn-tiny"
                                            onClick={this.createVersion}
                                            style={{marginLeft: 0, marginRight: 0}}
                                            type="button"
                                            title="Créer une nouvelle version de l'aide"
                                            ref={this.props.createVersionForwardRef}>
                                        <FontAwesomeIcon icon="fas fa-clone"/> Nouvelle version
                                    </button>
                                </div>
                                <Divider className="my-1"/>
                            </>}
                            <div className="" ref={this.statusField}>
                                <SelectField
                                    options={this.statusOptions}
                                    value={this.state.aid.status}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                    required={true}
                                    placeholder="Statut"
                                    isDisabled={!this.canChangeStatus()}
                                    onChange={this.handleStatusChange}
                                    context={this}
                                />
                                <div className="error">Champ obligatoire</div>
                            </div>
                            <div className="form-block mx-0">
                                <div className="flex-start">
                                    <span>Etat : </span>
                                    <ReactSwitch
                                        className="flex-input"
                                        checked={this.state.aid.active ?? false}
                                        onColor="#a6d290"
                                        offColor="#fc9999"
                                        onChange={this.handleActiveChange}
                                        disabled={this.props.readOnly}/>
                                    <span>&emsp;{this.state.activeLabel}</span>
                                </div>
                            </div>
                            {this.state.listVersionOptions.length > 0 &&
                                <div className={"form-block mx-0"}>Version actuelle
                                    <SelectField
                                        options={this.state.listVersionOptions}
                                        value={this.state.aid.version}
                                        isMulti={false}
                                        closeMenuOnSelect={true}
                                        onChange={this.handleVersionSelect}
                                        placeholder=""
                                    ></SelectField>
                                    <button className="btn"
                                            onClick={this.handleVersionChange}
                                            style={{marginLeft: 0, marginRight: 0, display: "none"}}
                                            type="button"
                                            ref={this.props.switchVersionForwardRef}>
                                    </button>
                                </div>}

                            {this.state.lastActiveVersion && <p>Version
                                publié: {this.state.lastActiveVersion ? this.state.lastActiveVersion.version : "-"}</p>}

                            <table>
                                <tbody>
                                <tr>
                                    <td>Date de publication</td>
                                    <td>: {this.state.aid.activateAt ? moment(this.state.aid.activateAt).format("DD/MM/YYYY") : "-"}</td>
                                </tr>
                                <tr>
                                    <td>Date de Modification</td>
                                    <td>: {this.state.aid.updatedAt ? moment(this.state.aid.updatedAt).format("DD/MM/YYYY") : "-"}</td>
                                </tr>
                                </tbody>
                            </table>

                            <Divider className="my-1"/>

                            {this.state.aid.id &&
                                <button className="btn btn-tiny white w-100 mx-0" type="button"
                                        onClick={this._showActivities}
                                        title="Consulter l'historique des changements">
                                    Activités
                                </button>
                            }
                        </div>

                        {/* ----------------------------------------- Activities div ----------------------------------------- */}

                        {this.state.showActivities && <div className="aid-activities">
                            <AidActivities
                                aidId={this.state.aid.parent === null ? this.state.aid.id : this.state.aid.parent.id}/>
                        </div>}
                    </div>
                    {/* ------------------------------------------- Main form ------------------------------------------- */}

                    <Navs className="aid-form-navs" disabled={this.state.loading}>
                        {/* ================================== INFORMATIONS GENERALES ================================== */}
                        <Nav label="Général" title="Informations générales de l'aide">
                            <div className="aid-form-content">
                                <div className="aid-form-left-part">
                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ LABEL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.nameField}>
                                        <InputField className="input-tiny" name="name"
                                                    onChange={this.handleChange}
                                                    value={this.state.aid.name} context={this}
                                                    isFocused={this.state.aid.name !== ""}
                                                    disabled={!this.state.aidEdition}
                                                    required={this.state.requiredFields.includes("name")}>
                                            Nom de l'aide
                                        </InputField>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~ DESCRIPTION ~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.descriptionField}>
                                        <TextareaField className="bo-box-container" name="description"
                                                       value={this.state.aid.description} context={this}
                                                       isFocused={this.state.aid.description !== ""}
                                                       disabled={!this.state.aidEdition}
                                                       onChange={this.handleChange} rows={3}
                                                       title="Description de l'aide"
                                                       required={this.state.requiredFields.includes("description")}>
                                            Description
                                        </TextareaField>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ DATES ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="flex-sb align-items-start">
                                        <div className="flex-grow">
                                            <div ref={this.openDateField} className="form-block me-0"
                                                 style={{paddingRight: "5px"}}>
                                                <InputField className="input-tiny w-100" type="date" name="openDate"
                                                            isFocused={true}
                                                            onChange={this.handleChange} center={true}
                                                            title="Planifier une date d'ouverture"
                                                            value={this.state.aid.openDate} context={this}
                                                            disabled={!this.state.aidEdition}
                                                            required={this.state.requiredFields.includes("openDate")}>
                                                    Date d'ouverture
                                                </InputField>
                                                <div className="error">Champ obligatoire</div>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className={"form-block ms-0"} style={{paddingLeft: "5px"}}>
                                                <InputField className="input-tiny w-100" type="date"
                                                            name="depositDate" center={true}
                                                            disabled={!this.state.aidEdition}
                                                            isFocused={true}
                                                            onChange={this.handleChange}
                                                            title="Date maximale de dépôt"
                                                            value={this.state.aid.depositDate} context={this}>
                                                    Date maximale de dépôt
                                                </InputField>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ ORIGIN URL ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block">
                                        <InputField className="input-tiny input-url" name="originUrl"
                                                    onChange={this.handleChange}
                                                    value={this.state.aid.originUrl} context={this}
                                                    isFocused={this.state.aid.originUrl !== ""}
                                                    disabled={!this.state.aidEdition}
                                                    required={this.state.requiredFields.includes("originUrl")}>
                                            URL d'origine
                                        </InputField>
                                        <a className="aid-form-link" title="Tester le lien dans un nouvel onglet"
                                           type="button" target="_blank" rel="noreferrer"
                                           href={this.state.aid.originUrl}>
                                            <FontAwesomeIcon icon="fas fa-up-right-from-square"/>
                                        </a>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ URL DOC ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.documentUrlField}>
                                        <InputField className="input-tiny input-url" name="documentUrl"
                                                    onChange={this.handleChange}
                                                    value={this.state.aid.documentUrl} context={this}
                                                    isFocused={this.state.aid.documentUrl !== ""}
                                                    disabled={!this.state.aidEdition}
                                                    required={this.state.requiredFields.includes("documentUrl")}>
                                            URL du document descriptif
                                        </InputField>
                                        <a className="aid-form-link" title="Tester le lien dans un nouvel onglet"
                                           type="button" target="_blank" rel="noreferrer"
                                           href={this.state.aid.documentUrl}>
                                            <FontAwesomeIcon icon="fas fa-up-right-from-square"/>
                                        </a>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~ URL REQUEST ~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.requestUrlField}>
                                        <InputField className="input-tiny input-url" name="requestUrl"
                                                    onChange={this.handleChange}
                                                    value={this.state.aid.requestUrl} context={this}
                                                    isFocused={this.state.aid.requestUrl !== ""}
                                                    disabled={!this.state.aidEdition}
                                                    required={this.state.requiredFields.includes("requestUrl")}>
                                            URL pour demander l'aide
                                        </InputField>
                                        <a className="aid-form-link" title="Tester le lien dans un nouvel onglet"
                                           type="button" target="_blank" rel="noreferrer"
                                           href={this.state.aid.requestUrl}>
                                            <FontAwesomeIcon icon="fas fa-up-right-from-square"/>
                                        </a>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ CONTACT ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="flex-sb align-items-start">
                                        <div className="flex-grow">
                                            <div className="form-block" ref={this.contactNameField}>
                                                <InputField className="input-tiny" name="contactName"
                                                            onChange={this.handleChange}
                                                            value={this.state.aid.contactName} context={this}
                                                            isFocused={this.state.aid.contactName !== ""}
                                                            disabled={!this.state.aidEdition}
                                                            required={this.state.requiredFields.includes("contactName")}>
                                                    Nom du contact
                                                </InputField>
                                                <div className="error">Champ obligatoire</div>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="form-block" ref={this.contactEmailField}>
                                                <InputField className="input-tiny" type="email" name="contactEmail"
                                                            onChange={this.handleChange}
                                                            value={this.state.aid.contactEmail} context={this}
                                                            isFocused={this.state.aid.contactEmail !== ""}
                                                            disabled={!this.state.aidEdition}>
                                                    Adresse email du contact
                                                </InputField>
                                                <div className="error">Email invalide</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="aid-form-right-part">
                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~ ORGANIZATION ~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.organizationField}>
                                        <SelectField
                                            options={this.state.organismListFiltered}
                                            value={this.state.aid.organization}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Organisme porteur"
                                            onChange={this.handleOrganismChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("organization")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ NATURE ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.natureField}>
                                        <SelectField
                                            options={this.state.natureList}
                                            value={this.state.aid.nature}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Nature"
                                            onChange={this.handleNatureChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("nature")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPLEXITY ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.complexityField}>
                                        <SelectField
                                            options={this.state.complexityList}
                                            value={this.state.aid.complexity}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Complexité de montage"
                                            onChange={this.handleComplexityChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("complexity")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ SCHEME ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block">
                                        <SelectField
                                            options={this.state.schemesList}
                                            value={this.state.aid.scheme}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Dispositif"
                                            onChange={this.handleSchemeChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("scheme")}
                                        />
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ ENVIRONMENT ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.environmentField}>
                                        <SelectField
                                            options={this.state.environmentsList}
                                            value={this.state.aid.environment}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Environement"
                                            onChange={this.handleEnvironmentChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("environment")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                    {/*<div className="separator thick"/>*/}

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ LEADTIME ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block">
                                        <InputField className="input-tiny" type="number" name="leadtime" center={true}
                                                    isFocused={this.state.aid.leadtime !== ""}
                                                    disabled={!this.state.aidEdition} onChange={this.handleChange}
                                                    title="Délai d'obtention en mois" value={this.state.aid.leadtime}
                                                    context={this}>
                                            Délai d'obtention en mois
                                        </InputField>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ CONTRACT ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block">
                                        <InputField className="input-tiny" type="number" name="contractDuration"
                                                    isFocused={this.state.aid.contractDuration !== ""}
                                                    disabled={!this.state.aidEdition} center={true}
                                                    onChange={this.handleChange}
                                                    title="Durée du contrat en années"
                                                    value={this.state.aid.contractDuration} context={this}>
                                            Durée du contrat en années
                                        </InputField>
                                    </div>

                                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ CREDIT ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                    <div className="form-block" ref={this.taxCreditPercentField}>
                                        <InputField className="input-tiny" type="number" name="taxCreditPercent"
                                                    isFocused={this.state.aid.taxCreditPercent !== ""}
                                                    disabled={!this.state.aidEdition} center={true}
                                                    onChange={this.handleChange}
                                                    title="% de crédit d'impôt"
                                                    value={this.state.aid.taxCreditPercent} context={this}
                                                    required={this.state.requiredFields.includes("taxCreditPercent")}>
                                            Pourcentage de crédit d'impôt
                                        </InputField>
                                        <div className="error">Champ obligatoire</div>
                                    </div>

                                </div>
                            </div>
                            <br/>
                        </Nav>

                        {/* ================================== CRITERES D'ELIGIBILITÉ ================================== */}
                        <Nav label="Critères d'éligibilité" title="Saisie des critères d'éligibilité de l'aide">
                            <div className="aid-form-content">
                                <div className="aidCriteria-menu">
                                    {_.map(this.state.themeList, theme => <div
                                        className={`aidCriteria-menu-item flex ${this.state.currentThemeMenu === theme.name && "selected"}`}
                                        onClick={this._navigateToTheme} key={theme.name} data-key={theme.name}>
                                        <span>{theme.name}</span>
                                    </div>)}
                                </div>
                                <div className="aidCriteria-list">
                                    {_.map(this.state.criterionList, (theme) => {
                                        if (theme.length > 0) {
                                            return <div key={theme[0].theme.name} className="aidCriteria-theme-section"
                                                        data-theme={theme[0].theme.name}>
                                                <h3>{theme[0].theme.name}</h3>
                                                <div className="aidCriteria-theme-content">
                                                    {_.map(theme, criterion => this._getCriterionFormByType(criterion))}
                                                </div>
                                                <div className="separator-wide"/>
                                            </div>
                                        }
                                        return <></>
                                    })}
                                </div>
                            </div>
                        </Nav>

                        {/* ================================ INFORMATIONS DE FINANCEMENT =============================== */}
                        <Nav label="Financement" title="Financements et autres informations financières de l'aide">
                            <div className="aid-form-content">
                                <div className="aid-form-part">
                                    <div className="form-block" ref={this.formField}>
                                        <SelectField
                                            options={this.state.formList}
                                            value={this.state.aid.form}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Forme de l'aide"
                                            onChange={this.handleFormChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("form")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>
                                </div>
                                <div className="aid-form-part">
                                    <div className="form-block" ref={this.fundingField}>
                                        <SelectField
                                            options={this.state.fundingList}
                                            value={this.state.aid.funding}
                                            isDisabled={!this.state.aidEdition}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Mode de financement"
                                            onChange={this.handleFundingChange}
                                            context={this}
                                            required={this.state.requiredFields.includes("funding")}
                                        />
                                        <div className="error">Champ obligatoire</div>
                                    </div>
                                </div>

                                <div className="aid-form-part w-100 pt-0">
                                    <div className="flex-sb align-items-center">
                                        <div className="flex-grow w-100">
                                            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ AMOUNT RATE ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                            <div className="form-block">
                                                <SliderRange min={0} max={100} unit={'%'}
                                                             value={[this.state.aid.minimumRate, this.state.aid.maximumRate]}
                                                             disabled={!this.state.aidEdition}
                                                             onChange={this.handleChangeAmountRate}
                                                             label={'Taux d\'aide'}></SliderRange>
                                            </div>
                                        </div>
                                        <div className="flex-grow w-100">
                                            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ AMOUNT PER PLANT ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                            <div className="form-block">
                                                <SliderRange min={0} max={1000} unit={'€'}
                                                             value={[this.state.aid.minimumAmountPerPlant, this.state.aid.maximumAmountPerPlant]}
                                                             disabled={!this.state.aidEdition}
                                                             onChange={this.handleChangeAmountPerPlant}
                                                             label={'Montant par plant'}></SliderRange>
                                            </div>
                                        </div>
                                        <div className="flex-grow w-100">
                                            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ AMOUNT PER HECATARE ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                            <div className="form-block">
                                                <SliderRange min={0} max={10000} unit={'€'}
                                                             value={[this.state.aid.minimumAmountPerHectare, this.state.aid.maximumAmountPerHectare]}
                                                             disabled={!this.state.aidEdition}
                                                             onChange={this.handleChangeAmountPerHectare}
                                                             label={'Montant par hectare'}></SliderRange>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="aid-form-content">
                                {this.state.aid.funding && this.state.aid.funding.value === Constants.AID_FUNDING_PLAN_ID &&
                                    <div className="aid-form-part" style={{width: 'auto'}}>
                                        <AidFundingPlan
                                            funding={this.state.aid.funding}
                                            aidFundingPlans={this.state.aid.aidFundingPlans}
                                            isDisabled={!this.state.aidEdition}
                                            onChange={(aidFundingPlans) => {
                                                this.props.modalModify(true)
                                                this.setState({
                                                    aid: {
                                                        ...this.state.aid,
                                                        aidFundingPlans: aidFundingPlans
                                                    }
                                                })
                                            }}
                                        ></AidFundingPlan>
                                    </div>}

                                {this.state.aid.funding && this.state.aid.funding.value === Constants.AID_FUNDING_SCALE_ID &&
                                    <div className="aid-form-part w-100">
                                        <AidFundingScale
                                            aidId={this.state.aid.id ?? null}
                                            isDisabled={!this.state.aidEdition}
                                            aidFundingScales={this.state.aid.aidFundingScales}
                                            onChange={(aidFundingScales) => {
                                                this.props.modalModify(true)
                                                this.setState({
                                                    aid: {
                                                        ...this.state.aid,
                                                        aidFundingScales: aidFundingScales
                                                    }
                                                })
                                            }}
                                        ></AidFundingScale>
                                    </div>
                                }

                                {this.state.aid.funding && this.state.aid.funding.value === Constants.AID_FUNDING_FIXED_AMOUNT_ID &&
                                    <div className="aid-form-part" style={{width: 'auto', whiteSpace: 'nowrap'}}>
                                        <AidFundingFixedAmount
                                            aidId={this.state.aid.id ?? null}
                                            isDisabled={!this.state.aidEdition}
                                            aidFundingFixedAmounts={this.state.aid.aidFundingFixedAmounts}
                                            onChange={(aidFundingFixedAmounts) => {
                                                this.props.modalModify(true)
                                                this.setState({
                                                    aid: {
                                                        ...this.state.aid,
                                                        aidFundingFixedAmounts: aidFundingFixedAmounts
                                                    }
                                                })
                                            }}
                                        ></AidFundingFixedAmount>
                                    </div>
                                }
                            </div>
                        </Nav>
                    </Navs>
                    <div className="aid-form-footer">
                        {(this.state.aidEdition || this.state.aid.id === this.state.lastVersion.id || !this.state.aid.id) &&
                            <button className="btn default btn-lg" type="submit" title="Enregistrer les données saisies"
                                    ref={this.props.forwardRef}>
                                <FontAwesomeIcon icon="fas fa-save"/> Enregistrer
                            </button>}
                        <RequiredText/>
                    </div>
                </form>
            </ThemeProvider>
        </article>
    }
}

/* ================================== GLOBAL FUNCTIONS ================================== */

function getEmptyAidObject() {
    return {
        name: "",
        label: "",
        openDate: "",
        depositDate: "",
        leadtime: "",
        minimumRate: null,
        maximumRate: null,
        minimumAmountPerPlant: null,
        maximumAmountPerPlant: null,
        description: "",
        contactName: "",
        contactEmail: "",
        documentUrl: "",
        originUrl: "",
        requestUrl: "",
        status: null,
        active: false,
        origin: "",
        organization: null,
        nature: null,
        form: null,
        complexity: null,
        contractDuration: "",
        taxCreditPercent: "",
        activateAt: "",
        updatedAt: "",
        aidCriterions: [],
        funding: null,
        aidFundingScales: [],
        aidFundingPlans: [],
        aidFundingFixedAmounts: [],
    }
}
