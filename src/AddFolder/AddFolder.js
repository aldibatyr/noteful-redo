import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import Error from '../Error';
import NotefulForm from '../NotefulForm/NotefulForm';
import ValidationError from '../ValidationError/ValidationError';
import PropTypes from 'prop-types';


export default class AddFolder extends React.Component{
  static contextType = ApiContext;
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      nameValid: false,
      hasError: false,
      formValid: false,
      validationMessage: {
        name: '',
        content: ''
      }
    }
  }
  
  assignFolderName = name => {
    this.setState({
      name
    }, () => this.validateName(name))
  }

  validateName(name) {
    const feildError = {...this.state.validationMessage};
    this.nameValid = true;
    let hasError = false

    if (name.length === 0 || name.length < 3) {
      feildError.name = 'Name needs to be at least 3 characters long';
      this.nameValid = false;
      hasError = true;
    } else {
      feildError.name = '';
      this.nameValid = true;
      hasError = false;
    }
    this.setState({validationMessage: feildError, nameValid: !hasError}, this.formValid)
  }

  formValid() {
    this.setState({
      formValid: this.state.nameValid
    })
  }

  postFolderToAPI = e => {
    e.preventDefault()
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({name: this.state.name})
    }

    fetch(`${config.API_ENDPOINT}/folders`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong. Please refresh the page')
        }
          
        return res;
      })
      .then(data => data.json())
      .then(results => {
        const newFolder = {
          name: results.name,
          id: results.id
        }
        this.context.addFolder(newFolder)
      })
      .then(this.props.history.goBack())
      .catch(error => {
        console.error({ error })
    })
  }

  render() {
    let {folderValid, validationMessage} = this.state
    return (
      <Error>
        <section className='AddFolder'>
          <h2>Create a Folder</h2>
          <NotefulForm onSubmit={this.postFolderToAPI}>
            <div className='field'>
              <label htmlFor='folder-name-input'>
                Name
                {!folderValid && (
                  <p className='error'>{validationMessage.name}</p>
                )}
              </label>
              <input
                type='text'
                id='folder-name-input'
                onChange={e => this.assignFolderName(e.target.value)}
                placeholder='note name' />
              <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessage.name}/>
            </div>
            <div className='buttons'>
              <button type='submit' disabled={!this.state.formValid}>
                Add Folder
              </button>
            </div>
          </NotefulForm>
        </section>
      </Error>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func
  }),
  name: PropTypes.string,
  nameValid: PropTypes.bool,
  validationMessage: PropTypes.string
}