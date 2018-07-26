import React from 'react';
import Typography from 'material-ui/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from 'material-ui/Hidden';
import Grid from 'material-ui/Grid';
// import ExpansionPanel, {
//   ExpansionPanelSummary,
//   ExpansionPanelDetails,
// } from 'material-ui/ExpansionPanel';
// import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
// import ResponsiveEmbedYoutube from './ResponsiveEmbedYoutube';
// import ResponsiveEmbedGoogleMap from './ResponsiveEmbedGoogleMap';
import TabbedFileViewer from './TabbedFileViewer';
import EditableTabel from './EditableTabel';

const contentDefault = {
  display: 'flex', 
  justifyContent: 'center', 
  marginBottom: 20,
};

export default class YearReportContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textWidth: '80%',
      odometerWidth: '100%',
    };
  }

  componentDidUpdate() {
    console.log('this.props.contentID = '+this.props.contentID);
    if (this.props.contentID === 0) {
      //Only update odometer when in home pages
      let elDataCount = document.querySelector('#odometer_count_of_data');
      if (elDataCount) {
        let odometer = new Odometer({
          el: elDataCount,
          value: elDataCount.innerHTML,
        });
        odometer.update(this.props.dataCount);
      }
      let elReportCount = document.querySelector('#odometer_count_of_report');
      if (elReportCount) {
        let odometer = new Odometer({
          el: elReportCount,
          value: elReportCount.innerHTML,
        });
        odometer.update(this.props.reportCount);
      }
      let elUserCount = document.querySelector('#odometer_count_of_users');
      if (elUserCount) {
        let odometer = new Odometer({
          el: elUserCount,
          value: elUserCount.innerHTML,
        });
        odometer.update(this.props.userCount);
      }
    }
  }

  renderDefault = () => (
    <main className={this.props.classes.content}>
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
            {'統計年報旨在接露學校各項公開統計數據，供各界參考。'}
          </Typography>
        </Grid>
      </div>
    </main>
  )

  renderTabbedFileViewer = (reportID) => (
    <main className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      <TabbedFileViewer reportID={reportID}/>
    </main>
  )

  renderEditableTabel = (reportID) => (
    <main className={this.props.classes.content}>
      <div className={this.props.classes.toolbar} />
      <EditableTabel reportID={reportID}/>
    </main>
  )

  render() {
    // console.log('this.props.contentID = '+this.props.contentID);
    switch (this.props.contentID) {
      case '01-1':
      case '10-1':
        return this.renderTabbedFileViewer(this.props.contentID);
      case '01-2':
        return this.renderEditableTabel(this.props.contentID);
      // case 3:
      //   return <International classes={this.props.classes} textWidth={this.state.textWidth} />;
      default:
        return this.renderDefault();
    }
  }
}