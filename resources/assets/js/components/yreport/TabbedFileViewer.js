import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import PDFViewer from './PDFViewer';

function TabContainer(props) {
  // console.log(props);
  const styles = {
      flexGrow: 1,
      width: '100%',
      padding: 24
  };
  return (
    <Typography component="div" style={styles}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  }
});
const viewWidth = window.innerWidth - 280

class TabbedFileViewer extends React.Component {
  state = {
    value: 0,
    tabs: [
      {id: 0, title: '2012'},
      {id: 1, title: '2013'},
      {id: 2, title: '2014'},
      {id: 3, title: '2015'}
    ],
    minWidth: viewWidth
  };

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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {
    /* fetch API and get file list from a folder depends on diffrent report id*/
    fetch('/api/getFileList/'+this.props.reportID)
    .then(response => {
        return response.json();
    })
    .then(fileList => {
        console.log(fileList);
        let names = fileList.files.split(',');
        // console.log(names);
        let tabID = 0;
        let fileTabs = names.map((name) => {
          return {id: tabID++, title: name}
        });
        // console.log(fileTabs);
        this.setState({ tabs: fileTabs });
    });

    const minWidth = 350
    this.changeWidth(minWidth)

    window.addEventListener('resize', () => {
      // Re-render grid
      // May be recalculate grid's minWidth and setState
      this.changeWidth(minWidth)
      // Or may be forceUpdate (not a huge fan of this approach)
      // this.forceUpdate()
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {})
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('this.props.reportID='+this.props.reportID);
    // console.log('prevProps.reportID='+prevProps.reportID);
    if (this.props.reportID !== prevProps.reportID) {
      // console.log('content changed');
      /* fetch API and get file list from a folder depends on diffrent report id*/
      fetch('/api/getFileList/'+this.props.reportID)
      .then(response => {
          return response.json();
      })
      .then(fileList => {
          // console.log(fileList);
          let names = fileList.files.split(',');
          // console.log(names);
          let tabID = 0;
          let fileTabs = names.map((name) => {
            return {id: tabID++, title: name}
          });
          // console.log(fileTabs);
          // Add value: 0 to reset tab id
          this.setState({ tabs: fileTabs, value: 0});
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { value, tabs, minWidth } = this.state;


    return ( 
      <div className={classes.root} style={{ width: minWidth}}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            scrollable
            scrollButtons="auto"
          >
            {tabs.map((tab) => {
              return <Tab key={tab.id} label={tab.title} />
            })}
          </Tabs>
        </AppBar>
        {tabs.map((tab) => {
          return value === tab.id && 
          <TabContainer key={tab.id}>
            <PDFViewer fileFolder={this.props.reportID} fileName={tab.title}/>
          </TabContainer>
        })}
      </div>
    );
  }
}

TabbedFileViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabbedFileViewer);