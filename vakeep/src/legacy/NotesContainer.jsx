import React, { Component } from 'react';
import Masonry from 'react-masonry-component'
import TextField from 'material-ui/TextField'
import Note from './Note'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ReactTooltip from 'react-tooltip'
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash'
import store from './helpers/store.js'
import auth from './helpers/auth.js'
// import ImagesUploader from 'react-images-uploader';
// import 'react-images-uploader/styles.css';
// import 'react-images-uploader/font.css';
// var Packery = require('react-packery-component')(React);

class NotesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : {},
            inputText: '',
            errorText: null,
            inputColor: '#ffffff',
            private: false,
            title : '',
            imageIsLoading : false,
            images : {},
            filter : this.props.filter
        }
        this.user = auth.getUser()

    }

    componentWillMount() {
        store.getPublicNotes()
        store.subscribe('notes',(notes) => {
           this.setState({ data : notes })
        })
    }

    componentDidMount() {
        this.photoInput.addEventListener('change', (e) => {
            this.addPicture(e)
        })
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ filter : nextProps.filter })
    }
    
    updateNote = (note) => {
        store.updateNote(note, (newNote) => {
            let newData = this.state.data
            newData[note.id] = newNote
            this.setState({ data : newData })
        })
    }

    removeNote = (id) => {
        let newData = this.state.data
        delete newData[id]
        store.removeNote(id)
        this.setState({ data : newData })
    }

    addNote = (noteObject) => {
        let currentData = this.state.data
        currentData[noteObject.id] = noteObject.id
        this.setState({ data : currentData, inputText : '', errorText : null, title : '' })
    }

    handleInputChange = (event) => {
        this.setState({
            inputText : event.target.value,
            errorText : this.state.title.length > 40 ? this.state.errorText : null
        });
    };

    handleTitleChange = (event) => { 
        this.setState({ 
            title : event.target.value,
            errorText : this.state.title.length > 40 ? "Você atingiu o tamanho máximo para o título" : null 
        })
    }
        
    handleNoteSubmit = (event) => {
        if (this.state.inputText != '' && this.state.title.length <= 40){
            let images = _.values(this.state.images)
            let input = this.state.inputText
            if (images.length > 0){
                images.forEach((img) => {
                    if (img != null) {
                        input += `<img src='${img.props.image.link}' class='note-img'/>`
                    }
                })
            }
            store.addNote(new store.Note (
                this.state.title,input,this.state.inputColor,this.state.private
            ))
            this.setState({inputText : '', errorText: '', title: '', images : {}})
        } else {
            this.setState({ errorText : this.state.errorText ? '' : "Texto vazio" + ', por favor corrija' })
        }    
    }

    handleLockPress = () => {
        this.setState({ private : !this.state.private })
    }

    addPicture = (e) => {
        let file = e.path[0].files[0]
        if (file) {
            if (file.size > 2000000) {
                this.setState({ errorText : "Imagem muito pesada, o tamanho máximo é 2MB" })
            } else {
                this.setState({ errorText : "", imageIsLoading : true })
                store.uploadImage(file,(result) => {
                    console.log(result)
                    let newImages = this.state.images
                    newImages[result.data.id] =
                        <div key={result.data.id} image={result.data} className='hover-container'>
                            <img className='note-input-img'  src={result.data.link} />
                            <div className='hover-overlay' 
                                style={{width : result.data.width > 350 ? 350 : result.data.width}}
                            />
                            <div className='hover-button'>
                                <IconButton 
                                    id={result.data.id} 
                                    onClick={() => {
                                        this.setState({ images : { ...this.state.images,[result.data.id] : null } })
                                    }}
                                >
                                    <FontIcon className="material-icons" > delete </FontIcon>
                                </IconButton>
                            </div>
                        </div>
                    this.setState({images : newImages, imageIsLoading : false })
                })
            }    
        }
    }

    render() {
        const masonryOptions = {
            transitionDuration: 200,
            enableResizableChildren: true,
            horizontalOrder: true
        }

        const masonryStyle = {
        }


        const filteredData = () => {
            let filter = this.state.filter
            if (filter == 'all'){
                return _.sortBy(_.values(this.state.data),(o) => { return o.updatedAt.valueOf() }).reverse()
            } else if (filter == 'mine'){
                return _.filter(_.values(this.state.data).reverse(), (o) => {
                    return o.userId == this.user.id
                })
            }
        }

        const colorPicker = () => {
            let colors = ['#ffffff','#ffcdd2','#e1bee7','#bbdefb','#b2ebf2','#dcedc8','#ff7f13','#feff89','#ffeb3b']
            // let colors = ['#ffffff','#b973b3','#feff89','#ff28ad','#a4e631','#ffe600','#ff7f13','#afffff']
            return colors.map((color) => 
            <Avatar
                key={color}
                backgroundColor={color}
                style={{margin:5}}
                onClick={()=> { this.setState({ inputColor : color })} }
                className='color-samples'
            />)            
        }
        
        return (
            <div 
                style={ this.props.margin ? { marginLeft:275,marginRight:25 } : { marginLeft : 0 }}
            >
                <div className='row centered'>
                    <div className='note-input-wrapper' style={{backgroundColor : this.state.inputColor }}>
                        <TextField
                            id="text-field-controlled"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                            className='note-input-title'
                            hintText='Título'
                            underlineStyle={{width:95+'%',border:'none'}}
                            underlineFocusStyle={{width:95+'%',borderColor:'#808080'}}
                            inputStyle={{color:'gray',fontFamily:'Roboto Condensed'}}
                        />

                        <TextField
                            multiLine
                            id="text-field-controlled"
                            value={this.state.inputText}
                            onChange={this.handleInputChange}
                            errorText={ this.state.errorText }
                            className='note-input-text'
                            hintText='Escreva algo aqui...'
                            underlineStyle={{width:100+'%',color:'#808080'}}
                            underlineFocusStyle={{width:100+'%',borderColor:'#808080'}}
                        />

                        <div className='row center canvas-container'>
                            { this.state.imageIsLoading ? <CircularProgress style={{ margin : 20 }}/> : null }
                            { _.values(this.state.images).reverse() }
                            <img className='note-input-img' src={this.state.imgSrc}/>
                        </div>
                        
                        <div className='note-input-options'>    
                            <input id="photoInput" 
                                type="file" 
                                ref={(ref) => this.photoInput = ref } 
                                style={{display:'none'}}
                            />

                            { this.photoInput 
                            ? 
                            <IconButton onClick={() => { this.photoInput.click() }}>
                                <FontIcon className="material-icons" > add_a_photo </FontIcon>
                            </IconButton>
                            : null
                            }
                            

                            <IconButton onClick={this.handleLockPress}>
                                <FontIcon className="material-icons" > {this.state.private ? 'lock' : 'lock_open'} </FontIcon>
                            </IconButton>

                            <IconButton 
                                data-tip data-for='colorPicker'
                            >
                                <FontIcon className="material-icons" >format_paint</FontIcon>
                            </IconButton>
                            <ReactTooltip id='colorPicker' class='extraClass' delayHide={500} effect='solid' place='bottom'>
                                {colorPicker()}
                            </ReactTooltip>

                            <IconButton onClick={this.handleNoteSubmit}>
                                <FontIcon className="material-icons" >add</FontIcon>
                            </IconButton>
                            
                        </div>
                        
                    </div>
                </div>


                <div className='row container'>
                <Masonry
                    enableResizableChildren={true}
                    className={'masonry'} // default '' 
                    elementType={'div'} // default 'div'
                    style={masonryStyle}
                    options={masonryOptions} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false}  // default false and works only if disableImagesLoaded is false
                >
                    { filteredData().map((note) => 
                            <Note 
                                remove={this.removeNote} 
                                update={this.updateNote} 
                                key={'note-'+note.id} 
                                info={note} 
                            /> )
                    }
                
                </Masonry>
                </div>
            </div>
        );
    }
}


export default NotesContainer;