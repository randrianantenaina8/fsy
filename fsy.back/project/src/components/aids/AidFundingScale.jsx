import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AidFundingScaleRow from "./AidFunding/AidFundingScaleRow";
import {Api} from "fsy.common-library";
import Helper from "../../services/Helper";
import requestApi from "fsy.common-library/lib/helpers/ApiService";
import AidHelper from "../../services/AidHelper";

class AidFundingScale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.props.aidFundingScales,
            speciesGroup: [],
            criterionValuesByShortName: {
                'descrip_13': [],
                'descrip_14': [],
                'general_02': [],
                'general_12': [],
                'local_01': [],
                'local_02': [],
                'general_01': [],
            }
        }

        Api.speciesGroup.getSpeciesGroups().then(res => {
            const speciesGroup = Helper.isValidResponse(res)
            this.setState({
                speciesGroup: speciesGroup
            }, () => {
                if (!this.state.rows.length) {
                    this.addNewGroup()
                }
            })
        })

        const criterionValuesByShortName = this.state.criterionValuesByShortName

        const parameters = Object.keys(criterionValuesByShortName).map(key => {
            return `criterion.shortName[]=${key}`
        })

        requestApi(`/criteria-value?page=1&${parameters.join('&')}`, "GET").then(response => {
            const criterionValues = Helper.isValidResponse(response)

            criterionValues.forEach(criterionValue => {
                criterionValuesByShortName[criterionValue.criterion.shortName].push({
                    id: criterionValue.id,
                    value: criterionValue.value
                })
            })

            this.setState({
                criterionValuesByShortName: criterionValuesByShortName
            })
        })

        this.addNewGroup = this.addNewGroup.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.handleSelectGroupChange = this.handleSelectGroupChange.bind(this)
    }

    handleSelectGroupChange() {
        this.props.onChange(this.state.rows)
    }

    addNewGroup() {
        const rows = this.state.rows
        const speciesGroup = this.state.speciesGroup

        if (speciesGroup.length) {
            const group = {
                specieGroup: {
                    id: ""
                },
                specie: {
                    id: ""
                },
                rate: "",
                maximumAmountOfWork: "",
                criteria: AidHelper.getFundingScaleDefaultCriteriaData()
            }

            rows.push(group)
            this.setState({
                row: rows
            })
        }
    }

    deleteGroup(index) {
        const rows = this.state.rows.filter((data, key) => {
            return key !== index
        })

        this.setState({
            rows: rows
        }, () => {
            this.props.onChange(this.state.rows)
        })
    }

    render() {
        return <>
            {this.state.speciesGroup.length > 0
                && this.state.criterionValuesByShortName.descrip_13.length > 0 &&
                <>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="Funds table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{minWidth: 150, maxWidth: 150}}>Détail parcelle
                                        non-forestière</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Détail parcelle
                                        forestière</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Type de projet</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Groupe d'essences</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Essence</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Regroupement</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Type de localisation</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Localisation</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Surface maximum en Ha</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Montant maximum des travaux en
                                        €/Ha</TableCell>
                                    <TableCell align="center" style={{minWidth: 100}}>Taux d'aide en %</TableCell>
                                    {!this.props.isDisabled && <TableCell></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row, index) => (
                                    <AidFundingScaleRow
                                        key={index}
                                        speciesGroup={this.state.speciesGroup}
                                        criterionValuesByShortName={this.state.criterionValuesByShortName}
                                        aidFundingScale={row}
                                        onChange={(aidFundingScaleValue, emit) => {
                                            const updatedRows = this.state.rows.map((r, i) => {
                                                if (i === index) {
                                                    r = aidFundingScaleValue
                                                }
                                                return r
                                            })

                                            this.setState({
                                                rows: updatedRows
                                            }, () => {
                                                if (emit) {
                                                    this.handleSelectGroupChange()
                                                }
                                            })
                                        }}
                                        onDelete={() => {
                                            this.deleteGroup(index)
                                        }}
                                    >
                                    </AidFundingScaleRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {!this.props.isDisabled &&
                        <div>
                            <br/>
                            <button onClick={this.addNewGroup} className="btn btn-tiny white" type="button"
                                    title="Ajouter un nouveau groupe d'essence">
                                <FontAwesomeIcon icon="fas fa-plus"/> Nouveau
                            </button>
                        </div>
                    }
                </>
            }
        </>
    }
}

export default AidFundingScale
