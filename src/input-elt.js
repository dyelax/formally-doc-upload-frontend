import React from 'react'
import Dropzone from 'react-dropzone'

import uploadIcon from './assets/upload.png'
import uploadIconWhite from './assets/upload-white.png'
import docIcon from './assets/doc.png'
import plusIcon from './assets/plus.png'


class InputElt extends React.Component {
  constructor(props) {
    super(props)
    this.input = React.createRef();
    this.fileList = React.createRef();
    this.state = {
      hover: false,
      files: [],
      // files: [{name: 'a'}],
      // files: [{name: 'a'}, {name: 'a'}, {name: 'a'}, {name: 'a'}],
      thumbnails: {},
      docName: '',
    }
  }

  saveName = () => {
    // TODO save doc name in backend
    console.log(`Save ${this.state.docName}`)
  }

  uploadFiles = files => {
    // TODO upload file to database
    console.log(`Upload ${files.map(file => file.name)}`)
  }

  fileExists = file => {
    return this.state.files.some(f => f.name === file.name)
  }

  onFilesSelected = files => {
    // Load the image for a preview
    let uniqueFiles = [];
    files.forEach(file => {
      if (this.fileExists(file)) {
        // TODO: show error in UI
        console.warn(`File ${file.name} already exists in this document. Not uploading.`)
      } else {
        // Read the file data to display the thumbnail
        const reader = new FileReader()
        reader.onload = () => {
          let img = reader.result

          // Update state
          let new_thumbnails = {...this.state.thumbnails}
          new_thumbnails[file.name] = img
          this.setState({thumbnails: new_thumbnails})
        }
        reader.readAsDataURL(file)

        this.state.files.push(file)
        uniqueFiles.push(file)
      }

    })

    this.uploadFiles(uniqueFiles)
  }

  removeFile = file => {
    // TODO remove file in backend
    console.log(`Remove ${file.name}`)

    // Remove the file from the local state
    let files = [...this.state.files]
    let thumbnails = {...this.state.thumbnails}

    files.splice(files.indexOf(file), 1)
    delete thumbnails[file.name]

    this.setState({files: files, thumbnails: thumbnails})
  }

  openFileInput = () => {
    this.input.current.click()
  }

  done = () => {
    // TODO close modal
    // TODO check and make sure there's a doc name and uploaded file
    this.saveName();
    console.log(`Done`)
  }

  render = () => {
    return(
      <div className='container'>
        <Dropzone
          accept={['image/*', 'application/pdf']}
          noClick
          onDropAccepted={this.onFilesSelected}
          onDropRejected={files => console.log(`Rejected ${files}`)}
          onDrop={e => this.setState({hover: false})}
          onDragEnter={e => this.setState({hover: true})}
          onDragLeave={e => this.setState({hover: false})}
        >
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} className='dropzone'>
                <input {...getInputProps()} ref={this.input}/>
                <div className='titleContainer'>
                  <p>Upload a Document</p>
                </div>
                <div className='nameContainer'>
                  <input className='nameInput' type="text" name="name"
                    placeholder="Enter Document Name"
                    value={this.state.docName}
                    onChange={e => {this.setState({docName: e.target.value})}}/>
                </div>

                <div className='fileDisplayContainer'>
                  {
                    this.state.files.length > 0
                    ?
                    <ul className='fileList' ref={this.fileList}>
                      {
                        this.state.files.map((file, i) => (
                          <li key={i} className='fileElement'>
                            <img className='filePreview' alt={file.name} src={file.name in this.state.thumbnails ? this.state.thumbnails[file.name] : docIcon} />
                            <button className='removeFileButton' onClick={() => this.removeFile(file)}>remove</button>
                          </li>
                        ))
                      }
                    </ul>
                    :
                    <div className='emptyFileList' onClick={this.openFileInput}>
                      <img className='emptyFileListIcon' src={uploadIcon} alt='' />
                      <p className='emptyFileListMessage'>Add files for this document</p>
                    </div>
                  }
                </div>

                <div className='actionButtonOuterContainer'>
                  <div className='actionButtonContainer addDocumentButtonContainer'>
                    <button className='actionButton addDocumentButton' onClick={this.openFileInput}>
                      <div className='actionButtonInnerContainer'>
                        <img className='plusIcon' src={plusIcon} alt='' />
                        <p className='addFileText'>Add a File</p>
                      </div>
                    </button>
                  </div>
                  <div className='actionButtonContainer saveButtonContainer'>
                    <button className='actionButton saveButton' onClick={this.done}>
                      Done
                    </button>
                  </div>
                </div>

                {
                  this.state.hover &&
                  <div className='dragOverlay'>
                    <img className='dragOverlayIcon' src={uploadIconWhite} alt='' />
                    <p className='dragOverlayMessage'>Drop to add files</p>
                  </div>
                }
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    )
  }
}
export default InputElt
