import React from "react"
import {Api} from "fsy.common-library"
import Helper from "../../services/Helper"
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import AidFundingPlanRow from "./AidFunding/AidFundingPlanRow"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

class AidFundingPlan extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rows: this.props.aidFundingPlans,
            speciesGroup: []
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

        this.addNewGroup = this.addNewGroup.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.handleSelectGroupChange = this.handleSelectGroupChange.bind(this)
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
                amount: ""
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

    handleSelectGroupChange() {
        this.props.onChange(this.state.rows)
    }

    render() {
        return (
            <>
                {this.state.speciesGroup.length > 0 &&
                    <>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="Fundings table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Groupe d'essences</TableCell>
                                        <TableCell align="center">Essence</TableCell>
                                        <TableCell align="center">Montant au plan en €</TableCell>
                                        {!this.props.isDisabled && <TableCell></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rows.map((row, index) => (
                                        <AidFundingPlanRow
                                            key={index}
                                            speciesGroup={this.state.speciesGroup}
                                            fundingValue={row}
                                            isDisabled={this.props.isDisabled}
                                            onChange={(fundingValue) => {
                                                const updatedRows = this.state.rows.map((r, i) => {
                                                    if (i === index) {
                                                        return fundingValue
                                                    }
                                                    return r
                                                })

                                                this.setState({
                                                    rows: updatedRows
                                                }, () => {
                                                    this.handleSelectGroupChange()
                                                })
                                            }}
                                            onDelete={() => {
                                                this.deleteGroup(index)
                                            }}
                                        ></AidFundingPlanRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br/>
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
        )
    }
}

export default AidFundingPlan