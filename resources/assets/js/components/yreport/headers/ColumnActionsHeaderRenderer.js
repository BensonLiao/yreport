import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ColumnEditor from './ColumnEditor'
import { COLUMN_CHANGE_TYPE } from '../redux/constants'
import Tooltip from 'material-ui/Tooltip'
import NumericEditorSettings from '../NumericEditorSettings'
// import './styles/header.css'

class ColumnActionsHeaderRenderer extends Component {
    static columnShape = {
        name: PropTypes.string,
        showTip: PropTypes.bool,
        toolTip: PropTypes.string,
    }

    static propTypes = {
        column: PropTypes.shape(ColumnActionsHeaderRenderer.columnShape),
        onColumnChanged: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props)
        // console.log('constructor@'+this.constructor.name)
        // console.log(props)
        this.handleEditColumnClick = this.handleEditColumnClick.bind(this)
        this.handleColumnChange = this.handleColumnChange.bind(this)
        this.handleColumnCommit = this.handleColumnCommit.bind(this)
        this.handleColumnDelete = this.handleColumnDelete.bind(this)
        this.handleColumnAdd = this.handleColumnAdd.bind(this)
        this.handleNumericSettings = this.handleNumericSettings.bind(this)
        this.toggleTooltips = this.toggleTooltips.bind(this)
        
        this.state = { 
            editing: false,
            name: props.column.name ,
            openSettings: false,
            openTooltips: false,
        }
    }

    componentWillReceiveProps({ column: { name: nextName } }) {
        if (nextName !== this.props.column.name) {
            this.setState({ name: nextName })
        }
    }

    handleEditColumnClick() {
        this.setState({ editing: true })
    }

    handleColumnChange({ target: { value }}) {
        this.setState({ name: value })
    }

    handleColumnCommit() {
        const { index, column, onColumnChanged } = this.props
        const { name } = this.state
        onColumnChanged({ type: COLUMN_CHANGE_TYPE.EDIT, column: { ...column, name }, index })
        this.setState({ editing: false })
    }

    handleColumnDelete() {
        const { index, onColumnChanged } = this.props
        onColumnChanged({ type: COLUMN_CHANGE_TYPE.DELETE, index })
    }

    handleColumnAdd() {
        onColumnChanged({ type: COLUMN_CHANGE_TYPE.ADD, index })
    }

    toggleTooltips(open) {
        this.setState({ openTooltips: open })
    }

    openNumericSettings() {
        this.setState({ openSettings: true })
    }

    handleNumericSettings(newStep) {
        this.props.handleNumericSettings(newStep)
    }

    getNumericSettings(step, toggleTooltips, handleNumericSettings) {
        // console.log('step = '+step)
        const { openTooltips } = this.state
        return <div style={{ float: 'right', height: '50px' }}>
            <Tooltip id='tooltip_number_settings' title='Number editor step settings' placement='left' open={openTooltips}>
                <NumericEditorSettings 
                    toggleTooltips={toggleTooltips}
                    handleNumericSettings={handleNumericSettings} 
                    step={step}
                />
            </Tooltip>
        </div>
    }

    render() {
        const { editing, name, openSettings, openTooltips } = this.state
        const { column: { key: columnKey, login: columnLogin, showTip: showTip, toolTip: toolTip } , openNumericSettings } = this.props
        // console.log('render column = ', this.props.column)
        // let columnName = name
        // if (showTip) {
        //     columnName = <Tooltip id={columnKey} title={toolTip} placement='right'>{name}</Tooltip>
        // }

        if (editing) {
            return <ColumnEditor name={name} handleChange={this.handleColumnChange} commitValue={this.handleColumnCommit} />
        }

        return (
            <div>
                {/* { this.props.column.name } */}
                {/* {columnName} */}
                {name}
                {/* {columnKey === 'y_data' && 
                columnLogin && 
                this.getNumericSettings(columnStep, this.toggleTooltips, this.handleNumericSettings)} */}
                {/* <div className="column-edit">
                <span className="glyphicon glyphicon-pencil column-action" onClick={this.handleEditColumnClick}></span>
                <span className="glyphicon glyphicon-remove column-action" onClick={this.handleColumnDelete}></span>
                <span className="glyphicon glyphicon-plus column-action" onClick={this.handleColumnAdd}></span>
                </div> */}
            </div>
            
        )
    }
}

export default ColumnActionsHeaderRenderer