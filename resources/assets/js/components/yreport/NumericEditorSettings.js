import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem } from 'material-ui/Menu'
import Select from 'material-ui/Select'

class NumericEditorSettings extends React.Component {

  constructor(props) {
    super(props)
    // console.log(props)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onClick = this.onClick.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = { step: 1 }
  }

  onMouseEnter = event => {
    // console.log('onMouseEnter')
    this.props.toggleTooltips(true)
  }

  onMouseLeave = event => {
    this.props.toggleTooltips(false)
  }

  onClick = event => {
    this.props.toggleTooltips(false)
  }

  handleChange = event => {
    this.props.handleNumericSettings(event.target.value)
    this.setState({ step: event.target.value })
  }

  render() {
    const { step } = this.props

    return (
      <Select
        value={step}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        onChange={this.handleChange}
        displayEmpty
        name="step"
      >
        <MenuItem value={1}><em>1</em></MenuItem>
        <MenuItem value={0.1}>0.1</MenuItem>
        <MenuItem value={0.01}>0.01</MenuItem>
        <MenuItem value={0.001}>0.001</MenuItem>
      </Select>
    )
  }
}

export default NumericEditorSettings