import React from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import { CircularProgress } from 'material-ui/Progress'

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
    fontSize: '2rem', 
    fontWeight: 'bold', 
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

export default class LoginForm extends React.Component {
  state = {
    open: false,
    id: '',
    pass: '',
    onSubmit: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  setID = (event) => {
    this.setState({id: event.target.value})
  }

  setPassword = (event) => {
    this.setState({pass: event.target.value})
  }

  onKeyPress = (event) => {
    const id = this.state.id
    const pass = this.state.pass
    if (event.keyCode == 13 && id.length > 0 && pass.length > 0) {
      // console.log('you pressed enter')
      this.handleLogin()
    }
  }

  handleLogin = () => {
    console.log('handleLogin...')
    const id = this.state.id
    const pass = this.state.pass
    let login = true
    if (id == 'test' && pass == '123') {
      let loginInfo = {
        loginname: id,
        username: '訪客',
        u_level: 1,
        division_id: 0,
      }
      this.setState({ open: false })
      this.props.handleLoginState(login, loginInfo)
    } else {
      // console.log('pass='+pass)
      const postData = JSON.stringify({
        id: id,
        password: pass,
      })
      const requestConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
      }
      console.log('start request...')
      this.setState({ onSubmit: true })
      axios.post('/api/login', postData, requestConfig)
      .then(response => {
        this.setState({ onSubmit: false })
        console.log('finish request.')
        console.log(response)
        return response.data
      })
      .then((json) => {
        console.log(json)
        if (json.loginID && json.loginID != 'not found') {
          this.setState({ open: false })
          this.props.handleLoginState(login, json.loginInfo) //Pass to mother component's function
        } else if (json.loginID && json.loginID == 'not found') {
          this.setState({ open: false })
          alert('系統查無使用者! 請重新輸入，謝謝!')
        } else {
          alert('驗證失敗! 請重新輸入，謝謝!')
        }
      })
      .catch((error) => {
        // Do something with the error object
        // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
        console.log(error)
      })
    }
  }

  handleLogout = () => {
    console.log('handleLogout...')
    let login = false
    this.props.handleLoginState(login, []) //Pass to mother component's function
  }

  getLoginCtrlBtn = (isLogin) => {
    if (typeof isLogin != 'boolean') { 
      console.error('isLogin should be boolean!')
      return false
    }
    if (isLogin) {
      return <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
    }
    return <Button color="inherit" onClick={this.handleOpen}>Login</Button>
  }

  render() {
    const { classes, login } = this.props
    // console.log('login='+login)
    let loginCtrlBtn = this.getLoginCtrlBtn(login)
    return (
      <div className={classes.wrapper}>
        {loginCtrlBtn}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          onKeyDown={this.onKeyPress}
        >
          {/* <DialogTitle variant="headline"> 請使用臺師大校務行政入口網帳號登入，謝謝! </DialogTitle> */}
          <DialogContent>
            <DialogContentText variant="headline"> 請使用臺師大校務行政入口網帳號登入，謝謝! </DialogContentText>
            <TextField
              required
              autoFocus
              margin="normal"
              id="id"
              label="ID"
              type="text"
              variant="display2"
              fullWidth
              onChange={this.setID}
              // InputLabelProps={{root: {fontSize: '2rem'}}}
            />
            <TextField
              required
              margin="normal"
              id="password"
              label="Password"
              type="password"
              variant="display2"
              fullWidth
              onChange={this.setPassword}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <div className={classes.wrapper}>
              <Button onClick={this.handleLogin} color="primary" disabled={this.state.onSubmit}>
                Login
              </Button>
              {this.state.onSubmit && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </div>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}