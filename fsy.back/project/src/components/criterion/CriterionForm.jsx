import React, {useCallback, useEffect, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {InputField} from "../general/form/Input"
import ActiveSwitch from "../general/form/ActiveSwitch"
import Helper from "../../services/Helper"
import {toast} from "react-toastify"
import _ from "lodash"
import {Loading} from "../general/form/Loading"
import {CriterionFormSkeleton} from "../../services/LoadingHelper"
import {Api} from "fsy.common-library"
import {
    CRITERION_DISPLAY_CHECKBOX,
    CRITERION_DISPLAY_NOT_SPECIFIED,
    CRITERION_DISPLAY_SELECT,
    CRITERION_TYPE_BIN, CRITERION_TYPE_LOC,
    CRITERION_TYPE_NUM,
    CRITERION_TYPE_OBG,
    CRITERION_TYPE_TXT
} from "fsy.common-library/lib/env/Constants"
import {SelectField} from "../general/form/Select"

import "./criterionForm.css"
import {Tooltip} from "@mui/material"
import {Memory as MemoryIcon, Paid as PaidIcon, Quiz as QuizIcon} from "@mui/icons-material"

export const CriterionForm = (props) => {
    const [state, setState] = useState({
        loading: true,
        saving: false,
        regionLoading: false,
        criteria: createEmptyCriterion(),
        nbNewValue: 0,
        txtValue: "",
        selectedDisplayValue: null,
        regionsOptions: [
            {label: "Régions", icon: "fa-earth-europe", options: []},
            {label: "Régions personnalisées", icon: "fa-user-pen", options: []}
        ],
        departmentsOptions: [],
        selectedRegion: null,
        currentEditingRegion: null,
        displayCreationForm: false,
        displayActiveOption: false,
        newRegionNumber: "",
        newRegionName: ""
    })

    // Memoise criterion display types (fixed values)
    const displayModeOptions = useMemo(function () {
        return [
            {value: CRITERION_DISPLAY_NOT_SPECIFIED, label: "Non spécifié"},
            {value: CRITERION_DISPLAY_CHECKBOX, label: "Liste à cocher"},
            {value: CRITERION_DISPLAY_SELECT, label: "Liste déroulante"}
        ]
    }, [])

    const loadRegion = useCallback(_loadRegions, [state.regionsOptions])
    const loadDepartments = useCallback(_loadDepartments, [])
    const loadCriteria = useCallback(_loadCriteria, [props.criteria.id])

    useEffect(() => {
        if (props.criteria !== null) {
            loadCriteria((currentCriteria) => {
                // load regions and departments data only for LOC criterion type
                if (currentCriteria?.type?.shortName === CRITERION_TYPE_LOC) {
                    loadRegion()
                    loadDepartments()
                }
                //save clicked criteria (passed in props) in current state
                setState(prevState => ({
                    ...prevState,
                    criteria: currentCriteria,
                    selectedDisplayValue: _.find(displayModeOptions, {value: currentCriteria?.displayMode}),
                    loading: false
                }))
            })
        } else {
            Helper.displayGenericErrorToast()
        }
    }, [props.criteria, displayModeOptions, loadRegion, loadDepartments, loadCriteria])

    /* ================================================ FUNCTIONS =============================================== */

    /**
     * allows to quicly update loading state
     * @param active bool
     * @param type string
     */
    function setLoading(active, type = "loading") {
        setState(prevState => ({...prevState, [type]: active}))
    }

    /**
     * allows to quicly notify that the form has been updated
     */
    function notifyChange() {
        props.modalModify(true)
    }

    /**
     * Format a region or department object for selectField display
     *
     * @param r {Object}
     * @return {{label: (string|*), value, object}}
     */
    function formatOptions(r) {
        return {
            value: r.id,
            label: r.number !== null ? `${r.label} (${r.number})` : r.label,
            object: r
        }
    }

    /**
     * Load criteria data from API
     */
    function _loadCriteria(callback = null) {
        Api.criteria.getCriteria(props.criteria.id).then(r => {
            if (r?.status !== 200) {
                Helper.displayApiToastResult(r)
                return null
            }

            const result = Helper.isValidResponse(r)
            if (typeof callback === "function") {
                callback(result)
            } else {
                return result
            }
        })
    }

    /**
     * Load regions data from API
     *
     * @param callback {?function} a callback function
     * @private
     */
    function _loadRegions(callback = null) {
        Api.region.getRegions().then(r => {
            if (r?.status !== 200) {
                Helper.displayApiToastResult(r)
            }

            const result = Helper.isValidResponse(r)
            if (result) {
                // Format and add regions in the correct group (see: state.regionsOptions declaration)
                _.forEach(result, r => {
                    state.regionsOptions[r.custom ? 1 : 0].options.push(formatOptions(r))
                })
                // Save region values
                setState(prevState => ({...prevState, regionsOptions: prevState.regionsOptions}))
            }
            setLoading(false)

            if (typeof callback === "function") {
                callback()
            }
        })
    }

    /**
     * Load departments data from API
     *
     * @param callback {?function} a callback function
     * @private
     */
    function _loadDepartments(callback = null) {
        Api.department.getDepartments().then(r => {
            if (r?.status !== 200) {
                Helper.displayApiToastResult(r)
            }

            const result = Helper.isValidResponse(r)
            if (result) {
                let departments = _.map(result, r => {
                    return formatOptions(r)
                })
                departments = _.orderBy(departments, ["number"], ["asc"])
                // Save departments values
                setState(prevState => ({...prevState, departmentsOptions: departments}))
            }
            setLoading(false)

            if (typeof callback === "function") {
                callback()
            }
        })
    }

    /**
     * Return an object containing all criteria properties to send to the API
     *
     * @return {{multi, name: string, active, position: number, mandatory: *, displayMode: number}}
     * @private
     */
    function _getParamsFromForm() {
        let object = { // Generic values
            "name": state.criteria.name,
            "mandatory": state.criteria.mandatory,
            "active": state.criteria.active,
            "position": state.criteria.position,
            "displayMode": state.criteria.displayMode,
            "multi": state.criteria.multi
        }
        // Numeric values
        if (state.criteria?.type?.shortName === CRITERION_TYPE_NUM) {
            object.valueMin = state.criteria.valueMin
            object.valueMax = state.criteria.valueMax
            object.unit = state.criteria.unit
            object.step = state.criteria.step

        }
        // criteria values array
        if (_.includes([CRITERION_TYPE_BIN, CRITERION_TYPE_OBG, CRITERION_TYPE_TXT], state.criteria?.type?.shortName)) {
            object.criterionValues = state.criteria.criterionValues
        }

        return object
    }

    /**
     * Check if all information of the form are valid (check format and uniqueness)
     *
     * @return {Promise<boolean>}
     */
    async function checkForm() {
        let valid = true

        // Check uniqueness of the criteria name
        const resultUniqueName = await Api.criteria.checkCriteriaName(state.criteria.id, state.criteria.name)
        if (resultUniqueName.status === 200 && resultUniqueName.data === false) {
            valid = false
            toast.warning("Ce nom de critère existe déjà. Merci de choisir un nom unique !", Helper.getToastOptions())
        } else if (resultUniqueName.status !== 200) {
            valid = false
            Helper.displayGenericErrorToast()
        }

        // Check that minimum and maximum are set
        if (state.criteria?.type?.shortName === CRITERION_TYPE_NUM && (state.criteria.valueMin === "" || state.criteria.valueMax === "")) {
            valid = false
            toast.warning("Les valeurs minimum et maximum doivent être obligatoirement renseignées", Helper.getToastOptions())
        }

        // Check that minimum and maximum values are consistent
        if (state.criteria?.type?.shortName === CRITERION_TYPE_NUM && state.criteria.valueMin >= state.criteria.valueMax) {
            valid = false
            toast.warning("La valeur minimum doit obligatoirement être inférieure au maximum", Helper.getToastOptions())
        }

        // Check that the 2 values (for BIN and OBG types) are set
        if (_.includes([CRITERION_TYPE_BIN, CRITERION_TYPE_OBG], state.criteria?.type?.shortName) && state.criteria.criterionValues.length < 2) {
            valid = false
            toast.warning("Vous devez obligatoirement renseigner les 2 valeurs !", Helper.getToastOptions())
        }

        // Check that values has minimum 2 items
        if (state.criteria?.type?.shortName === CRITERION_TYPE_TXT && state.criteria.criterionValues.length < 2) {
            valid = false
            toast.warning("La liste des valeurs doit contenir au moins 2 lignes !", Helper.getToastOptions())
        }

        // Check empty values
        if (_hasEmptyValues()) {
            valid = false
            toast.warning("Toutes les valeurs doivent être renseignées", Helper.getToastOptions())
        }

        return valid
    }

    /**
     * Check if criteria values list has empty values
     *
     * @return {boolean}
     * @private
     */
    function _hasEmptyValues() {
        return _.findIndex(state.criteria.criterionValues, {"value": ""}) !== -1
    }

    /* ---------------------------------------- Handlers ---------------------------------------- */

    /**
     * handle input changes from "general" part of the form
     *
     * @param value {int|string}
     * @param property {string}
     * @private
     */
    function _handleGeneralValueChange(value, property) {
        state.criteria[property] = value
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     *
     * @param selectedOption {Object}
     * @private
     */
    function _handleDisplayModeChange(selectedOption) {
        state.criteria.displayMode = selectedOption.value
        state.selectedDisplayValue = selectedOption
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     *
     * @param selectedOption {Object}
     * @private
     */
    function _handleRegionChange(selectedOption) {
        setState(prevState => ({
            ...prevState,
            selectedRegion: selectedOption,
            currentEditingRegion: selectedOption?.object
        }))
    }

    /**
     * Display the region form initialized with the text entered by the user
     *
     * @param text {text}
     * @private
     */
    function _handleRegionCreation(text) {
        setState(prevState => ({
            ...prevState,
            newRegionNumber: "",
            newRegionName: text,
            displayCreationForm: true
        }))
    }

    /**
     *
     * @param e {event}
     * @private
     */
    function _handleRegionPropertyChange(e) {
        setState(prevState => ({...prevState, [e.target.name]: e.target.value}))
    }

    /**
     * Reset and hide the region form
     * @private
     */
    function _handleRegionCreationCancel() {
        setState(prevState => ({
            ...prevState,
            newRegionNumber: "",
            newRegionName: "",
            displayCreationForm: false
        }))
    }

    /**
     * Check form and make a POST request to the API to create a new region entity
     *
     * @private
     */
    function _handleRegionCreationSave() {
        setLoading(true)
        // API call
        Api.region.createRegion(
            state.newRegionName,
            state.newRegionNumber === "" ? null : state.newRegionNumber,
            true
        ).then((response) => {
            //Check errors (mostly "duplicate" error)
            if (response.hasOwnProperty("@type") && response["@type"] === "hydra:Error") {
                toast.warning(response["hydra:description"], Helper.getToastOptions())
                setLoading(false)
                return
            }
            // Security if there is an error not detected by the previous step (http201=success)
            if (response?.status !== 201) {
                Helper.displayGenericErrorToast()
                setLoading(false)
                return
            }

            const result = Helper.isValidResponse(response)
            if (result) {
                toast.success("Région ajoutée !", Helper.getToastOptions())
                setLoading(true)
                // Reset creation form and hide it. Auto select the newly created value
                _loadRegions(() => {
                    setState(prevState => ({
                        ...prevState,
                        newRegionNumber: "",
                        newRegionName: "",
                        selectedRegion: formatOptions(result),
                        currentEditingRegion: result,
                        displayCreationForm: false
                    }))
                })

            }
        })
    }

    /**
     *
     * @param selectedOption {?Object}
     * @private
     */
    function _handleDepartementChange(selectedOption) {
        if (selectedOption !== null) { // Only add if value is not null
            //Insert value only if not already in array
            if (_.findIndex(state.selectedRegion.object.departments, {"id": selectedOption?.object.id}) === -1) {
                state.selectedRegion.object.departments.push({...selectedOption?.object})
                setState(prevState => ({...prevState, selectedRegion: state.selectedRegion}))
            }
        }
    }

    /**
     *
     * @param department {Object}
     * @private
     */
    function _handleDeleteDepartmentClick(department) {
        _.remove(state.selectedRegion.object.departments, {"id": department.id})
        setState(prevState => ({...prevState, selectedRegion: state.selectedRegion}))
    }

    /**
     *
     * @param e {event}
     * @private
     */
    function _handleCriteriaChange(e) {
        let value = e.target.value
        if (e.target.type === "number") { //cast number value
            value = parseInt(value)
        }
        //Using the name value to update the corresponding data
        state.criteria[e.target.name] = value
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     *
     * @param e {event}
     * @private
     */
    function _handleCriteriaValueChange(e) {
        // name = "value-0" or "value-1" based on the position from the array
        state.criteria.criterionValues[_.split(e.target.name, "-")[1]].value = e.target.value
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     *
     * @param e {event}
     * @private
     */
    function _handleTxtValueChange(e) {
        setState(prevState => ({...prevState, txtValue: e.target.value}))
        notifyChange()
    }

    /**
     *
     * @param valueObject {Object}
     * @private
     */
    function _handleDeleteTxtClick(valueObject) {
        // remove criteria value from the array. This is only available new values, existing values can only be disabled
        _.remove(state.criteria.criterionValues, {"idNew": valueObject.idNew})
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     *
     * @param valueObject {object}
     * @private
     */
    function _handleActiveTxtClick(valueObject) {
        const index = _.findIndex(state.criteria.criterionValues, {"id": valueObject.id})
        // Simply disable a criteria value from the array
        state.criteria.criterionValues[index].active = !state.criteria.criterionValues[index].active
        setState(prevState => ({...prevState, criteria: state.criteria}))
        notifyChange()
    }

    /**
     * listen for enter key (shortcut for "add" button)
     *
     * @param e {KeyboardEvent}
     * @private
     */
    function _handleTextInput(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            _handleAddTxtClick()
        }
    }

    /**
     * Add value to the txt list
     *
     * @private
     */
    function _handleAddTxtClick() {
        // Only add if value is not empty
        if (state.txtValue !== "") {
            state.criteria.criterionValues.push({
                idNew: `new-${state.nbNewValue}`,
                value: state.txtValue,
                active: true,
                isNew: true // used to differentiate new values from existing ones
            })
            setState(prevState => ({
                ...prevState,
                criteria: prevState.criteria,
                nbNewValue: prevState.nbNewValue + 1,
                txtValue: ""
            }))
            notifyChange()
        }
    }

    function _handleTxtListValueChange(id, idNew, isNew, e) {
        const txt = e.target.value
        let index

        if (isNew) {
            index = _.findIndex(state.criteria.criterionValues, {"idNew": idNew})
        } else {
            index = _.findIndex(state.criteria.criterionValues, {"id": id})
        }

        if (index !== -1) {
            state.criteria.criterionValues[index].value = txt
            setState(prevState => ({...prevState, criteria: state.criteria}))
            notifyChange()
        }
    }

    function _handleDepartmentsSave(e) {
        setState(prevState => ({...prevState, regionLoading: true}))

        Api.region.updateRegion(state.selectedRegion.object.id, state.selectedRegion.object).then(response => {
            const result = Helper.isValidResponse(response)
            if (result) {
                toast.success("Région mise à jour !", Helper.getToastOptions())
            }

            if (response?.status !== 200) {
                Helper.displayGenericErrorToast()
            }

            setState(prevState => ({...prevState, regionLoading: false}))
        })

    }

    function _handleFormSubmit(e) {
        e.preventDefault()
        setLoading(true, "saving")
        checkForm().then((valid) => {
            if (valid) {
                Api.criteria.updateCriteria(state.criteria.id, _getParamsFromForm()).then(response => {
                    const result = Helper.isValidResponse(response)
                    if (result) {
                        toast.success("Critère mis à jour !", Helper.getToastOptions())
                        props.onSubmit()
                    }

                    if (response?.status !== 200) {
                        if (response.hasOwnProperty("@type") && response["@type"] === "hydra:Error" && response["hydra:description"]) {
                            toast.error(response["hydra:description"], Helper.getToastOptions())
                        } else {
                            Helper.displayGenericErrorToast()
                        }
                    }
                    setLoading(false, "saving")
                })
            }
        })
    }

    /* =============================================== RENDER ============================================== */

    return <form onSubmit={_handleFormSubmit} noValidate className="criterion-form">
        {state.saving && <Loading/>}
        <div className="criterion-form-content">
            {state.loading ? <CriterionFormSkeleton/> : <>
                {/* ========================================== Informations ========================================= */}
                {/* Cannot be modified, only display values */}
                <div className="flex-sa criterion-form-info">
                    <div><label>Catégorie : </label> <span>{state.criteria?.theme.name}</span></div>
                    <div><label>Identifiant : </label> <span>{state.criteria?.shortName}</span></div>
                    <div>
                        <label>Type : </label>
                        <span>{`${state.criteria?.type?.label} (${state.criteria?.type?.shortName})`}</span>
                    </div>
                    <div>
                        <label>Spécificités : </label>
                        <span className="criterion-form-info-specific flex">
                            {state.criteria?.specific &&
                                <Tooltip title="Critère spécifique" arrow><MemoryIcon/></Tooltip>}
                            {state.criteria?.financial &&
                                <Tooltip title="Critère de financement" arrow><PaidIcon/></Tooltip>}
                            {state.criteria?.simulatorOnly &&
                                <Tooltip title="Critère simulateur uniquement" arrow><QuizIcon/></Tooltip>}
                        </span>
                    </div>
                </div>

                {/* ========================================== General form ========================================= */}
                <div className="separator-wide"/>
                <h4>Général</h4>

                <div className="criterion-form-general">
                    <div className="flex">
                        <div className="flex criterion-switch-container">
                            <ActiveSwitch objectActive={state.criteria?.mandatory}
                                          objectId={state.criteria?.id}
                                          onChange={v => _handleGeneralValueChange(v, "mandatory")}
                                          idPrefix="criterion" className="criterion-switch"
                                          disabled={props.readOnly}/>
                            <span className="criterion-switch-label">
                            {state.criteria?.mandatory ? "Obligatoire" : "Facultatif"}
                        </span>
                        </div>
                        <div className="flex criterion-switch-container">
                            <ActiveSwitch objectActive={state.criteria?.active}
                                          objectId={state.criteria?.id}
                                          onChange={v => _handleGeneralValueChange(v, "active")}
                                          idPrefix="criterion" className="criterion-switch"
                                          disabled={props.readOnly}/>
                            <span
                                className="criterion-switch-label">{state.criteria?.active ? "Actif" : "Inactif"}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <InputField className="input-tiny flex-grow" name="name"
                                    isFocused={state.criteria.name !== null}
                                    value={state.criteria.name} onChange={_handleCriteriaChange}
                                    title="Nom du critère" context={this}
                                    readOnly={props.readOnly}>
                            Nom
                        </InputField>

                        <InputField className="input-tiny criterion-position" type="number" name="position"
                                    isFocused={state.criteria.position !== null}
                                    value={state.criteria.position} onChange={_handleCriteriaChange}
                                    title="Ordre d'affichage du critère" context={this}
                                    readOnly={props.readOnly}>
                            Ordre
                        </InputField>

                    </div>
                </div>

                {/* ========================================== Values form ========================================== */}
                <div className="separator-wide"/>
                <h4>Valeurs</h4>

                <div className="criterion-form-data">
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TYPE NUM ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {state.criteria?.type?.shortName === CRITERION_TYPE_NUM && <>
                        <div className="flex">
                            <InputField className="input-tiny flex-grow" type="number" name="valueMin" placeHolder="0"
                                        isFocused={state.criteria.valueMin !== null}
                                        value={state.criteria.valueMin} onChange={_handleCriteriaChange}
                                        title="Valeur minimum autorisée" context={this}
                                        readOnly={props.readOnly}>
                                Minimum
                            </InputField>
                            <InputField className="input-tiny flex-grow" type="number" name="valueMax" placeHolder="100"
                                        isFocused={state.criteria.valueMax !== null}
                                        value={state.criteria.valueMax} onChange={_handleCriteriaChange}
                                        title="Valeur maximum autorisée" context={this}
                                        readOnly={props.readOnly}>
                                Maximum
                            </InputField>
                            <InputField className="input-tiny flex-grow" type="text" name="unit" placeHolder="%"
                                        isFocused={state.criteria.unit !== null}
                                        value={state.criteria.unit} onChange={_handleCriteriaChange}
                                        title="Unité de la valeur à afficher" context={this}
                                        readOnly={props.readOnly}>
                                Unité
                            </InputField>
                            <InputField className="input-tiny flex-grow" type="number" name="step" placeHolder="0"
                                        isFocused={state.criteria.step !== null}
                                        value={state.criteria.step} onChange={_handleCriteriaChange}
                                        title="Pas d'une range" context={this}
                                        readOnly={props.readOnly}>
                                Pas
                            </InputField>
                        </div>
                    </>}

                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TYPE BIN ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {state.criteria?.type?.shortName === CRITERION_TYPE_BIN && <>
                        <div className="flex">
                            <InputField className="input-tiny flex-grow" name="value-0" placeHolder='"Oui"'
                                        isFocused={state.criteria.criterionValues[0]?.value !== null}
                                        value={state.criteria.criterionValues[0]?.value}
                                        onChange={_handleCriteriaValueChange}
                                        title="Valeur à afficher en premier" context={this}
                                        readOnly={props.readOnly}>
                                Valeur 1
                            </InputField>
                            <InputField className="input-tiny flex-grow" name="value-1" placeHolder='"Non"'
                                        isFocused={state.criteria.criterionValues[1]?.value !== null}
                                        value={state.criteria.criterionValues[1]?.value}
                                        onChange={_handleCriteriaValueChange}
                                        title="Valeur à afficher en deuxième" context={this}
                                        readOnly={props.readOnly}>
                                Valeur 2
                            </InputField>
                        </div>
                    </>}

                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TYPE OBG ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {state.criteria?.type?.shortName === CRITERION_TYPE_OBG && <>
                        <div className="flex">
                            <InputField className="input-tiny flex-grow" name="value-0"
                                        placeHolder='"Obligatoire"'
                                        isFocused={state.criteria.criterionValues[0]?.value !== null}
                                        value={state.criteria.criterionValues[0]?.value}
                                        onChange={_handleCriteriaValueChange}
                                        title="Valeur à afficher en premier" context={this}
                                        readOnly={props.readOnly}>
                                Valeur obligatoire
                            </InputField>
                            <InputField className="input-tiny flex-grow" name="value-1"
                                        placeHolder='"Facultatif"'
                                        isFocused={state.criteria.criterionValues[1]?.value !== null}
                                        value={state.criteria.criterionValues[1]?.value}
                                        onChange={_handleCriteriaValueChange}
                                        title="Valeur à afficher en deuxième" context={this}
                                        readOnly={props.readOnly}>
                                Valeur facultative
                            </InputField>
                        </div>
                    </>}

                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TYPE TXT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {state.criteria?.type?.shortName === CRITERION_TYPE_TXT && <>
                        <div className="form-data-TXT flex flex-column">
                            <div className="flex-sa w-100">
                                {!state.criteria.specific && <div className="criterion-switch-container flex">
                                    <ActiveSwitch objectActive={state.criteria?.multi}
                                                  objectId={state.criteria?.id}
                                                  onChange={v => _handleGeneralValueChange(v, "multi")}
                                                  idPrefix="criterion" className="criterion-switch"
                                                  onColor={"#86c965"}
                                                  offColor={"#fcbf99"}
                                                  checkedIcon={<FontAwesomeIcon icon="fas fa-list-check"
                                                                                className="reactSelect-custom-icon"/>}
                                                  uncheckedIcon={<FontAwesomeIcon icon="fas fa-1"
                                                                                  className="reactSelect-custom-icon"/>}
                                                  disabled={props.readOnly}
                                    />
                                    <span className="criterion-switch-label">
                                    {state.criteria?.multi ? "Réponses multiples" : "Réponse unique"}
                                </span>
                                </div>}

                                <SelectField
                                    className="form-data-TXT-displaymode"
                                    options={displayModeOptions}
                                    value={state.selectedDisplayValue}
                                    isMulti={false}
                                    closeMenuOnSelect={true}
                                    placeholder="Type d'affichage"
                                    onChange={_handleDisplayModeChange}
                                    context={this}
                                    isDisabled={props.readOnly}
                                />
                            </div>

                            <div className="separator"/>

                            <div className="flex w-100">
                                <InputField className="input-tiny flex-grow formField--nopadding"
                                            name="value" placeHolder="Texte de la valeur"
                                            value={state.txtValue} onChange={_handleTxtValueChange}
                                            onKeyDown={_handleTextInput} title="Valeur à ajouter"
                                            readOnly={props.readOnly}/>
                                <button type="button" className="btn default"
                                        title="Ajouter la valeur"
                                        onClick={_handleAddTxtClick}>
                                    <FontAwesomeIcon icon="fas fa-add"/>
                                </button>
                            </div>
                            <div className="data-TXT-list flex flex-column">
                                {_.map(state.criteria.criterionValues, value => {
                                    return <div className="data-TXT-item flex w-100"
                                                key={`data-TXT-item-${value.id !== undefined ? value.id : value.idNew}`}>
                                        <InputField
                                            className={`TXT-input input-tiny flex-grow formField--nopadding ${!value?.active ? "input-disactivated" : ""}`}
                                            name={`value-txt-${value.id}`} disabled={!value.active} value={value.value}
                                            context={this}
                                            onChange={(e) => {
                                                _handleTxtListValueChange(value?.id, value?.idNew, value.hasOwnProperty("isNew"), e)
                                            }}
                                            readOnly={props.readOnly}/>
                                        {value?.isNew ?
                                            <button type="button" className="btn alert TXT-button"
                                                    title="Supprimer cette valeur"
                                                    disabled={props.readOnly}
                                                    onClick={() => {
                                                        _handleDeleteTxtClick(value)
                                                    }}>
                                                <FontAwesomeIcon icon="fas fa-trash-can"/>
                                            </button>
                                            :
                                            <button type="button"
                                                    className={`btn TXT-button ${value.active ? "green" : "red"}`}
                                                    title={`${value.active ? "Désactiver" : "Activer"} cette valeur`}
                                                    disabled={props.readOnly}
                                                    onClick={() => {
                                                        _handleActiveTxtClick(value)
                                                    }}>
                                                <FontAwesomeIcon
                                                    icon={`fas ${value.active ? "fa-eye" : "fa-eye-slash"}`}/>
                                            </button>
                                        }
                                    </div>
                                })}
                            </div>
                        </div>
                    </>}

                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TYPE LOC ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {state.criteria?.type?.shortName === CRITERION_TYPE_LOC && <>
                        <div className="help-text">
                            Ce critère est {`${state.criteria?.specific ? "spécifique et" : ""}`} de type
                            "{`${state.criteria?.type.label}(${state.criteria?.type.shortName})`}".
                            Vous pouvez consulter et modifier les valeurs possibles ci-dessous
                        </div>
                        <div className="separator"/>
                        <div className="form-data-LOC flex">

                            {/* ---------------------------------------- Region form ---------------------------------------- */}
                            {state.regionLoading && <Loading/>}

                            <div className="data-LOC-selector">
                                <SelectField
                                    options={state.regionsOptions}
                                    value={state.selectedRegion}
                                    multi={false}
                                    closeMenuOnSelect={true}
                                    placeholder="Selectionnez une région"
                                    onChange={_handleRegionChange}
                                    creatable={true}
                                    onCreateOption={_handleRegionCreation}
                                    formatCreateLabel="Créer une nouvelle région :"
                                />
                                {state.selectedRegion !== null &&
                                    <span className="help-text flex-end">
                                    {state.selectedRegion.object.departments.length} département(s)
                                </span>
                                }
                                {state.displayCreationForm && <>
                                    <div className="separator"/>

                                    <div>
                                        <InputField className="input-tiny formField--nopadding"
                                                    name="newRegionNumber"
                                                    placeHolder="Numéro unique de la région à ajouter"
                                                    value={state.newRegionNumber}
                                                    onChange={_handleRegionPropertyChange}
                                                    title="Numéro de la région à ajouter"/>
                                        <InputField className="input-tiny formField--nopadding"
                                                    name="newRegionName"
                                                    placeHolder="Nom de la région à ajouter"
                                                    value={state.newRegionName}
                                                    onChange={_handleRegionPropertyChange}
                                                    title="Nom de la région à ajouter"/>
                                        <div className="flex-end">
                                            <button type="button" className="btn default"
                                                    title="Confirmer l'ajout de la région"
                                                    onClick={_handleRegionCreationSave}>
                                                <FontAwesomeIcon icon="fas fa-circle-check"/>
                                            </button>
                                            <button type="button" className="btn warning"
                                                    title="Annuler l'ajout de la région"
                                                    onClick={_handleRegionCreationCancel}>
                                                <FontAwesomeIcon icon="fas fa-circle-xmark"/>
                                            </button>
                                        </div>
                                    </div>
                                </>}
                            </div>

                            <div className="vertical-separator data-LOC-separator"/>

                            {/* ---------------------------------------- Departement form ---------------------------------------- */}

                            <div className="data-LOC-department-form">
                                {state.selectedRegion !== null && <>
                                    <div className="data-LOC-selector_dep flex-start align-items-baseline">
                                        <SelectField
                                            className="department-selector"
                                            options={state.departmentsOptions}
                                            value={null}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                            placeholder="Ajouter un département"
                                            onChange={_handleDepartementChange}
                                        />

                                        <button className="btn default btn-tiny LOC-button" type="button"
                                                title="Enregistrer les modifications" onClick={_handleDepartmentsSave}>
                                            <FontAwesomeIcon icon="fas fa-save"/>
                                        </button>
                                    </div>
                                    <div className="data-LOC-list flex flex-column flex-grow">
                                        {_.map(state.selectedRegion.object.departments, dep => {
                                            return <div className="data-LOC-item flex w-100"
                                                        key={`data-LOC-item-${dep.id !== undefined ? dep.id : dep.idNew}`}>
                                                <InputField className="LOC-input w-100 input-tiny formField--nopadding"
                                                            name={`dep-${dep.id}`} disabled={true}
                                                            value={`${dep.number} - ${dep.label}`}/>
                                                <button type="button" className="btn btn-tiny alert LOC-button"
                                                        title="Supprimer cette valeur"
                                                        onClick={() => {
                                                            _handleDeleteDepartmentClick(dep)
                                                        }}>
                                                    <FontAwesomeIcon icon="fas fa-trash-can"/>
                                                </button>
                                            </div>
                                        })}
                                    </div>
                                </>}
                            </div>
                        </div>
                    </>}
                </div>
            </>}
        </div>

        {/* ========================================== FOOTER BUTTON ========================================= */}

        {!props.readOnly &&
            <div className="criterion-form-footer">
                <button className="btn default btn-lg" type="submit" title="Enregistrer les données"
                        ref={props.forwardRef}>
                    <FontAwesomeIcon icon="fas fa-save"/> Enregistrer
                </button>
            </div>
        }
    </form>

}


/* ================================== GLOBAL FUNCTIONS ================================== */

function createEmptyCriterion() {
    return {
        name: "",
        valueMin: 0,
        valueMax: 100,
        unit: "",
        position: 0,
        displayMode: 0,
        criterionValues: [
            {value: ""},
            {value: ""}
        ]
    }
}