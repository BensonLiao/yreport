import React from 'react'
import {Provider} from 'react-redux'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
// import MenuIcon from '@material-ui/icons/Menu'
// import Hidden from 'material-ui/Hidden'
import Grid from 'material-ui/Grid'
import ExpansionPanel from 'material-ui/ExpansionPanel'
import ExpansionPanelSummary from 'material-ui/ExpansionPanel/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TabbedFileViewer from './TabbedFileViewer'
import ReportMetaGrid from './ReportMetaGrid'
import ReportCategoryGrid from './ReportCategoryGrid'
import ReportDataGrid from './ReportDataGrid'
// import MyD3Component from './MyD3Component'
// import D3BarChart from './D3BarChart'
// import configureStore from './redux/configureStore'
// import BarChartContainer from './BarChartContainer'
// import App from '../rd3/containers/App'

// const store = configureStore()

const contentDefault = {
  display: 'flex', 
  justifyContent: 'center', 
  marginBottom: 20,
}

const linkButton = {
  height: '30%',
  minHeight: '200px',
  fontSize: '2rem',
  marginTop: '20%',
}

export default class YearReportContent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      textWidth: '80%',
      odometerWidth: '100%',
    }
  }

  openFactBook = () => { 
    // window.open('http://factbook.iro.ntnu.edu.tw', '_blank') 
    window.open('http://factbook.iro.ntnu.edu.tw', '_self') 
  }

  componentDidUpdate() {
    // console.log('this.props.contentID = '+this.props.contentID)
    if (this.props.contentID == 0) {
      //Only update odometer when in home pages
      let elDataCount = document.querySelector('#odometer_count_of_data')
      if (elDataCount) {
        let odometer = new Odometer({
          el: elDataCount,
          value: elDataCount.innerHTML,
        })
        odometer.update(this.props.dataCount)
      }
      let elReportCount = document.querySelector('#odometer_count_of_report')
      if (elReportCount) {
        let odometer = new Odometer({
          el: elReportCount,
          value: elReportCount.innerHTML,
        })
        odometer.update(this.props.reportCount)
      }
      let elUserCount = document.querySelector('#odometer_count_of_users')
      if (elUserCount) {
        let odometer = new Odometer({
          el: elUserCount,
          value: elUserCount.innerHTML,
        })
        odometer.update(this.props.userCount)
      }
    } else if (this.props.loginInfo.hasOwnProperty('division_id')) {
      // let usersDivisionID = this.props.loginInfo.division_id
      // let divisionID = this.props.divisionID
      // if (usersDivisionID != divisionID) {
      //   // console.log(this.props.changeContentTitle)
      //   this.props.changeContentTitle('統計年報')
      // }
    }
  }

  getFactBookButton = () => {
    return <div style={contentDefault}>
      <Button 
        color="inherit" 
        onClick={this.openFactBook}
        style={linkButton} 
        fullWidth>
        想看重點摘要圖表? 點擊以連結至Fact Book
      </Button>
    </div>
  }

  renderDefault = () => (
    <div className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      {/* Overall population stats number increment animation */}
      <div style={contentDefault}>
        <span id="odometer_count_of_data" className="odometer">0</span>&nbsp;
        <span className="odometer-unit">筆統計資料</span>
      </div>
      <div style={contentDefault}>
        <span id="odometer_count_of_report" className="odometer">0</span>&nbsp;
        <span className="odometer-unit">項統計報告</span>
      </div>
      <div style={contentDefault}>
        <span id="odometer_count_of_users" className="odometer">0</span>&nbsp;
        <span className="odometer-unit">個填報承辦人</span>
      </div>
      {/* Brief description about IR and browsing instruction */}
      <div style={contentDefault}>
        <Grid item xs={12} md={5}>
          <Typography variant="display1">
            {'統計年報旨在揭露學校各項公開統計數據，供各界參考。'}
          </Typography>
        </Grid>
      </div>
      {this.getFactBookButton()}
    </div>
  )

  renderLoginDefault = (loginInfo) => (
    <div className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      {/* Brief description about IR and browsing instruction */}
      <div style={contentDefault}>
        <Typography variant="display3">
          {'請選擇貴單位負責之統計報告項目進行填報，謝謝!'}
        </Typography>
      </div>
      {loginInfo.hasOwnProperty('u_level') && loginInfo.u_level == 2 &&
        this.getFactBookButton()
        // <React.Fragment>
        //   <div style={contentDefault}>
        //     <Button 
        //       color="inherit" 
        //       onClick={this.openFactBook}
        //       style={linkButton} 
        //       fullWidth>
        //       想看重點摘要圖表? 點擊以連結至Fact Book
        //     </Button>
        //   </div>
        // </React.Fragment>
      }
    </div>
  )

  renderTabbedFileViewer = (reportID) => (
    <div className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      <TabbedFileViewer reportID={reportID}/>
    </div>
  )

  renderEditableTable = (reportID, login, loginInfo) => (
    <div className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      {login &&
        <React.Fragment>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={this.props.classes.tableHeading}>統計摘要</Typography>
              {/* <Typography className={this.props.classes.table2ndHeading}>*分類編號編輯僅限於新增資料，分類名稱則不受限</Typography> */}
            </ExpansionPanelSummary>
            <ReportMetaGrid reportID={reportID} loginInfo={loginInfo} formClass={this.props.classes.form} formFieldClass={this.props.classes.formField}/>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={this.props.classes.tableHeading}>統計分類</Typography>
              {/* <Typography className={this.props.classes.table2ndHeading}>*分類編號的修改僅限於新增資料，分類名稱則不受限</Typography> */}
              <Typography className={this.props.classes.table2ndHeading}>*分類編輯功能目前維護中，僅供檢視分類，謝謝!</Typography>
            </ExpansionPanelSummary>
            <ReportCategoryGrid reportID={reportID} loginInfo={loginInfo}/>
          </ExpansionPanel>
        </React.Fragment>
      }
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={this.props.classes.tableHeading}>統計資料</Typography>
        </ExpansionPanelSummary>
        <ReportDataGrid reportID={reportID} login={login} loginInfo={loginInfo}/>
      </ExpansionPanel>
    </div>
  )

  // renderD3Chart = (reportID, login, loginInfo) => (
  //   <div className={this.props.classes.content}>
  //     <div className={this.props.classes.toolbar} />
  //     <Provider store={store}>
  //       <BarChartContainer reportID={reportID} login={login}/> 
  //     </Provider>
  //   </div>
  // )

  // renderD3TestBed = (reportID, login, loginInfo) => (
  //   <div className={this.props.classes.content}>
  //     <div className={this.props.classes.toolbar} />
  //     <App/>
  //   </div>
  // )

  render() {
    const { contentID, divisionID, login, loginInfo } = this.props
    // console.log('login = ', login)
    // console.log('contentID='+contentID)
    // console.log('divisionID='+divisionID)
    // console.log('typeof contentID='+typeof contentID)
    switch (contentID) {
      // case 2:
      //   return this.renderD3Chart(contentID)
      case 49:
        // return this.renderD3TestBed(contentID)
      case 47:
      case 67:
        return this.renderTabbedFileViewer(contentID)
      // case /.{2,}/.test(contentID) && contentID:
      case 0:
        if (login) return this.renderLoginDefault(loginInfo) 
        return this.renderDefault() 
      default:
        // console.log('renderEditableTable')
        // const login = true //For debug
        if (loginInfo.hasOwnProperty('division_id')) {
          //If user has login, load homepage if user's division_id didn't match the report's division_id
          let usersDivisionID = loginInfo.division_id
          if (usersDivisionID > 0 && usersDivisionID != divisionID) {
            console.log('Loading home page while on restricted report after login')
            return this.renderLoginDefault(loginInfo) 
          }
        }
        return this.renderEditableTable(contentID, login, loginInfo)
    }
  }
}