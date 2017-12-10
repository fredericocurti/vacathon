import React, { Component } from 'react';
import { Dialog, FlatButton, TextField } from 'material-ui';
import moment from 'moment'
import {capitalize} from 'lodash'
let locale = require('moment/locale/pt-br');
moment.locale('pt-BR')

class Modal extends Component {
    constructor(props) {
        super(props);
        // this.type = this.props.data.intents[0].intent
        this.type = 'despesa'
        this.state = {
            // type : this.props.data.intents[0].intent,
            // time : this.getTime(),
            // value : this.getValue(),
            // nature :  this.getNature()
            type: "Despesas",
            time: Date.now().valueOf(),
            value: 21212,
            nature: "alimentação"
        }
    }

    getTime(){
        let q = this.props.data.entities.find((el) => el.entity == 'sys-date' && el.value.slice(0, 4) == '2017')
        if (q){ return moment(q.value,'YYYY-MM-DD').valueOf() } else { return Date.now().valueOf() }
    }

    getValue(){
        let currency = this.props.data.entities.find((el) => el.entity == 'sys-currency' && el.value != 1)
        if (currency) { return currency.value }
        let q = this.props.data.entities.find((el) => el.entity == 'sys-number' && el.value != 1)
        console.log('Q',q)
        if (q) { return q.value } else { return '' }
    }

    getNature(){
        let q = this.props.data.entities.find((el) => el.entity == this.type)
        if (q) { return q.value } else { return '' }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        });
    };
    
    componentWillMount() {
        console.log(this.state)
    }
    
    render() {
        const actions = [
            <FlatButton
                label="Cancelar"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Confirmar"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
            />,
        ];

        return (
            <Dialog
                title={capitalize(this.type)}
                actions={actions}
                open={this.props.open}
                modal={true}
                onRequestClose={this.props.onClose}
            >
            <div style={{ display : 'flex', flexDirection : 'column' }}>
                <TextField id="value"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <TextField id="time"
                    value={this.state.time}
                    onChange={this.handleChange}
                />
                <TextField id="nature"
                    value={this.state.nature}
                    onChange={this.handleChange}
                />
            </div>
                

            </Dialog>
        );
    }
}


export default Modal;