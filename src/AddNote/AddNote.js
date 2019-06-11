import React from 'react';
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext';
import config from '../config';
import Error from '../Error';
import PropTypes from 'prop-types'


export default class AddNote extends React.Component{
  static defaultProps = {
    folders: [],
  }

  static contextType = ApiContext;


  constructor(props) {
    super(props);
    this.state = {
      noteName: '',
      noteContent: '',
      noteFolder: '',
      noteValid: false,
      validationMessage: '',
      error: null
    }
  }

  assignName = name => {
    this.setState({
      noteName: name
    },
    () => {this.validateName(name)})
  }

  assignContent = (content) => {
    this.setState({
      noteContent: content,
    })
  }

  assignNoteFolder = (folder) => {
    this.setState({
      noteFolder: folder,
    })
  }

  addNoteToTheList = (e) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'content-type' : 'application/json'
      },
      body: JSON.stringify({
        name: this.state.noteName,
        content: this.state.noteContent,
        folder_id: this.state.noteFolder,
        modified: Date.now(),
      })
    }
    fetch(`${config.API_ENDPOINT}/notes`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Something went wrong. Please refresh the page')

        } return res;
      })
      .then(data => data.json())
      .then(results => {
        const newNote = {
          id: results.id,
          name: results.name,
          modified: Date.now(),
          folder_id: results.folder_id,
          content: results.content,
          
          
        }
        this.context.AddNote(newNote)
      })
      .then(this.props.history.goBack())
      .catch(err => this.setState({
      error: err
    }))
  }

  validateName = (name) => {
    if (name.length === 0) {
      this.setState({
        validationMessage: 'The note name must be assigned',
        noteValid: false
      })
    } else {
      this.setState({
        validationMessage: null,
        noteValid: true
      })
    }
  }

  render() {
    const { folders } = this.context;
    return (
      <Error>
        <section className='add-note'>
          <h2>Add Note</h2>
          {this.state.error}
            <NotefulForm onSubmit={this.addNoteToTheList}>
              <h2>Note Values</h2>
              <div className='field'>
                <label htmlFor='add-note-name'>
                  {this.state.validationMessage} <br />
                  Note's Name
                </label>
                <input
                  onChange={e => this.assignName(e.target.value)}
                  type='text'
                  id='add-note' />
              </div>
              <div className='field'>
                <label htmlFor='add-note-content'>Note's Description</label>
                <textarea onChange={e => this.assignContent(e.target.value)} type='text' id='add-note-content'></textarea>
              </div>
              <div className='field'>
                <label htmlFor='add-note-folder'>Choose Folder</label>
              <select id='add-note-folder' onChange={e => this.assignNoteFolder(e.target.value)}>
                  <option value='choose one folder'>Choose One Folder</option>
                  {
                    folders.map(folder =>
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>)
                  }
                </select>
              </div>
              <div className='button-controls'>
                <button
                  disabled={!this.state.noteValid}
                  type='submit'>
                  Add note to the list
                </button>
              </div>
            </NotefulForm>
        </section>
      </Error>
    )
  }
}

AddNote.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func
  })
}