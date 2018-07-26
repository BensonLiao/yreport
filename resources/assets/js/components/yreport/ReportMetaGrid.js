import React from 'react' 
import Paper from 'material-ui/Paper'
// import _ from 'lodash'
import Tooltip from 'material-ui/Tooltip'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import SaveIcon from '@material-ui/icons/Save'
import ErrorBoundary from './wrapper/ErrorBoundary'
import NotifyBar from './NotifyBar';
import TextField from 'material-ui/TextField';
// import Input from 'material-ui/Input';
// import InputLabel from 'material-ui/Input/InputLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from 'material-ui/Form/FormControl';

export default class ReportMetaGrid extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = { 
      reportMeta: {
        reportNo: 0,
        reportName: '',
        reportUnit: '',
        reportDesc: '',
      },
      dirty: false,
      openNotifyBar: false,
      notifyDuration: null,
      notifyMsg: '這是一個通知訊息',
    }
  }

  handleNotifyBarOpen = (msg, notifyDuration) => {
    this.setState({ openNotifyBar: true, notifyMsg: msg, notifyDuration: notifyDuration })
  }

  handleNotifyBarClose = () => {
    this.setState({ openNotifyBar: false })
  }

  handleReportMetaChange = name => event => {
    let reportMeta = {...this.state.reportMeta}
    reportMeta[name] = event.target.value
    this.setState({ reportMeta, dirty: true });
  }

  handleSaveGrid = () => {
    const isDataDirty = this.state.dirty
    // console.log('isDataDirty = '+isDataDirty)
    if (isDataDirty) {
      //Prepare the data to be update including new data to insert
      let reportMetaToUpdate = this.state.reportMeta
      console.log(reportMetaToUpdate)
      let unFinishedData = false
      if (reportMetaToUpdate.reportName == '') unFinishedData = true
      if (unFinishedData) {
        console.log('u have unfinished data')
        let msg = '您尚有未填報完成的資料'
        this.handleNotifyBarOpen(msg, null)
        return false
      }
      // let reportToUpdate = encodeURIComponent(JSON.stringify(rowsToUpdate))
      let metaToUpdate = JSON.stringify(reportMetaToUpdate)
      //Prepare the request data and request config to send back to the database
      const postData = JSON.stringify({
        metaToUpdate: metaToUpdate,
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
      axios.post('/api/updateReportMeta', postData, requestConfig)
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
    axios.get('/api/getReportMeta/'+reportID)
    .then(response => {
      return response.data
    })
    .then(json => {
      // console.log(json.meta[0])
      let reportMeta = {...this.state.reportMeta}
      reportMeta.reportNo = reportID
      reportMeta.reportName = json.meta[0].rep_name == null ? '' : json.meta[0].rep_name
      reportMeta.reportUnit = json.meta[0].unit == null ? '' : json.meta[0].unit
      reportMeta.reportDesc = json.meta[0].description == null ? '' : json.meta[0].description
      // console.log(reportMeta)
      this.setState({ reportMeta })
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

  componentWillUnmount () {
    window.removeEventListener('beforeunload', this.dirtyNotice)
    this.setState({ reportMeta: null })
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
    const { formClass, formFieldClass } = this.props //For production
    // const login = true //For debug
    const { reportMeta: {reportName: name, reportUnit: unit, reportDesc: desc}, openNotifyBar, notifyDuration, notifyMsg } = this.state

    return (
      <Paper>
        <ErrorBoundary>
          <form className={formClass} noValidate autoComplete="off">
            <TextField
              id="report-name"
              label="報告名稱"
              className={formFieldClass}
              value={name}
              onChange={this.handleReportMetaChange('reportName')}
              margin="normal"
              required
              placeholder='請輸入報告名稱'
            />
            <TextField
              id="report-unit"
              label="數據單位"
              className={formFieldClass}
              value={unit}
              onChange={this.handleReportMetaChange('reportUnit')}
              margin="normal"
              placeholder='請輸入數據單位'
            />
            <TextField
              id="report-desc"
              label="報告描述"
              className={formFieldClass}
              value={desc}
              onChange={this.handleReportMetaChange('reportDesc')}
              margin="normal"
              fullWidth
              multiline
              rowsMax='6'
              placeholder='請輸入報告描述'
            />
          </form>
          <Tooltip id='tooltip_save_grid' title='Save changes'>
            <Button variant="flat" size="large" onClick={this.handleSaveGrid}>
              <SaveIcon/>
              儲存
            </Button>
          </Tooltip>
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