import React, { Component } from 'react';
import { Dialog, FlatButton, TextField, DatePicker, FontIcon, IconButton } from 'material-ui';
import moment from 'moment'
import {capitalize} from 'lodash'
import firebase from 'firebase'
let locale = require('moment/locale/pt-br');
moment.locale('pt-BR')

class Modal extends Component {
    constructor(props) {
        super(props);
        this.type = 'despesa'
        this.state = {
            type : props.type,
            time : this.getTime(props),
            value : this.getValue(props),
            nature :  this.getNature(props)
            // type: "Despesas",
            // time: Date.now().valueOf(),
            // value: 21212,
            // nature: "alimentação"
        }
    }


    getTime(props){
        console.log('PROPS',props)
        if (props.data){
            let q = props.data.entities.find((el) => el.entity == 'sys-date' && el.value.slice(0, 4) == '2017')
            if (q) {
                return moment(q.value, 'YYYY-MM-DD').valueOf()
            }
        }
        return Date.now().valueOf()
    }

    getValue(props){
        console.log('PROPS', props)        
        if (props.data){
            let currency = props.data.entities.find((el) => el.entity == 'sys-currency' && el.value != 1)
            if (currency) { 
                return currency.value 
            } else {
                let q = props.data.entities.find((el) => el.entity == 'sys-number' && el.value != 1)
                if (q) { return q.value }
            }
        }
        return ''
    }

    getNature(props){
        console.log('PROPS', props)        
        if (props.data){
            let q = props.data.entities.find((el) => el.entity == props.type)
            if (q) { return q.value } 
        }
        return ''
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id] : event.target.value,
        });
    };
    
    componentWillMount() {
        console.log(this.state)
    }

    handleCancel = () => {
        this.props.onClose()
    }

    handleConfirm = () => {
        let which = this.props.type == 'despesa' ? 'custos' : 'receitas'
        firebase.database().ref(`${which}`).push({
            hora : this.state.value,
            natureza : this.state.nature.toLowerCase(),
            valor : this.state.value
        })
        this.props.onClose()
    }
    
    render() {
        const actions = [
            <IconButton
                touch
                label="Cancelar"
                onClick={this.handleCancel}
            >
                <FontIcon className="material-icons cancel-icon">cancel</FontIcon>
            </IconButton>,
            <IconButton
                touch
                label="Confirmar"
                keyboardFocused={true}
                onClick={this.handleConfirm}
            >
                <FontIcon className="material-icons confirm-icon">check_circle</FontIcon>
            </IconButton>
        ];

        return (
            <Dialog
                title={<h2 className='action-title'>{capitalize(this.props.type)}</h2>}
                actions={actions}
                open={this.props.open}
                modal={true}
                onRequestClose={this.props.onClose}
            >
            <div style={{display : 'flex'}} className='fields'>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className='label'> Valor (R$) </span>
                    <span className='label'> Data </span>
                    <span className='label'> Tipo </span>
                </div>
                <div style={{ display : 'flex', flexDirection : 'column', flex:3}}>
                    <TextField id="value"
                        value={this.state.value}
                        onChange={this.handleChange}
                        hintText='Valor (R$)'
                        fullWidth
                    />
                    <TextField id="time"
                        value={moment(this.state.time).format('MMMM Do YYYY')}
                        onChange={this.handleChange}
                        hintText='Data'
                        fullWidth                        
                    />
                    <TextField id="nature"
                        value={capitalize(this.state.nature)}
                        onChange={this.handleChange}
                        hintText={this.props.type == 'receita' ? 'Tipo de receita' : 'Tipo de gasto'}
                        fullWidth                        
                    />
                </div>
            </div>
                

            </Dialog>
        );
    }
}


export default Modal;