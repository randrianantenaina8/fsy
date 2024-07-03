import React from "react";
import {FormControl, MenuItem, Select, TableCell, TableRow, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AidHelper from "../../../services/AidHelper";

class AidFundingScaleRow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            species: [],
            value: {
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
        }

        this.getSpecies = this.getSpecies.bind(this)
        this.handleChangeValue = this.handleChangeValue.bind(this)
        this.handleChangeCriteria = this.handleChangeCriteria.bind(this)
        this.handleChangeGroupeSpecie = this.handleChangeGroupeSpecie.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    componentDidMount() {
        this.props.aidFundingScale.criteria = this.state.value.criteria.map(val1 => {
            let res = val1
            this.props.aidFundingScale.criteria.forEach(val2 => {
                if (val1.type === val2.type) {
                    res = val2
                }
            })

            return res
        })
        this.props.aidFundingScale.specie = this.props.aidFundingScale.specie ?? {id: ""}
        this.props.aidFundingScale.specieGroup = this.props.aidFundingScale.specieGroup ?? {id: ""}
        this.props.aidFundingScale.maximumAmountOfWork = this.props.aidFundingScale.maximumAmountOfWork ?? ""

        this.setState({
            value: {
                ...this.props.aidFundingScale
            }
        }, () => {
            this.setState({
                species: this.getSpecies()
            })
            this.handleOnChange(false)
        })
    }

    handleOnChange(emit = true) {
        this.props.onChange(
            this.state.value,
            emit
        )
    }

    handleChangeGroupeSpecie(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            value: {
                ...this.state.value,
                [name]: {
                    id: value
                }
            }
        }, () => {
            setTimeout(() => {
                this.handleOnChange()
                if (name === "specieGroup") {
                    this.setState({
                        species: this.getSpecies()
                    })
                }
            })
        })
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

                if (value && [name, criterion.type].sort().toString() === ["descrip_13", "descrip_14"].toString()) {
                    return {
                        ...criterion,
                        criterionValue: {
                            id: ''
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

    getSpecies() {
        const id = this.state.value.specieGroup.id
        const filteredGroups = this.props.speciesGroup.filter(group => group.id === id)
        return filteredGroups.length ? filteredGroups[0].species : []
    }

    render() {
        const speciesGroup = this.props.speciesGroup
        const criterionValuesByShortName = this.props.criterionValuesByShortName

        return <>
            <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component="th" scope="row">
                    <FormControl sx={{m: 1, width: 250}} size="small" fullWidth>
                        <Select
                            displayEmpty
                            autoWidth
                            value={this.state.value.criteria[0].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'descrip_13'}
                            inputProps={{'aria-label': 'Détail parcelle'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}
                            {criterionValuesByShortName['descrip_13'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 250}} size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[1].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'descrip_14'}
                            inputProps={{'aria-label': 'Détail parcelle'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}

                            {criterionValuesByShortName['descrip_14'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 150}}
                                 size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[2].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'general_02'}
                            inputProps={{'aria-label': 'Type de projet'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucune</em></MenuItem>))}

                            {criterionValuesByShortName['general_02'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 200}} size="small">
                        <Select
                            value={this.state.value.specieGroup.id}
                            displayEmpty
                            name={'specieGroup'}
                            onChange={this.handleChangeGroupeSpecie}
                            disabled={this.props.isDisabled}
                            inputProps={{'aria-label': 'Groupe d\'essences'}}>
                            <MenuItem key={(new Date()).getTime()}
                                      value=""><em>Aucun</em></MenuItem>
                            {speciesGroup.map((group) => (
                                <MenuItem key={group.id}
                                          value={group.id}>{group.label}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 200}} size="small">
                        <Select
                            value={this.state.value.specie.id}
                            displayEmpty
                            name={'specie'}
                            onChange={this.handleChangeGroupeSpecie}
                            disabled={this.props.isDisabled}

                            inputProps={{'aria-label': 'Essences'}}>
                            <MenuItem key={(new Date()).getTime()}
                                      value=""><em>Aucune</em></MenuItem>
                            {this.state.species.map((specie) => (
                                <MenuItem key={specie.id}
                                          value={specie.id}>{specie.label}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 200}} size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[3].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'general_12'}
                            inputProps={{'aria-label': 'Regroupement'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}

                            {criterionValuesByShortName['general_12'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 150}}
                                 size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[4].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'local_01'}
                            inputProps={{'aria-label': 'Type de localisation'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucun</em></MenuItem>))}
                            {criterionValuesByShortName['local_01'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 150}}
                                 size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[5].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'local_02'}
                            inputProps={{'aria-label': 'Localisation'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucune</em></MenuItem>))}
                            {criterionValuesByShortName['local_02'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{m: 1, width: 150}}
                                 size="small">
                        <Select
                            displayEmpty
                            value={this.state.value.criteria[6].criterionValue.id}
                            onChange={this.handleChangeCriteria}
                            name={'general_01'}
                            inputProps={{'aria-label': 'Surface maximum des travaux en €/Ha'}}>
                            <MenuItem key={(new Date()).getTime()} value=""><em>Aucune</em></MenuItem>))}

                            {criterionValuesByShortName['general_01'].map((criterionValue) => (
                                <MenuItem key={criterionValue.id}
                                          value={criterionValue.id}>{criterionValue.value}</MenuItem>))}
                        </Select>
                    </FormControl>
                </TableCell>
                <TableCell>
                    <FormControl sx={{width: 120}}>
                        <TextField id="outlined-basic" type="number"
                                   value={this.state.value.maximumAmountOfWork}
                                   name={'maximumAmountOfWork'}
                                   disabled={this.props.isDisabled}
                                   onChange={this.handleChangeValue}
                                   variant="outlined" size="small"/>
                    </FormControl>
                </TableCell>
                <TableCell align="right">
                    <FormControl sx={{width: 120}}>
                        <TextField id="outlined-basic" type="number"
                                   value={this.state.value.rate}
                                   name={'rate'}
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

export default AidFundingScaleRow