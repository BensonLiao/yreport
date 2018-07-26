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
import ErrorBoundary from './wrapper/ErrorBoundary'
import NotifyBar from './NotifyBar';
import TextEditor from './TextEditor';
import ReactDataGridWrapper from './wrapper/ReactDataGridWrapper'
import MyDropDownFormatter from './formatter/MyDropDownFormatter'

const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors
const { DropDownFormatter } = Formatters

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

export default class ReportCategoryGrid extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = { 
      columns: [],
      rows: [],
      dataNoToDelete: [],
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

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // console.log('handleGridRowsUpdated@'+this.constructor.name)
    // if (updated.hasOwnProperty('c_id')) console.log('updated c_id = '+updated.c_id)
    let rows = this.state.rows.slice()
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      // console.log('rowToUpdate.new = '+rowToUpdate.new)
      if (rowToUpdate.new != 'yes' && updated.hasOwnProperty('c_id')) {
        //Do not let user change the existing c_id but only new category record
        // console.log('current c_id = '+rowToUpdate.c_id)
        updated.c_id = rowToUpdate.c_id
      }
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }
    this.setState({ rows, dirty : true })
    // console.table(rows)
  }

  handleAddRow = ({ newRowIndex }) => {
    let rows = this.state.rows.slice()
    let lastRowId = rows[rows.length-1].id
    let newRowId = lastRowId+1
    // console.log('lastRowId = '+lastRowId)
    const newRow = {
      id: newRowId,
      rep_no: this.props.reportID,
      c_id: '',
      category_name: '',
      new: 'yes',
      display: 1,
    }
    rows = update(rows, {$push: [newRow]})
    this.setState({ rows, dirty : true })
  }

  handleDeleteRow = (deleteRow) => {
    // console.log('deleteRowIndex = '+typeof deleteRowIndex)
    // console.log(deleteRow)
    //Filter out the deleted row
    let rows = this.state.rows.slice()
    let deleteRowIndex = deleteRow.id
    let deleteReportNo = deleteRow.rep_no
    let deleteCategoryID = deleteRow.c_id
    rows = rows.filter(row => row.id !== deleteRowIndex)
    //Store the number of deleted row
    let dataNoToDelete = this.state.dataNoToDelete
    if (deleteReportNo != null && deleteReportNo > 0 && deleteCategoryID != null && deleteCategoryID != '') {
      console.log('added deleteReportNo = '+deleteReportNo+' and deleteCategoryID = '+deleteCategoryID)
      dataNoToDelete.push({rep_no: deleteReportNo, c_id: deleteCategoryID})
    }
    this.setState({ rows, dataNoToDelete, dirty : true })
  }

  handleSaveGrid = () => {
    const { loginInfo } = this.props
    const isDataDirty = this.state.dirty
    // console.log('isDataDirty = '+isDataDirty)
    if (isDataDirty) {
      //Prepare the data to be delete
      let deleteDataNo = this.state.dataNoToDelete
      if (deleteDataNo.length > 0) console.log(deleteDataNo)
      let categoryToDelete = JSON.stringify(deleteDataNo)
      //Prepare the data to be update including new data to insert
      let rowsToUpdate = this.state.rows.slice()
      // let rowsToUpdate = this.state.rowsToUpdate.slice()
      // console.table(rowsToUpdate)
      let unFinishedData = false
      let rowsToUpdateFilter = []
      for (let i = 0; i < rowsToUpdate.length; i++) {
        let updateRow = rowsToUpdate[i]
        let filteredRow = _.omit(updateRow, ['id', 'class_id', 'rep_id', 'unit', 'new'])
        rowsToUpdateFilter.push(filteredRow)
        if (updateRow.category_name == '' || updateRow.c_id == '') unFinishedData = true
      }
      console.table(rowsToUpdateFilter)
      if (unFinishedData) {
        console.log('u have unfinished data')
        let msg = '您尚有未填報完成的資料'
        this.handleNotifyBarOpen(msg, null)
        return false
      }
      // let categoryToUpdate = encodeURIComponent(JSON.stringify(rowsToUpdate))
      let categoryToUpdate = JSON.stringify(rowsToUpdateFilter)
      //Prepare the request data and request config to send back to the database
      const postData = JSON.stringify({
        categoryToDelete: categoryToDelete,
        categoryToUpdate: categoryToUpdate,
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
      if (loginInfo.hasOwnProperty('u_level')) {
        if (loginInfo.u_level == 1) {
          msg = '功能目前維護中，請暫時不要使用，謝謝!'
          this.handleNotifyBarOpen(msg, null)
          return false
        }
      }
      axios.post('/api/updateCategory', postData, requestConfig)
      .then(response => {
        console.log('finish request.')
        return response.data
      })
      .then(json => {
        console.log(json)
        if (json.result || json.result > 0) {
          // console.log('reset data dirty to false.')
          this.setState({ dirty : false }) //Reset the data dirty state when successfully write it back to db
          msg = '資料儲存成功!'
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
    axios.get('/api/getCategory/'+reportID)
    .then(response => {
      return response.data
    })
    .then(report => {
      // console.table(report)
      let rowsForRender = report.categories.map((data, idx) => {
        data.id = idx //Add a unique index for react to render component
        // console.log(data)
        // console.log('typeof data.category_name = '+typeof data.category_name)
        return data
      })
      // console.table(rowsForRender)
      this.setState({ rows: rowsForRender })
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
    // console.log('this.props.reportID='+this.props.reportID)
    // console.log('prevProps.reportID='+prevProps.reportID)
    if (this.props.reportID !== prevProps.reportID) {
      // console.log('content changed')
      console.log('this.props.reportID='+this.props.reportID)
      this.fetchData(this.props.reportID)
    }
  }

  render() {
    const { rows, openNotifyBar, notifyDuration, notifyMsg, debugMode } = this.state
    let displayOption = [
      {
        id: 0,
        value: 0,
        text: '否',
        title: '否',
      },
      {
        id: 1,
        value: 1,
        text: '是',
        title: '是',
      },
    ]
    let displayFormatter = <MyDropDownFormatter options={displayOption} value={1}/>
    // let textEditor = login ? <TextEditor/> : null
    // let tip = '只能編輯新增之分類編號'
    //Apply boolean debugMode to indicate which column to be show when debugging, to hide when in production
    let columns = [
      { key: 'id', name: 'ID', width: 80, hidden: !debugMode }, //React needs an id to make sure component is unique, not just from the database
      { key: 'rep_no', name: 'rep_no', hidden: !debugMode },
      // { key: 'c_id', name: '分類編號', editor: textEditor },
      { key: 'c_id', name: '分類編號', editable: true },
      { key: 'category_name', name: '分類名稱', editable: true },
      { key: 'display', name: '顯示於統計資料分類下拉選單', formatter: displayFormatter },
      { key: 'new', name: 'new', hidden: !debugMode },
      // {
      //   key: '$delete',
      //   name: '', 
      //   width: 40, 
      //   getRowMetaData: (row) => row,
      //   formatter: ({ dependentValues }) => (
      //     <Tooltip id='tooltip_delete_row' title='Delete a row' placement='left'>
      //       <a 
      //         style={{color: 'rgba(0, 0, 0, 0.54)'}} 
      //         href='javascript:'
      //         onClick={() => this.handleDeleteRow(dependentValues)}>
      //         <DeleteIcon />
      //       </a>
      //     </Tooltip>
      //   ), 
      //   hidden: false 
      // },
    ]

    let dynamicColumns = columns.filter(function (column) {
      if (column.hasOwnProperty('hidden')) {
        return column.hidden === false
      }
      return true
    })

    const wrapperProps = {
      originalRows: rows,
      originalColumns: dynamicColumns,
      originalLogin: true,
      handleGridRowsUpdated: this.handleGridRowsUpdated,
      // originalToolbar: <CustomToolbar onAddRow={this.handleAddRow} onSaveGrid={this.handleSaveGrid}/>,
    }
    // console.log(wrapperProps)

    return (
      <Paper>
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