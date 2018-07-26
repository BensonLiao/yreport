import React from 'react'
import PropTypes from 'prop-types'
import EditorWrapper from './wrapper/EditorWrapper'
// import TextField from 'material-ui/TextField'
import Input from 'material-ui/Input'

const NumericEditor = ({ editorValue, maxValue, onValueChanged, ...editorProps }) => {
  // console.log(editorProps)
  return (
    <div>
      {/* <TextField
        id="number"
        label="Number"
        value={editorValue}
        onChange={onValueChanged}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      /> */}

      <Input
        id="number"
        label="Number"
        // defaultValue={editorValue} //The default input value, useful when not controlling the component.
        value={editorValue} //The input value, required for a controlled component.\
        onChange={onValueChanged}
        onBlur={editorProps.onBlur}
        type="number"
        fullWidth
        inputProps={{
          'shrink': 'true',
          'min': editorProps.minValue,
          'step': editorProps.step,
        }}
        // inputRef={node => {console.log(node)}}
      />
      
      {/* <input
        id="number"
        label="Number"
        type="number"
        defaultValue={editorValue} //The default input value, useful when not controlling the component.
        // value={editorValue} //The input value, required for a controlled component.\
        onChange={onValueChanged}
        onBlur={editorProps.onBlur}
        min={editorProps.minValue}
        step={editorProps.step}>
      </input> */}
    </div>
  )
}

NumericEditor.propTypes = {
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  step: PropTypes.any,
  editorValue: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func.isRequired,
}

NumericEditor.defaultProps = {
  maxValue: 100,
  minValue: 0,
  step: 'any'
}

export default EditorWrapper(NumericEditor)
export { NumericEditor }