import React from 'react'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Collapse from 'material-ui/transitions/Collapse'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'
import Divider from 'material-ui/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Home from '@material-ui/icons/Home'
import Launch from '@material-ui/icons/Launch'
import Tooltip from 'material-ui/Tooltip'

export default class NestedListItem extends React.PureComponent {

  constructor(props) {
    super(props)
    this.componentKey = 0

    this.state = {
      nestedOpen: false,
      nestedOpenList: [
        {nest_id: '1', open: false},
        {nest_id: '2', open: false},
        {nest_id: '3', open: false},
        {nest_id: '4', open: false},
        {nest_id: '5', open: false},
        {nest_id: '6', open: false},
        {nest_id: '7', open: false},
        {nest_id: '8', open: false},
        {nest_id: '9', open: false},
        {nest_id: '10', open: false}
      ],
      selectedItem: '0',
      items: [
        {rep_no: '1', title: '組織'},
        {rep_no: '11', title: '組織架構圖'},
        {rep_no: '2', title: '校園'},
        {rep_no: '3', title: '學生'}
      ],
      filterItems: [],
      adminMenuOpen: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.getNewKey = this.getNewKey.bind(this)
  }

  getNewKey = () => {
    return this.componentKey++
  }

  openReportChartClass = classID => { 
    window.open('http://www.iro.ntnu.edu.tw/web/?Yreport#report-'+classID, '_blank') 
  }

  handleAdminItemCollapse = (event) => {
    let adminMenuOpen = !this.state.adminMenuOpen
    this.setState({ adminMenuOpen })
  }

  openUserLevelEdit = () => { 
    console.log('openUserLevelEdit')
  }

  handleListItemCollapse = (event, id) => {
    console.log('nest id '+id+' are collapsed')
    let openedList = this.state.nestedOpenList.map((nestItem) => {
      // console.log('nestItem.nest_id='+nestItem.nest_id)
      let openedItem = {}
      if (nestItem.nest_id == id) {
        // console.log('nest id '+id+' are collapsed')
        openedItem['nest_id'] = nestItem.nest_id
        openedItem['open'] = !nestItem.open
        return openedItem
      }
      openedItem['nest_id'] = nestItem.nest_id
      openedItem['open'] = false
      return openedItem
    })

    // openedList.map((nestItem) => {
    //   console.log('nestItem.nest_id='+nestItem.nest_id)
    //   console.log('nestItem.open='+nestItem.open)
    // })
    // let nestedOpenState = openedList.filter(nestItem => nestItem.nest_id == id)
    // console.log('nestedOpenState='+nestedOpenState[0].open)
    this.setState({ nestedOpenList: openedList })
    // this.setState({ nestedOpen: !this.state.nestedOpen, selectedItem: id })
  }

  handleClick = (event, id, title, division_id) => {
    // console.table(e)
    // console.log('title='+title)
    // Simulate url change since we have no routes in this case.
    // ReactGA.pageview('/' + title)

    // this.setState({ contentID: id, contentTitle: title })
    // console.log(event.target.style)
    // event.target.style.backgroundColor = 'rgba(0, 0, 0, 0.08)'
    // event.target.style.backgroundColor = 'grey'
    this.props.handleListItemClick(event, id, title, division_id) //Pass to mother component's function
    // alert('You click')
  }

  componentDidMount() {
    // console.log('this.props.reportCount='+this.props.reportCount)
    // console.log('this.state.selectedItem='+this.state.selectedItem)
    const { login, loginInfo } = this.props
    const divisionID = login ? loginInfo.division_id : 0
    console.log('divisionID = '+divisionID)
    if (this.state.selectedItem === '0') {
      // let lastIdx = this.props.reportCount - 1
      /* fetch API in action */
      axios.get('/api/getReportList')
      .then(response => {
          return response.data
      })
      .then(reportList => {
          // console.log(reportList)
          // let uniqReportList = reportList.map((report, idx) => {
          //   report.key = idx
          // })
          //Fetched dataCount is stored in the state
          this.setState({ items: reportList })
      })
      .catch((error) => {
        // Do something with the error object
        // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
        console.log(error)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate@'+this.constructor.name)
    // console.log(prevProps)
    // console.log(this.props)
    if (this.props.login !== prevProps.login) {
      const { loginInfo } = this.props
      // console.log('loginInfo = ', loginInfo)
      if (loginInfo.hasOwnProperty('division_id')) {
        //If user has login, get user's division_id to filter what report they can select
        let divisionID = loginInfo.division_id
        let { items } = this.state
        if (divisionID > 0) {
          let filterItems = items.filter(item => item.division_id == loginInfo.division_id)
          // console.table(filterItems)
          this.setState({ filterItems: filterItems })
        } else {
          //If that is 0 means admin users and don't filter
          this.setState({ filterItems: items })
        }
      }
    }
  }

  render() {
    // console.log(this.props)
    // console.log('this.state.contentTitle = '+this.state.contentTitle)
    const { classes, reportCount, login, loginInfo } = this.props
    let { items, filterItems, nestedOpenList, adminMenuOpen } = this.state
    // console.log(nestedOpenLisst)
    let dynamicItems = login ? filterItems : items
    let userLevel = loginInfo.hasOwnProperty('u_level') ? loginInfo.u_level : 0
    let adminUser = (userLevel == 2)
    // console.log('adminUser = ', adminUser)
    let adminMenu = <React.Fragment key={'admin_menu'}>
    <ListItem button key={'admin_menu_btn'} onClick={(e) => this.handleAdminItemCollapse(e)}>
      <ListItemText key={'admin_menu_txt'} primary={'管理者選單'} classes={{ primary: classes.drawerItemText }}/>
      {adminMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </ListItem>
    <Collapse key={'admin_menu_collapse'} in={adminMenuOpen} timeout="auto" unmountOnExit>
      <List key={'admin_menu_list'} component="div" disablePadding>
        <ListItem button key={'admin_menu_list_1'} className={classes.nested} onClick={e => this.openUserLevelEdit()}>
          <ListItemText key={'admin_menu_list_text_1'} inset primary={'權責單位編輯'} classes={{ primary: classes.drawerItemText }} />
        </ListItem>
      </List>
    </Collapse>
    <Divider />
    </React.Fragment>
    // let lastIdx = reportCount - 1
    let nestedListItemTemp = []
    let nestedListItem = []
    return (
      <List component="nav">
        {adminUser && adminMenu}
        {dynamicItems.map((item, idx) => {
          // console.log(dynamicItems[idx])
          // console.log(dynamicItems[idx+1])
          let classID = item.class_id
          let nextClassID = dynamicItems[idx+1] != null ? dynamicItems[idx+1].class_id : 'end'
          let nestedOpenState = nestedOpenList.filter(nestItem => nestItem.nest_id == classID)
          if (nestedOpenState.length > 0) {
            // console.log(nestedOpenState[0].nest_id+' is open? '+nestedOpenState[0].open)
            if (nextClassID !== classID) {
              // console.log('on last of the same item.class_id='+item.class_id)
              // console.log(nestedListItemTemp)
              nestedListItem = nestedListItemTemp
              nestedListItemTemp = []
              nestedListItem.push(
                <ListItem button key={item.rep_no} className={classes.nested} onClick={e => this.handleClick(e, item.rep_no, item.rep_name, item.division_id)}>
                  <ListItemText key={'txt'+item.rep_no} inset primary={item.rep_name} classes={{ primary: classes.drawerItemText }} />
                </ListItem>
              )
              return <React.Fragment key={'fragment'+classID}>
                <ListItem button key={'btn'+classID} onClick={(e) => this.handleListItemCollapse(e, classID)}>
                  <ListItemText key={'txt'+classID} primary={item.class_name} classes={{ primary: classes.drawerItemText }}/>
                  {nestedOpenState[0].open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse key={classID} in={nestedOpenState[0].open} timeout="auto" unmountOnExit>
                  <List key={'list'+classID} component="div" disablePadding>
                    <Tooltip id={'chartTip'+classID} title='檢視分項圖表，點擊將會開啟新視窗' placement='bottom'>
                      <ListItem button key={'chart'+classID} className={classes.nested} onClick={e => this.openReportChartClass(classID)}>
                        <ListItemText key={'chartTxt'+classID} inset primary={'圖表'} classes={{ primary: classes.drawerItemText }} />
                        <ListItemIcon>
                          <Launch/>
                        </ListItemIcon>
                      </ListItem>
                    </Tooltip>
                    <Divider />
                      {nestedListItem}
                    <Divider />
                  </List>
                </Collapse>
                </React.Fragment>
            } else {
              // console.log('on same item.class_id='+item.class_id)
              nestedListItemTemp.push(
                <ListItem button key={item.rep_no} className={classes.nested} onClick={e => this.handleClick(e, item.rep_no, item.rep_name, item.division_id)}>
                  <ListItemText key={'txt'+item.rep_no} inset primary={item.rep_name} classes={{ primary: classes.drawerItemText }} />
                </ListItem>
              )
            }
          }
        })}
      </List>
    )
  }
}