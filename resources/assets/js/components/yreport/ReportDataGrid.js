import React from 'react' 
import Paper from 'material-ui/Paper'
// import ReactDataGrid from 'react-data-grid'
import { Editors, Toolbar, Formatters } from 'react-data-grid-addons'
import update from 'immutability-helper'
import _ from 'lodash'
import Tooltip from 'material-ui/Tooltip'
// import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import NumericEditor from './NumericEditor'
import ErrorBoundary from './wrapper/ErrorBoundary'
import NotifyBar from './NotifyBar';
import ReactDataGridWrapper from './wrapper/ReactDataGridWrapper'
import MyDropDownFormatter from './formatter/MyDropDownFormatter'

const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors
const { DropDownFormatter } = Formatters

// options for priorities autocomplete editor
// const priorities = [{ id: 0, title: 'Critical' }, { id: 1, title: 'High' }, { id: 2, title: 'Medium' }, { id: 3, title: 'Low'} ]
// const PrioritiesEditor = <AutoCompleteEditor options={priorities} />

// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
// const issueTypes = [
//   { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
//   { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
//   { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
//   { id: 'story', value: 'story', text: 'Story', title: 'Story' }
// ]

class CustomToolbar extends React.Component {
  render() {
    return (
      <Toolbar>
        <Tooltip id='tooltip_add_row' title='Create a new row'>
          <IconButton onClick={this.props.onAddRow}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip id='tooltip_save_grid' title='Save changes'>
          <IconButton onClick={this.props.onSaveGrid}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    )
  }
}

