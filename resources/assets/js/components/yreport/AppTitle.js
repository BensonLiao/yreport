import React from 'react'
import Typography from 'material-ui/Typography'

export default class AppTitle extends React.Component {
  state = {
    contentTitle: '統計年報首頁',
  }
  handleChangeContentTitle = (title) => {
    console.log('title = '+title)
    this.setState({ contentTitle: title })
  }

  render() {
    const { contentTitle } = this.state
    // console.log(this.props)
    return (
      <Typography variant="display3" color="inherit" className={classes.flex} noWrap>
        {contentTitle}
      </Typography>
    )
  }
}