// Used for displaying the value of a dropdown (using DropDownEditor) when not editing it.
// Accepts the same parameters as the DropDownEditor.
import React from 'react'
import PropTypes from 'prop-types'

export default class MyDropDownFormatter extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          text: PropTypes.string,
          title: PropTypes.string
        })
      ])).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }

//This will cause grid's update problem on DropDownFormatter when their options have duplicate id
//   shouldComponentUpdate(nextProps) {
//     return nextProps.value !== this.props.value
//   }

  render() {
    // console.log('this.props.value = ', this.props.value)
    // console.log('typeof this.props.value = ', typeof this.props.value)
    let value = this.props.value
    let option = this.props.options.filter(function(v) {
      return v === value || v.value === value
    })[0]
    if (!option) {
      option = value
    }
    let title = option.title || option.value || option
    let text = option.text || option.value || option
    return <div title={title}>{text}</div>
  }
}