export default class ReportDataGrid extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = { 
      columns: [],
      rows: [],
      rowsToUpdate: [],
      dataNoToDelete: [],
      categoryFormatterOption: [
        {
          id: '',
          value: '',
          text: '',
          title: '',
        }
      ],
      categoryDropdownOption: [],
      yearDropdowns: this.createYearDropDown(1999),
      step: 'any',
      dirty: false,
      openNotifyBar: false,
      notifyDuration: null,
      notifyMsg: '這是一個通知訊息',
      debugMode: false,
      // rows: this.createRows(1000) 
    }
  }

  // createRows = (numberOfRows) => {
  //   let rows = []
  //   for (let i = 1 i < numberOfRows i++) {
  //     rows.push({
  //       id: i,
  //       task: 'Task ' + i,
  //       priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
  //       issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
  //     })
  //   }
  //   return rows
  // }

  handleNotifyBarOpen = (msg, notifyDuration) => {
    this.setState({ openNotifyBar: true, notifyMsg: msg, notifyDuration: notifyDuration })
  }

  handleNotifyBarClose = () => {
    this.setState({ openNotifyBar: false })
  }

  rowGetter = (i) => {
    return this.state.rows[i]
  }

  getDateNow = () => {
    let date = new Date()
    let now = date.toLocaleString('zh-TW', { hour12: false }).replace(/\/(\d)/gi, '-0$1').replace(/-0(\d\d)/gi, '-$1')
    return now
  }

  createYearDropDown = (start) => {
    let range = []
    let date = new Date()
    let yearNow = date.getFullYear()
    let end = yearNow + 1
    if (start > end) throw 'Range start must be less than end'
    for (let i = start; i < end; i++) {
      range.push({
        id: i,
        value: i,
        text: i,
        title: i,
      })
    }
    // console.log('range = '+range)
    return range
  }

  handleGridSort = (sortColumn, sortDirection) => {
    // console.log('sortColumn = '+sortColumn)
    // console.log('sortDirection = '+sortDirection)
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1
      }
    }
    const rows = sortDirection === 'NONE' ? this.state.rows.slice() : this.state.rows.sort(comparer)
    this.setState({ rows })
  }

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // console.log('handleGridRowsUpdated@'+this.constructor.name)
    // const now = this.getDateNow()
    let rows = this.state.rows.slice()
    let rowsToUpdate = this.state.rowsToUpdate.slice()
    let loginID = this.props.loginInfo.hasOwnProperty('loginname') ? this.props.loginInfo.loginname : 'test_no_login'
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i]
      let rowNoToUpdate = rowToUpdate.data_no
      // console.log('rowNoToUpdate='+rowNoToUpdate)
      rowsToUpdate = rowsToUpdate.filter(row => row.data_no !== rowNoToUpdate)
      let updatedRow = update(rowToUpdate, {$merge: updated})
      // updatedRow = updatedRow.map((row) => {row.latest_date = now return row})
      // console.log('i='+i)
      rowsToUpdate.push(updatedRow)
      rows[i] = updatedRow
      rows[i].login_id = loginID
    }
    // console.table(rowsToUpdate)
    this.setState({ rows, rowsToUpdate, dirty : true })
    // console.table(rows)
  }

  handleAddRow = ({ newRowIndex }) => {
    let rows = this.state.rows.slice()
    let newRowId = rows.length
    // console.log('newRowId = '+newRowId)
    let loginID = this.props.loginInfo.hasOwnProperty('loginname') ? this.props.loginInfo.loginname : 'test_no_login'
    const newRow = {
      // value: newRowIndex,
      id: newRowId,
      rep_no: this.props.reportID,
      data_no: 0,
      c_id: '',
      year: '',
      y_data: 0,
      latest_date: '',
      login_id: loginID
    }
    rows = update(rows, {$unshift: [newRow]}) //Add element to the start of an array
    // rows = update(rows, {$push: [newRow]}) //Add element to the end of an array
    this.setState({ rows, dirty : true })
  }

  handleDeleteRow = (deleteRow) => {
    // console.log(deleteRow)
    //Filter out the deleted row
    let rows = this.state.rows.slice()
    let deleteRowIndex = deleteRow.id
    let deleteDataNo = deleteRow.data_no
    // console.log('deleteRowIndex = '+deleteRowIndex)
    rows = rows.filter(row => row.id !== deleteRowIndex)
    //Store the number of deleted row
    let dataNoToDelete = this.state.dataNoToDelete
    if (deleteDataNo != null && deleteDataNo > 0) {
      console.log('added deleteDataNo = '+deleteDataNo)
      dataNoToDelete.push({data_no: deleteDataNo})
    }
    this.setState({ rows, dataNoToDelete, dirty : true })
  }

  handleSaveGrid = () => {
    const isDataDirty = this.state.dirty
    // console.log('isDataDirty = '+isDataDirty)
    if (isDataDirty) {
      //Prepare the data to be delete
      let deleteDataNo = this.state.dataNoToDelete
      if (deleteDataNo.length > 0) console.log(deleteDataNo)
      let reportToDelete = JSON.stringify(deleteDataNo)
      //Prepare the data to be update including new data to insert
      let rowsToUpdate = this.state.rows.slice()
      // let rowsToUpdate = this.state.rowsToUpdate.slice()
      // console.table(rowsToUpdate)
      let hasUnfinishedData = false
      let rowsToUpdateFilter = []
      let hasDuplicateData = false
      let categoryIdPerYear = ''
      let categoryIdPerYearSet = new Set()
      for (let i = 0; i < rowsToUpdate.length; i++) {
        let updateRow = rowsToUpdate[i]
        let filteredRow = _.omit(updateRow, ['id', 'class_id', 'rep_id', 'unit', 'description'])
        rowsToUpdateFilter.push(filteredRow)
        categoryIdPerYear = updateRow.year + updateRow.c_id
        if (categoryIdPerYearSet.has(categoryIdPerYear)) {
          hasDuplicateData = true
        } else {
          categoryIdPerYearSet.add(categoryIdPerYear)
        }
        if (updateRow.year == '' || updateRow.c_id == '') hasUnfinishedData = true
      }
      // console.table(rowsToUpdateFilter)
      if (hasUnfinishedData) {
        console.log('u have unfinished data')
        let msg = '您尚有未填報完成的資料'
        this.handleNotifyBarOpen(msg, null)
        return false
      }
      if (hasDuplicateData) {
        console.log('there are duplicate category_id within a year')
        let msg = '您在同一年度中有重複的分類資料'
        this.handleNotifyBarOpen(msg, null)
        return false
      }
      // let reportToUpdate = encodeURIComponent(JSON.stringify(rowsToUpdate))
      let reportToUpdate = JSON.stringify(rowsToUpdateFilter)
      //Prepare the user id to record the reporter
      let loginID = this.props.loginInfo.hasOwnProperty('loginname') ? this.props.loginInfo.loginname : 'test_no_login'
      // console.log('loginID='+loginID)
      //Prepare the request data and request config to send back to the database
      const postData = JSON.stringify({
        reportToDelete: reportToDelete,
        reportToUpdate: reportToUpdate,
        loginID: loginID,
      })
      const requestConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        // withCredentials: true,
      }
      let msg = <span>系統發生錯誤，請稍後再試或聯絡系統管理人
      <a href='mailto:skylock@ntnu.edu.tw' target='_blank'>skylock@ntnu.edu.tw</a>，謝謝!</span>
      axios.post('/api/updateReport', postData, requestConfig)
      .then(response => {
        console.log('finish request.')
        return response.data
      })
      .then(json => {
        console.log(json)
        if (json.result == 1) {
          // console.log('reset data dirty to false.')
          this.setState({ dirty : false }) //Reset the data dirty state when successfully write it back to db
          msg = '資料儲存成功!'
        }
        let exceptionGuest = (json.exception == 'guest')
        // console.log('exceptionGuest = ', exceptionGuest)
        if (exceptionGuest) {
          msg = '這是訪客測試功能用，不會儲存至資料庫，謝謝!'
          console.log('This is a guest error, will not actually write back to the DB')
        }
        this.handleNotifyBarOpen(msg, 6000)
      })
      .catch(error => {
        // Do something with the error object
        // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
        console.log(error)
        this.handleNotifyBarOpen(msg, null)
      })
    }
  }

  fetchData = reportID => {
    axios.get('/api/getReport/'+reportID)
    .then(response => {
      return response.data
    })
    .then(report => {
      let rowsForRender = report.data.map((data, idx) => {
        data.id = idx //Add a unique index for react to render component
        return data
      })
      // console.table(rowsForRender)
      
      let categoryDropdownOptionNew = []
      let categoryFormatterOptionNew = []
      // console.log('report.categories = ', report.categories)
      report.categories.map((data) => {
        let option = {}
        option.id = data.c_id //Add a unique index for react to render component
        option.value = data.c_id+''
        option.text = data.category_name
        option.title = data.category_name
        if (data.display) categoryDropdownOptionNew.push(option)
        categoryFormatterOptionNew.push(option)
      })
      // console.log('categoriesForDropdowns = ', categoriesForDropdowns)
      this.setState({ rows: rowsForRender, categoryDropdownOption: categoryDropdownOptionNew, categoryFormatterOption: categoryFormatterOptionNew })
    })
    .catch(error => {
      // Do something with the error object
      // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
      console.log(error)
    })
  }

  dirtyNotice = event => {
    const isDataDirty = this.state.dirty
    if (isDataDirty) event.returnValue = '您有資料尚未儲存，確定要離開嗎?'
  }

  componentDidMount() {
    console.log('this.props.reportID='+this.props.reportID)
    /* fetch API and get report data from a folder depends on report id*/
    this.fetchData(this.props.reportID)

    // window.addEventListener('beforeunload', this.dirtyNotice, {once: true})
    window.addEventListener('beforeunload', this.dirtyNotice)
    // console.log(window)
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('this.state = ', this.state)
    // console.log('prevState = ', prevState)
    // console.log('this.props = ', this.props)
    // console.log('prevProps = ', prevProps)
    if (this.props.reportID !== prevProps.reportID) {
      // console.log('content changed')
      console.log('this.props.reportID='+this.props.reportID)
      this.fetchData(this.props.reportID)
    }
  }

  handleNumericSettings = newStep => {
    this.setState({ step: newStep })
  }

  render() {
    const { login, loginInfo } = this.props //For production
    // const login = true //For debug
    let { rows, categoryDropdownOption, categoryFormatterOption, yearDropdowns, step, openNotifyBar, notifyDuration, notifyMsg, debugMode } = this.state
    // console.table(yearDropdowns)
    let yearEditor = login ? <DropDownEditor options={yearDropdowns}/> : null
    let categoryEditor = login ? <DropDownEditor options={categoryDropdownOption}/> : null
    // console.log('categoryEditor = ', categoryEditor)
    let defaultValue = categoryFormatterOption.length > 0 ? categoryFormatterOption[0].value : ''
    // console.log('defaultValue='+defaultValue)
    let categoryFormatter = <MyDropDownFormatter options={categoryFormatterOption} value={defaultValue}/>
    // console.log('categoryFormatter = ', categoryFormatter)
    let numericEditor = login ? <NumericEditor step={step}/> : null
    // console.log(numericEditor)
    //Apply boolean debugMode to indicate which column to be show when debugging, to hide when in production
    if (loginInfo.hasOwnProperty('u_level')) {
      debugMode = loginInfo.u_level != 1 ? true : false
    }
    let columns = [
      { key: 'id', name: 'ID', width: 80, hidden: !debugMode }, //React needs an id to make sure component is unique, not just from the database
      { key: 'rep_no', name: 'rep_no', hidden: !debugMode },
      { key: 'data_no', name: 'data_no', hidden: !debugMode }, //An unique id from the database
      { key: 'year', name: '年度', width: 200, editor: yearEditor, sortable: !login },
      { key: 'c_id', name: '分類', editor: categoryEditor, formatter: categoryFormatter, sortable: !login },
      { key: 'y_data', name: '數據', width: 275, editor: numericEditor, sortable: !login },
      { key: 'latest_date', name: '最後更新時間', hidden: !debugMode },
      { key: 'login_id', name: '填報人員', hidden: !debugMode },
      {
        key: '$delete',
        name: '', 
        width: 40, 
        getRowMetaData: (row) => row,
        formatter: ({ dependentValues }) => (
          <Tooltip id='tooltip_delete_row' title='Delete a row' placement='left'>
            <a 
              style={{color: 'rgba(0, 0, 0, 0.54)'}} 
              href='javascript:'
              onClick={() => this.handleDeleteRow(dependentValues)}>
              <DeleteIcon />
            </a>
          </Tooltip>
        ), 
        hidden: !login 
      },
    ]

    let dynamicColumns = columns.filter(function (column) {
      if (column.hasOwnProperty('hidden')) {
        return column.hidden === false
      }
      return true
    })
    // console.log('dynamicColumns = ', dynamicColumns)

    const wrapperProps = {
      originalRows: rows,
      originalColumns: dynamicColumns,
      originalStep: step,
      originalLogin: login,
      handleGridSort: this.handleGridSort,
      handleGridRowsUpdated: this.handleGridRowsUpdated,
      handleNumericSettings: this.handleNumericSettings,
      originalToolbar: <CustomToolbar onAddRow={this.handleAddRow} onSaveGrid={this.handleSaveGrid}/>,
    }
    // console.log('wrapperProps.originalColumns = ', wrapperProps.originalColumns)

    return (
      <Paper>
        {/* <ReactDataGrid
          enableCellSelect={login}
          // enableRowSelect={true}
          columnEquality={() => false} //Passing this prop to make DropDownEditor's option reflect the state changes
          columns={dynamicColumns}
          headerRowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          minHeight={height}
          onGridRowsUpdated={this.handleGridRowsUpdated} 
          toolbar={login && <CustomToolbar onAddRow={this.handleAddRow} onSaveGrid={this.handleSaveGrid}/>} 
        /> */}
        <ErrorBoundary>
          <ReactDataGridWrapper wrapper={wrapperProps} />
          <NotifyBar 
            open={openNotifyBar} 
            notifyDuration={notifyDuration}
            msg={notifyMsg} 
            handleClose={this.handleNotifyBarClose}
          />
        </ErrorBoundary>
      </Paper>
    )
  }
}