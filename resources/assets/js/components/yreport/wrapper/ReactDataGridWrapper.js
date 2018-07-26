import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDataGrid from'react-data-grid'
import COLUMN_CHANGES from './columnActionHandlers'
import { connectHeader } from '../headers/columnActionHeader'
import { handleGridRowsUpdated, handleModalClose } from './defaultHandlers'
import { findDOMNode } from 'react-dom';

const wrapperPropsShape = {
    originalRows: PropTypes.array.isRequired,
    originalColumns: PropTypes.array.isRequired,
    originalStep: PropTypes.any,
    originalLogin: PropTypes.bool,
    handleNumericSettings: PropTypes.func,
    originalToolbar: PropTypes.object
}

class ReactDataGridWrapper extends Component {
    constructor(props) {
        super(props)
        // console.log('props = ', props)
        this.rowGetter = this.rowGetter.bind(this)
        this.handleColumnChange = this.handleColumnChange.bind(this)
        this.handleGridSort = this.handleGridSort.bind(this)
        this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this)
        this.handleNumericSettings = this.handleNumericSettings.bind(this)

        const { wrapper: { 
            originalRows: rows, 
            originalColumns: columns, 
            originalToolbar: toolbar, 
            // originalStep: step, 
            // originalLogin: login, 
            handleNumericSettings: handleNumericSettings,
            handleGridSort: handleGridSort, 
            handleGridRowsUpdated: handleGridRowsUpdated, 
        }} = props

        this.setColumns = connectHeader({ 
            handleColumnChange: this.handleColumnChange, 
            handleNumericSettings: handleNumericSettings,
        })

        const viewWidth = window.innerWidth - 280
        this.state = {
            rows,
            columns,
            toolbar,
            minWidth: viewWidth
        }
    }

    static defaultProps = {
        gridProps: {}
    }

    static propTypes = {
        wrapper: PropTypes.shape(wrapperPropsShape).isRequired
    }

    changeWidth = (min) => {
        if (typeof min != 'number' || min < 280) {
            const msg = 'the min width must be an integer and at least 280px'
            console.error(msg)
            return msg
        }
        // console.log('window.innerWidth = ', window.innerWidth)
        const minWidth = (window.innerWidth > min ? (window.innerWidth > 960 ? window.innerWidth - 280 : window.innerWidth) : min)
        this.setState({ minWidth })
    }

    componentDidMount() {
        // When the component is mounted, add your DOM listener to the element, set the third argument to true on addEventListener() will using the capturing phase which is occur before the bubbling phase.
        // console.log(this.datagrid)
        findDOMNode(this.datagrid).addEventListener('keydown', (event) => {
            // console.log('onkeydown capturing phase')
            // console.log(event.target)
            let inputType = event.target.type
            let key = event.key
            let keyCode = event.keyCode
            if (inputType === 'number' && (key === 'ArrowUp' && keyCode === 38) || (key === 'ArrowDown' && keyCode === 40)) {
                event.stopPropagation() //Just to stop the third-party's custom event execution and make number input's default keydown/up event works
                // event.preventDefault() //This will not stop the third-party's custom event execution
                // console.log('on arrow up or down inside input type:number')
            }
        }, true)

        const minWidth = 350
        this.changeWidth(minWidth)

        window.addEventListener('resize', () => {
            // Re-render grid
            // May be recalculate grid's minWidth and setState
            this.changeWidth(minWidth)
            // Or may be forceUpdate (not a huge fan of this approach)
            // this.forceUpdate()
         })
        // console.log(this.datagrid)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => {})
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('componentDidUpdate@'+this.constructor.name)
        // console.log('this.props = ', this.props)
        // console.log('prevProps = ', prevProps)
        // console.log('this.props columns options = ', this.props.wrapper.originalColumns[1].formatter.props.options)
        // console.log('prevProps columns option = ', prevProps.wrapper.originalColumns[1].formatter.props.options)
        // let thisColomnFormatterOptions = this.props.wrapper.originalColumns[1].formatter.props.options
        // let prevColomnFormatterOptions = prevProps.wrapper.originalColumns[1].formatter.props.options
        if (this.props.wrapper.originalRows !== prevProps.wrapper.originalRows) {
            this.setState({rows: this.props.wrapper.originalRows})
        }
        if (this.props.wrapper.originalColumns !== prevProps.wrapper.originalColumns) {
            // console.log('update columns...')
            this.setState({columns: this.props.wrapper.originalColumns})
        }
    }

    rowGetter(i) {
        return this.state.rows[i]
    }

    handleColumnChange({ type, ...extra }) {
        // console.log('handleColumnChange')
        const updatedCb = COLUMN_CHANGES[type]
        this.setState(updatedCb({ ...extra, handleColumnChange: this.handleColumnChange }))
    }

    handleModalClose() {
        this.setState(handleModalClose)
    }

    handleGridSort(sortColumn, sortDirection) {
        // console.log('handleGridSort@'+this.constructor.name)
        this.props.wrapper.handleGridSort(sortColumn, sortDirection)
    }

    handleGridRowsUpdated(update) {
        // console.log('handleGridRowsUpdated@'+this.constructor.name)
        // console.log(update)
        this.props.wrapper.handleGridRowsUpdated(update)
        // this.setState(handleGridRowsUpdated(update))
    }

    handleNumericSettings(newStep) {
        handleNumericSettings(newStep)
    }

    render() {
        const { columns, rows, toolbar, minWidth } = this.state
        const { gridProps, wrapper: { 
            originalLogin: login, 
            // originalColumns: columns, 
        }} = this.props
        // console.log('render column = ', columns)
        // console.log('this.setColumns(columns) = ', this.setColumns(columns))

        const headerHeight = 50
        const rowsHeight = rows.length * 35 + headerHeight
        // console.log('rowsHeight='+rowsHeight)
        const viewHeight = window.innerHeight - 220
        // console.log('viewHeight='+viewHeight)
        const height = rowsHeight > viewHeight ? viewHeight : rowsHeight
        // console.log('height='+height)

        return  (
            <div>
                <ReactDataGrid
                    ref={node => this.datagrid = node}
                    columnEquality={() => false} //Passing this prop to make DropDownEditor's option reflect the state changes
                    enableCellSelect={true}
                    rowGetter={this.rowGetter}
                    rowsCount={rows.length}
                    minHeight={height}
                    minWidth={minWidth}
                    headerRowHeight={headerHeight}
                    onGridSort={this.handleGridSort}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    {...gridProps}
                    columns={this.setColumns(columns)} 
                    toolbar={login && toolbar} 
                />
            </div>
        )
    }
}

export default ReactDataGridWrapper