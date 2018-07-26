import React from 'react'
import PropTypes from 'prop-types'
import EditorWrapper from './wrapper/EditorWrapper'
import TextField from 'material-ui/TextField'

const TextEditor = ({ editorValue, onValueChanged, ...editorProps }) => {
  // console.log(editorProps)
  return (
    <div>
      <TextField
        id="text"
        label="Text"
        value={editorValue}
        onChange={onValueChanged}
        margin="normal"
        fullWidth
      />
    </div>
  )
}

TextEditor.propTypes = {
  editorValue: PropTypes.string.isRequired,
  onValueChanged: PropTypes.func.isRequired,
}

export default EditorWrapper(TextEditor)
export { TextEditor }