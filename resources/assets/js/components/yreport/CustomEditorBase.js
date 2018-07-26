import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const columnShape = {
    key: PropTypes.string.isRequired
};

const CustomEditorBase = WrappedEditor => {
   return class Wrapper extends Component {
        static propTypes = {
            column: PropTypes.shape(columnShape).isRequired,
            value: PropTypes.any
        }

        constructor(props) {
            super(props);
            this.handleValueChange = this.handleValueChange.bind(this);
            this.state = { editorValue: props.value };
        }  

        disableContainerStyles = true

        getInputNode() {
            let domNode = ReactDOM.findDOMNode(this);
            if (domNode.tagName === 'INPUT') {
                return domNode;
            }

            return domNode.querySelector('input:not([type=hidden])') || domNode;
        }

        handleValueChange(value) {
            console.log(value);
            // console.table(value.ref);
            this.setState({ editorValue: value });
        }

        getValue() {
            return { [this.props.column.key]: this.state.editorValue };
        }

        render() {
            return <WrappedEditor {...this.props} {...this.state} onValueChanged={this.handleValueChange} />
        }
   };
};

export default CustomEditorBase;