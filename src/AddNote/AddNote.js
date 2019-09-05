import React from 'react'
import ValidationError from '../ValidationError/ValidationError'
import PropTypes from 'prop-types'
import config from '../config'
import Error from '../Error';
import ApiContext from '../ApiContext';




export default class AddNote extends React.Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  
  static contextType = ApiContext;

 

  constructor(props){
    super(props)
    this.state = {
      name: '',
      content:'',
      nameValid: false,
      contentValid: false,
      formValid: false,
      hasError: false,
      validationMessages: {
        name: '',
        content: ''
      }
    }
  }

  setName(name) {
    this.setState({name}, () => this.validateName(name));
  }
  setContent(content){
    this.setState({content}, () => this.validateContent(content));
  }

  validateName(name) {
    const fieldErrors = {...this.state.validationMessages};
    this.nameValid = true;
    let hasError = false

    if (name.length === 0 || name.length < 5) {
      fieldErrors.name = "Name needs to be at least 5 characters long"
      this.nameValid = false
      hasError = true
    } else {
      fieldErrors.name = ''
      this.nameValid = true
      hasError = false
    }
    this.setState({validationMessages: fieldErrors, nameValid: !hasError}, this.formValid)
  }

  validateContent(content){
    const fieldErrors = {...this.state.validationMessages}
    this.contentValid = true;
    let hasError = false

    if (content.length === 0 || content.length < 10) {
        fieldErrors.content = "Note must be at least 10 characters long"
        this.contentValid = false
        hasError = true
    } else {
      fieldErrors.content = ''
      this.contentValid = true
      hasError = false
    }
    this.setState({validationMessages: fieldErrors, contentValid: !hasError}, this.formValid)
  }

  formValid() {
    if (this.state.nameValid && this.state.contentValid) {
      return this.setState({
        formValid: true
      });
    } else {
      return this.setState({
        formValid: false
      })
    }
    
  }
  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: this.state.name,
      content: this.state.content,
      folder_id: parseInt(e.target.folder.value),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/note/${note.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }
  render(){
    const { folders } = this.context
    let { folderValid, validationMessages, nameValid, contentValid } = this.state
    const folderArray = folders.map(folder => {
      return (
        <option value={folder.id} key={folder.id}>
          {folder.name}
        </option>
      )
    })
    return (
      <Error>
        <form className="newFolderForm" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="folder">Folder Name
        {!folderValid && (
          <p className="error">{validationMessages.folder}</p>
        )}</label>
        <select  id="folder" type="text" name="folder">{folderArray}</select>
          <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
        <label htmlFor="name">Note name
        {!nameValid && (
          <p className="error">{validationMessages.name}</p>
        )}</label>
        <input id='name' type='text' name='name' onChange={e => this.setName(e.target.value)} placeholder="Note Name"></input>
          <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
        <label htmlFor='content'>Note Content
        {!contentValid && (
          <p className='error'>{validationMessages.content}</p>
        )}</label>
        <input id='content' type='text' name='content' onChange={e => this.setContent(e.target.value)} ></input>
          <ValidationError hasError={!this.state.contentValid} message={this.state.validationMessages.content}/>
        <button type="submit" disabled={!this.state.formValid}>Submit</button>
      </form>
      </Error>
      
    )
  }
}

AddNote.propTypes = {
  name: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}

AddNote.defaultProps = {
  name: 'empty',
  folder: 'empty',
  content: 'empty'
}