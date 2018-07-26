import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import EditorContainer from 'react-data-grid'
import _ from 'lodash'

const columnShape = {
    key: PropTypes.string.isRequired
}

const EditorWrapper = WrappedEditor => {
    return class Wrapper extends Component {
        static propTypes = {
            column: PropTypes.shape(columnShape),
            value: PropTypes.any
        }

        constructor(props) {
            super(props)
            // console.log(props)
            this.handleValueChange = this.handleValueChange.bind(this)
            this.onKeyDownCapture = this.onKeyDownCapture.bind(this)
            this.state = { editorValue: props.value }
        }  

        disableContainerStyles = true

        componentDidMount() {
            // console.log('componentDidMount@'+this.constructor.name)
            // console.log(this.getInputNode())
        }

        getInputNode() {
            let domNode = ReactDOM.findDOMNode(this)
            if (domNode.tagName === 'INPUT') {
                return domNode
            }
            return domNode.querySelector('input:not([type=hidden])') || domNode
        }

        handleValueChange(event) {
            console.log('handleValueChange...')
            let value = event.target.value
            // console.log(event.target)
            switch (event.target.type) {
                case 'number':
                    value *= 1
                    // value = _.round(value, 6) //Round to 6 floating digit
                    break
                default:
                    break
            }
            // value *= 1
            // this.setState({ editorValue: value })
            this.setValue(value)
        }

        onKeyDownCapture(event) {
            console.log('onKeyDownCapture...')
            // console.log(event.isPropagationStopped())
            // this.props.onEditorKeyDown(event)
        }

        getValue() {
            return { [this.props.column.key]: this.state.editorValue }
        }

        setValue(value) {
            this.setState({ editorValue: value })
        }

        render() {
            // console.log('render WrappedEditor')
            return <WrappedEditor 
                {...this.props} 
                {...this.state} 
                onValueChanged={this.handleValueChange} 
                // onKeyDownCapture={this.onKeyDownCapture}
            />
        }
    }
}

export default EditorWrapper