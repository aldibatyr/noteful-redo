import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import Error from '../Error';
import NotefulForm from '../NotefulForm/NotefulForm';
import PropTypes from 'prop-types';


export default class AddFolder extends React.Component{
  static contextType = ApiContext;
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      nameValid: false,
      validationMessage: ''

    }
  }
  
  assignFolderName = name => {
    this.setState({
      name
    })
    console.log(this.state.folderName)
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
    return (
      <Error>
        <section className='AddFolder'>
          <h2>Create a Folder</h2>
          <NotefulForm onSubmit={this.postFolderToAPI}>
            <div className='field'>
              <label htmlFor='folder-name-input'>
                Name
              </label>
              <input
                type='text'
                id='folder-name-input'
                onChange={e => this.assignFolderName(e.target.value)} />
            </div>
            <div className='buttons'>
              <button type='submit'>
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
  })
}