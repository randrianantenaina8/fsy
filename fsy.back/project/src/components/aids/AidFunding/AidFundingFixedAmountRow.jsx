import React from "react";
import AidHelper from "../../../services/AidHelper";
import {FormControl, MenuItem, Select, TableCell, TableRow, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class AidFundingFixedAmountRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: {
                amount: '',
                criteria: AidHelper.getFundingFixedAmountDefaultCriteriaData()
            }
        }

        this.handleChangeValue = this.handleChangeValue.bind(this)
        this.handleChangeCriteria = this.handleChangeCriteria.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    componentDidMount() {
        this.props.aidFundingFixedAmount.criteria = this.state.value.criteria.map(val1 => {
            let res = val1
            this.props.aidFundingFixedAmount.criteria.forEach(val2 => {
                if (val1.type === val2.type) {
                    res = val2
                }
            })

            return res
        })

        this.props.aidFundingFixedAmount.amount ??= ''

        this.setState({
            value: {
                ...this.props.aidFundingFixedAmount
            }
        }, () => {
            this.handleOnChange(false)
        })
    }

    handleOnChange(emit = true) {
        this.props.onChange(
            this.state.value,
            emit
        )
    }

    handleChangeCriteria(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState((prevState) => {
            const newCriteria = prevState.value.criteria.map((criterion) => {
                if (criterion.type === name) {
                    return {
                        ...criterion,
                        criterionValue: {
                            id: value
                        },
                    }
                }

                return criterion;
            });

            return {
                value: {
                    ...this.state.value,
                    criteria: newCriteria
                }
            }
        }, () => {
            setTimeout(() => {
                this.handleOnChange()
            })
        });
    }

    handleChangeValue(event) {
        const inputName = event.target.name
        const val = event.target.value;

        this.setState({
            value: {
                ...this.state.value,
                [inputName]: val
            }
        }, () => {
            setTimeout(() => {
                this.handleOnChange()
            })
        })
    }

    render() {
        const criterionValuesByShortName = this.props.criterionValuesByShortName

        return <>
            <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell align="center" component="th" scope="row">
                    <FormControl sx={{m: 1, width: 250}} size="small" fullWidth>
                        <Select
                            displayEmpty
                            autoWidth
                            value={this.state.value.criteria[0].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'travaux_09'}
                            inputProps={{'aria-label': 'Opérations prises en compte par l\'aide'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}
                            {criterionValuesByShortName['travaux_09'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell align="center">
                    <FormControl size="small" sx={{width: 120}}>
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[1].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'travaux_23'}
                            inputProps={{'aria-label': 'Travaux en autonomie'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}

                            {criterionValuesByShortName['travaux_23'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>

                <TableCell align="center">
                    <FormControl sx={{width: 120}}>
                        <TextField id="outlined-basic" type="number"
                                   value={this.state.value.amount}
                                   name={'amount'}
                                   disabled={this.props.isDisabled}
                                   onChange={this.handleChangeValue}
                                   variant="outlined" size="small"/>
                    </FormControl>
                </TableCell>
                {!this.props.isDisabled &&
                    <TableCell align="right">
                        <button onClick={this.props.onDelete} className="btn btn-tiny red" type="button"
                                title="Supprimer une groupe d'essence">
                            <FontAwesomeIcon icon="fas fa-trash"/>
                        </button>
                    </TableCell>
                }
            </TableRow>
        </>
    }
}

export default AidFundingFixedAmountRow