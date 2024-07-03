import React from "react";
import {FormControl, MenuItem, Select, TableCell, TableRow, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import _ from "lodash";

class AidFundingPlanRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groupId: props.fundingValue.specieGroup ? props.fundingValue.specieGroup.id ?? '' : '',
            specieId: props.fundingValue.specie ? props.fundingValue.specie.id ?? '' : '',
            amount: props.fundingValue.amount ?? ''
        }

        this.handleChangeGroup = this.handleChangeGroup.bind(this)
        this.handleChangeSpecie = this.handleChangeSpecie.bind(this)
        this.handleChangeAmount = this.handleChangeAmount.bind(this)
        this.getSpecies = this.getSpecies.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    handleChangeGroup(event) {
        const id = +event.target.value

        this.setState({
            groupId: id,
            specieId: ''
        }, () => {
            this.props.onChange(this.getValue())
        })
    }

    handleChangeSpecie(event) {
        this.setState({
            specieId: event.target.value ? +event.target.value : ''
        }, () => {
            this.props.onChange(this.getValue())
        })
    }

    handleChangeAmount(event) {
        const value = event.target.value;
        this.setState({amount: value});

        this.debouncedOnChange = this.debouncedOnChange || _.debounce(() => {
            this.props.onChange(this.getValue());
        }, 300); // 300ms debounce time

        this.debouncedOnChange();
    }

    getSpecies(id) {
        const filteredGroups = this.props.speciesGroup.filter(group => group.id === id)
        return filteredGroups.length ? filteredGroups[0].species : []
    }

    getValue() {
        return {
            ...this.props.fundingValue,
            specieGroup: {
                id: this.state.groupId
            },
            specie: {
                id: this.state.specieId
            },
            amount: this.state.amount
        }
    }

    render() {
        const speciesGroup = this.props.speciesGroup
        let species = this.getSpecies(this.state.groupId)

        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}>
            <TableCell component="th" scope="row">
                <FormControl sx={{m: 1, width: 200}} size="small">
                    <Select
                        value={this.state.groupId}
                        displayEmpty
                        onChange={this.handleChangeGroup}
                        disabled={this.props.isDisabled}

                        inputProps={{'aria-label': 'Groupe d\'essences'}}>
                        {speciesGroup.map((group) => (
                            <MenuItem key={group.id} value={group.id}>{group.label}</MenuItem>))}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl sx={{m: 1, minWidth: 120}} size="small">
                    <Select
                        value={this.state.specieId}
                        displayEmpty
                        onChange={this.handleChangeSpecie}
                        disabled={this.props.isDisabled}
                        inputProps={{'aria-label': 'Essences'}}>
                        <MenuItem key={(new Date()).getTime()} value={0}><em>Aucune</em></MenuItem>))}

                        {species.map((specie) => (
                            <MenuItem key={specie.id} value={specie.id}>{specie.label}</MenuItem>))}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell align="right">
                <FormControl sx={{width: 120}}>
                    <TextField id="outlined-basic" type="number"
                               value={this.state.amount}
                               disabled={this.props.isDisabled}
                               onChange={this.handleChangeAmount}
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
    }
}

export default AidFundingPlanRow