import React from "react";
import requestApi from "fsy.common-library/lib/helpers/ApiService";
import Helper from "../../services/Helper";
import AidHelper from "../../services/AidHelper";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AidFundingFixedAmountRow from "./AidFunding/AidFundingFixedAmountRow";

class AidFundingFixedAmount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.props.aidFundingFixedAmounts,
            criterionValuesByShortName: {
                'travaux_09': [],
                'travaux_23': [],
            }
        }

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
            }, () => {
                if (!this.state.rows.length) {
                    this.addNewGroup()
                }
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
        const group = {
            amount: "",
            criteria: AidHelper.getFundingScaleDefaultCriteriaData()
        }

        rows.push(group)
        this.setState({
            row: rows
        })
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
            {this.state.criterionValuesByShortName.travaux_09.length > 0 &&
                <>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="Funds table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        Opération prise en compte par l'aide
                                    </TableCell>
                                    <TableCell align="center">
                                        Travaux en autonomie
                                    </TableCell>
                                    <TableCell align="center">Montant à l'hectare en €</TableCell>
                                    {!this.props.isDisabled && <TableCell></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row, index) => (
                                    <AidFundingFixedAmountRow
                                        key={index}
                                        speciesGroup={this.state.speciesGroup}
                                        criterionValuesByShortName={this.state.criterionValuesByShortName}
                                        aidFundingFixedAmount={row}
                                        onChange={(aidFundingFixedAmountValue, emit = true) => {
                                            const updatedRows = this.state.rows.map((r, i) => {
                                                if (i === index) {
                                                    r = aidFundingFixedAmountValue
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
                                    </AidFundingFixedAmountRow>
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

export default AidFundingFixedAmount
