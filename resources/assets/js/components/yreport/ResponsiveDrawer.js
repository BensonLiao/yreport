import React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Collapse from 'material-ui/transitions/Collapse'
import Popover from 'material-ui/Popover'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'
import Divider from 'material-ui/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Home from '@material-ui/icons/Home'
import Place from '@material-ui/icons/Place'
import Phone from '@material-ui/icons/Phone'
import Email from '@material-ui/icons/Email'
import Poll from '@material-ui/icons/Poll'
import NestedListItem from './NestedListItem'
import YearReportContent from './YearReportContent'
import LoginForm from './LoginForm'
import NotifyBar from './NotifyBar'
import ScrollButton from './ScrollButton'
import ReactGA from 'react-ga' // https://github.com/react-ga/react-gaimport React, { Component } from 'react'


const drawerWidth = 215

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    minHeight: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    fontSize: '2rem', 
  },
  nested: {
    paddingLeft: theme.spacing.unit * 2,
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
  },
  flex: {
    flex: 1,
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    fontSize: '2rem', 
    fontWeight: 'bold', 
    height: '64px',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      height: '70px',
      fontSize: '2rem', 
      fontWeight: 'bold', 
    },
  },
  appTitle: {
    flex: 1,
    fontSize: '3rem',
    fontWeight: 'bold', 
  },
  footer: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    minHeight: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  drawerItemText: {
    fontSize: '2rem',
    fontWeight: 'bold', 
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    // padding: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
    width: '100%',
    minHeight: '100%',
    fontSize: '1.5rem', 
    [theme.breakpoints.up('md')]: {
      fontSize: '2.5rem', 
    },
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: '2.5rem',
    fontWeight: 'bold', 
    width: '100%'
  },
  formField: {
    flexBasis: '100%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
    fontSize: '2.5rem',
    fontWeight: 'bold', 
  },
  tableHeading: {
    fontSize: '2.5rem',
    fontWeight: 'bold', 
    flex: '1',
    flexWrap: 'wrap',
  },
  table2ndHeading: {
    fontSize: '2rem',
    fontWeight: 'bold', 
    color: theme.palette.text.secondary,
  },
})

class ResponsiveDrawer extends React.Component {

  state = {
    open: true,
    popOverOpen: false,
    loginFormOpen: false,
    login: false,
    loginInfo: {},
    openNotifyBar: false,
    notifyDuration: null,
    notifyMsg: 'this is a message',
    anchorEl: null,
    anchorReference: 'anchorEl',
    anchorOriginVertical: 'bottom',
    anchorOriginHorizontal: 'center',
    contentID: 0,
    contentTitle: '統計年報首頁',
    divisionID: 0,
    dataCount: 0,
    reportCount: 0,
    userCount: 0,
  }
  buttonAbout = null

  handleDrawerToggle = () => {this.setState({ mobileOpen: !this.state.mobileOpen })}
  handleDrawerClose = () => {this.setState({ open: false })}
  
  handlePopOverToggle = () => {this.setState({ 
      popOverOpen: !this.state.popOverOpen ,
      anchorEl: findDOMNode(this.buttonAbout),
    })
  }
  handlePopOverClose = () => {this.setState({ popOverOpen: false })}
  
  openNTNU = () => { 
    // window.open('http://www.ntnu.edu.tw', '_blank') //Open in new window
    window.location.href = 'http://www.ntnu.edu.tw'
  }

  sendMail = () => { 
    // window.open('mailto:skylock@ntnu.edu.tw','_blank') //Open in new window
    window.location.href = 'mailto:skylock@ntnu.edu.tw'
  }

  openGA = () => { 
    window.open('https://analytics.google.com/analytics/web/#/embed/report-home/a10706568w173171605p172579701', '_blank') 
  }

  handleListItemClick = (event, id, title, division_id) => {
    // console.table(e)
    // console.log('title='+title)
    // Simulate url change since we have no routes in this case.
    ReactGA.pageview('/' + id)

    this.setState({ mobileOpen: false, contentID: id, contentTitle: title, divisionID: division_id })
  }

  handleNotifyBarOpen = (msg, notifyDuration) => {
    this.setState({ openNotifyBar: true, notifyMsg: msg, notifyDuration: notifyDuration })
  }

  handleNotifyBarClose = () => {
    this.setState({ openNotifyBar: false })
  }

  handleLoginState = (isLogin, loginInfo) => {
    console.log('isLogin = ', isLogin)
    this.setState({ login: isLogin, loginInfo: loginInfo })
    if (isLogin) {
      let msg = '妳好，'+loginInfo.username+'，歡迎進入填報系統!'
      this.handleNotifyBarOpen(msg, 6000)
    }
  }

