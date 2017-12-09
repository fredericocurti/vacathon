import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton'

import logo from './logo.png';
import auth from './helpers/auth.js'

class Navbar extends Component {
    constructor(props){
        super(props)
        this.mql = window.matchMedia('(min-width: 480px)')
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
        this.state = {
            user : auth.getUser(),
            open : false,
            anchorEl : null,
            drawer : null,
            show : false
        }
    }
    
    componentWillMount() {
        this.mql.addListener(this.mediaQueryChanged)
        this.setState({mql:this.mql, docked : this.mql.matches})
    }

    componentDidMount() {
    }
    

    mediaQueryChanged() {
        this.setState({
        docked: this.mql.matches,
        open: this.mql.matches
        })
    }

    toggleDrawer = () => {
        this.drawer.setState( { open : !this.drawer.state.open })
        this.props.toggleDrawer()
    }
    

    handleTouchTap = (event) => {
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        })
    }

    handleRequestClose = () => {
        this.setState({
            open : false
        })
    }

    render() {
        return (
            <div>
            <div key='navbar' className="navbar-fixed" style={{backgroundColor:'#ffca28', zIndex: 5}}>
                <nav className="nav">
                    <div id="navbar" className="nav-wrapper sticky">
                        <ul>
                            <div className="middleimg center logo" style={{height:50}}>
                                <img className='logo' src={logo} width={50}/> 
                            </div>
                        </ul>

                        <ul className="left">
                        <li>
                            <div className="row valign-wrapper">
                                <a onClick={this.toggleDrawer}>
                                    <FontIcon style={{color: 'white'}} className="material-icons">dehaze</FontIcon>
                                </a>
                            </div>
                        </li>
                        </ul>

                        <ul className="right">
                            <li>
                                <IconButton onClick={this.handleLockPress}>
                                    <FontIcon className="material-icons" > refresh </FontIcon>
                                </IconButton>
                                <FlatButton
                                    onTouchTap={this.handleTouchTap}
                                    style={{ color: 'white' }}
                                    hoverColor={ 'rgba(130,130,130,0.5)' }
                                    label={this.state.user.username}
                                >
                                    <Popover
                                        open={this.state.open}
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                        targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                                        onRequestClose={this.handleRequestClose}
                                    >
                                        <Menu>
                                            <MenuItem 
                                                disabled 
                                                primaryText={ <div style={{fontSize: 14}}>{this.state.user.email}</div> }/>
                                            <Divider/>
                                            <MenuItem primaryText="Ajuda &amp; feedback" />
                                            <MenuItem primaryText="Configurações" />
                                            <MenuItem primaryText="Sair" onClick={auth.logout}/>
                                        </Menu>
                                    </Popover>                            
                                </FlatButton>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/*  SIDEBAR  */}

            <Drawer
                key='sidebar'
                docked={this.state.docked}
                containerClassName='drawer'
                width={250}
                ref={ (Drawer) => { this.drawer = Drawer } } >
                
                    <FlatButton style={{height:'auto',lineHeight:'none'}}
                        onTouchTap={this.handleTouchTap}
                        hoverColor={ 'rgba(130,130,130,0.1)' }>
                        <Avatar src={this.state.photoURL} className='userImg' />
                        <Popover
                            open={this.state.open}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                            onRequestClose={this.handleRequestClose}
                        >
                            <Menu>
                                <MenuItem
                                    disabled 
                                    primaryText={ <div style={{fontSize: 14}}>{this.state.user.email}</div> }
                                />
                                
                                <Divider/>
                                <MenuItem primaryText="Ajuda &amp; feedback" />
                                <MenuItem primaryText="Configurações" />
                                <MenuItem primaryText="Sair" onClick={auth.logout}/>
                            </Menu>
                        </Popover>                            
                    </FlatButton>

                <MenuItem disabled
                    primaryText={
                        <ul className='drawer-item' style={{color: 'gray', marginTop: 0}}>
                            {this.state.user.username}
                        </ul>
                    }
                />
                <MenuItem disabled
                    primaryText={
                        <ul className='drawer-item' style={{color: 'gray', marginTop: 0}}>
                            {this.state.user.email}
                        </ul>
                    }
                />
                <Divider/>
                <MenuItem style={{marginTop:20}}
                    leftIcon={<FontIcon className="material-icons">class</FontIcon>}
                    primaryText='Todas as notas'
                    onClick={() => { this.props.setFilter('all') }}
                />
                <MenuItem style={{marginTop:20}}
                    leftIcon={<FontIcon className="material-icons">face</FontIcon>}
                    primaryText='Minhas notas'
                    onClick={() => { this.props.setFilter('mine') }}
                />

                {/* final da navbar */}
                <div className='sidebar-bottom-item'>
                    <Divider/>
                    <MenuItem leftIcon={<FontIcon className="material-icons" >help</FontIcon>} primaryText="Ajuda &amp; feedback" />
                    <MenuItem
                        leftIcon={<FontIcon className="material-icons" >settings</FontIcon>} 
                        primaryText="Configurações"
                    />
                    <MenuItem 
                        leftIcon={<FontIcon className="material-icons" >power_settings_new</FontIcon>} 
                        primaryText="Sair" onClick={auth.logout}
                    />
                </div>



            </Drawer>


            </div>
        );
    }
}

export default Navbar;