  componentDidMount() {
    /* fetch API in action */
    axios.get('/api/getSummaryStats')
    .then(response => {
      // console.log(response)
      return response.data
    })
    .then(summaryStats => {
      // console.log('dataCount='+summaryStats.dataCount)
      //Fetched dataCount is stored in the state
      this.setState({ 
        dataCount: summaryStats.dataCount, 
        reportCount: summaryStats.reportCount, 
        userCount: summaryStats.userCount 
      })
    })
    .catch((error) => {
      // Do something with the error object
      // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
      console.log(error)
    })
    // let msg = <span>妳好，填報系統目前僅提供檢視，後台尚在建置中，如有填報需求請聯絡系統管理人
    //   <a href='mailto:skylock@ntnu.edu.tw' target='_blank'>skylock@ntnu.edu.tw</a>，謝謝!</span>
    // this.handleNotifyBarOpen(msg, null)
    let msg = <span>歡迎進入統計年報系統，請登入進行填報，如有使用問題請聯絡系統管理人
      <a href='mailto:skylock@ntnu.edu.tw' target='_blank'>skylock@ntnu.edu.tw</a>，謝謝!</span>
    this.handleNotifyBarOpen(msg, null)
  }

  render() {
    const { classes, theme } = this.props
    const { open, openNotifyBar, notifyDuration, notifyMsg, login, loginInfo } = this.state
    // console.log('login = ', login)
    if (loginInfo != null && typeof loginInfo != 'undefined') console.log(loginInfo)

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <List component="nav">
            <ListItem button onClick={(e) => this.handleListItemClick(e, 0, '統計年報首頁')}>
              <ListItemIcon>
                <Home/>
              </ListItemIcon>
              <ListItemText primary='Home' classes={{ primary: classes.drawerItemText }} />
            </ListItem>  
          </List>
        </div>
        <Divider />
          <NestedListItem classes={classes}
            reportCount={this.state.reportCount}
            login={login}
            loginInfo={loginInfo}
            handleListItemClick={this.handleListItemClick}
          />
        <Divider />
      </div>
    )
    console.log('this.state.contentTitle = '+this.state.contentTitle)
    // console.log(window.location.pathname)
    // switch (window.location.pathname) {
    //   case 'Population':
    //     this.handleListItemClick(1, 'Population')
    //   case 'Faculty and Staff':
    //     this.handleListItemClick(11, 'Faculty and Staff')
    //   case 'Teacher Education':
    //     this.handleListItemClick(2, 'Teacher Education')
    //   case 'International':
    //     this.handleListItemClick(3, 'International')
    //   default:
    //     this.handleListItemClick(0, 'NTNU Fact Book')
    // }

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} style={{ backgroundColor: '#7F0015'}} position={'sticky'}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="display3" color="inherit" className={classes.appTitle}>
              {this.state.contentTitle}
            </Typography>
            {/* For mobile device */}
            <Hidden mdUp>
              <Button color="inherit" ref={node => {this.buttonAbout = node}} onClick={this.handlePopOverToggle}>
              about us
              </Button>
              <Popover
                open={this.state.popOverOpen}
                onClose={this.handlePopOverClose}
                anchorEl={this.state.anchorEl}
                anchorReference={this.state.anchorReference}
                anchorOrigin={{
                  vertical: this.state.anchorOriginVertical,
                  horizontal: this.state.anchorOriginHorizontal,
                }}
                // anchorPosition={{ top: positionTop, left: positionLeft }}
                // transformOrigin={{
                //   vertical: transformOriginVertical,
                //   horizontal: transformOriginHorizontal,
                // }}
              >
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Home/>
                    </ListItemIcon>
                    <ListItemText primary='Office of Institutional Research' classes={{ primary: classes.drawerItemText }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Home/>
                    </ListItemIcon>
                    <ListItemText primary='National Taiwan Normal University' classes={{ primary: classes.drawerItemText }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Place/>
                    </ListItemIcon>
                    <ListItemText primary='162, Section 1, Heping E. Rd., Taipei City 106, Taiwan' classes={{ primary: classes.drawerItemText }} />
                  </ListItem>
                  <ListItem button onClick={this.sendMail}>
                    <ListItemIcon>
                      <Email/>
                    </ListItemIcon>
                    <ListItemText primary='skylock@ntnu.edu.tw' classes={{ primary: classes.drawerItemText }} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone/>
                    </ListItemIcon>
                    <ListItemText primary='+886-2-7734-1391' classes={{ primary: classes.drawerItemText }} />
                  </ListItem>
                </List>
              </Popover>
            </Hidden>
            {/* For other bigger device */}
            <Hidden smDown implementation="css">
              {/* <Button color="inherit" ref={node => {this.buttonUDB = node}} onClick={this.downloadUDB}>
              download UDB
              </Button> */}
              <LoginForm classes={{ primary: classes.drawerItemText }} handleLoginState={this.handleLoginState} login={login}/>
            </Hidden>
          </Toolbar>
        </AppBar>
        {/* For mobile device */}
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
         {/* For other bigger device */}
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <YearReportContent 
          classes={classes} 
          dataCount={this.state.dataCount} 
          reportCount={this.state.reportCount} 
          userCount={this.state.userCount} 
          contentID={this.state.contentID} 
          contentTitle={this.state.contentTitle}
          divisionID={this.state.divisionID}
          login={login}
          loginInfo={loginInfo}
          changeContentTitle={this.handleChangeContentTitle}
        />
        <NotifyBar 
          open={openNotifyBar} 
          notifyDuration={notifyDuration}
          msg={notifyMsg} 
          handleClose={this.handleNotifyBarClose}
        />
        <ScrollButton/>
      </div>
    )
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer)