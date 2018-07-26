import React from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from 'material-ui/transitions/Collapse';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Home from '@material-ui/icons/Home';

export default class NestedListItem extends React.Component {

  constructor(props) {
    super(props);

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
        {rep_id: '1', title: '組織'},
        {rep_id: '11', title: '組織架構圖'},
        {rep_id: '2', title: '校園'},
        {rep_id: '3', title: '學生'}
      ]
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (event, id, title) => {
    // console.table(e);
    // console.log('title='+title);
    // Simulate url change since we have no routes in this case.
    // ReactGA.pageview('/' + title);

    // this.setState({ contentID: id, contentTitle: title });
    this.props.handleListItemClick(event, id, title); //Pass to mother component's function
    // alert('You click');
  };

  handleListItemCollapse = (event, id) => {
    let openedList = this.state.nestedOpenList.map((nestItem) => {
      // console.log('nestItem.nest_id='+nestItem.nest_id);
      let openedItem = {};
      if (nestItem.nest_id == id) {
        // console.log('nest id '+id+' are collapsed');
        openedItem['nest_id'] = nestItem.nest_id;
        openedItem['open'] = !nestItem.open;
        return openedItem;
      }
      openedItem['nest_id'] = nestItem.nest_id;
      openedItem['open'] = false;
      return openedItem;
    });

    // openedList.map((nestItem) => {
    //   console.log('nestItem.nest_id='+nestItem.nest_id);
    //   console.log('nestItem.open='+nestItem.open);
    // });
    // let nestedOpenState = openedList.filter(nestItem => nestItem.nest_id == id);
    // console.log('nestedOpenState='+nestedOpenState[0].open);
    this.setState({ nestedOpenList: openedList });

    // this.setState({ nestedOpen: !this.state.nestedOpen, selectedItem: id });
  };

  componentDidMount() {
    // console.log('this.props.reportCount='+this.props.reportCount);
    // console.log('this.state.selectedItem='+this.state.selectedItem);
    if (this.state.selectedItem === '0') {
      let lastIdx = this.props.reportCount - 1;
      /* fetch API in action */
      fetch('/api/getReportList')
      .then(response => {
          return response.json();
      })
      .then(reportList => {
          // console.log('reportList='+reportList);
          // let classID = '0';
          // reportList.map((report, idx) => {
          //   console.log('idx='+idx);
          //   if (classID !== report.class_id) {
          //     classID = report.class_id;
          //     console.log('class='+report.class_name);
          //   }
          //   console.log('report='+report.rep_name);
          //   if (idx === lastIdx) console.log('the last report');
          // });
          //Fetched dataCount is stored in the state
          this.setState({ items: reportList });
      });
    }
  }


  render() {
    // console.log(this.props);
    // console.log('this.state.contentTitle = '+this.state.contentTitle);
    let classID = '1';
    let lastIdx = this.props.reportCount - 1;
    let nestedListItemTemp = [];
    let nestedListItem = [];
    return (
      <List component="nav">
          {this.state.items.map((item, idx) => {
            // console.log('classID='+classID);
            let prevItemID = parseInt(item.class_id) - 1;
            let nestedOpenState = this.state.nestedOpenList.filter(nestItem => nestItem.nest_id == classID);
            if (nestedOpenState.length > 0) {
              // console.log(nestedOpenState[0].nest_id+' is open? '+nestedOpenState[0].open);
              if (classID !== item.class_id) {
                // console.log('item.rep_id='+item.rep_id);
                classID = item.class_id;
                // console.log(nestedListItemTemp);
                nestedListItem = nestedListItemTemp;
                nestedListItemTemp = [];
                nestedListItemTemp.push(
                  <ListItem button key={item.rep_id} className={this.props.classes.nested} onClick={(e) => this.handleClick(e, item.rep_id, item.rep_name)}>
                    <ListItemText inset primary={item.rep_name} classes={{ primary: this.props.classes.drawerItemText }} />
                  </ListItem>
                );
                return <div><Collapse key={'collapse'+classID} in={nestedOpenState[0].open} timeout="auto" unmountOnExit>
                  <List key={'nest'+classID} component="div" disablePadding>
                    {nestedListItem}
                  </List>
                </Collapse>
                <ListItem button key={item.class_id} onClick={(e) => this.handleListItemCollapse(e, item.class_id)}>
                  <ListItemText primary={item.class_name} classes={{ primary: this.props.classes.drawerItemText }}/>
                  {nestedOpenState[0].open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem></div>
              } else {
                // console.log('item.rep_id='+item.rep_id);
                nestedListItemTemp.push(
                  <ListItem button key={item.rep_id} className={this.props.classes.nested} onClick={(e) => this.handleClick(e, item.rep_id, item.rep_name)}>
                    <ListItemText key={''+classID} inset primary={item.rep_name} classes={{ primary: this.props.classes.drawerItemText }} />
                  </ListItem>
                );
                if (idx === lastIdx) {
                  return <div><Collapse key={'collapse'+classID} in={nestedOpenState[0].open} timeout="auto" unmountOnExit>
                    <List key={'nest'+classID} component="div" disablePadding>
                      {nestedListItemTemp}
                    </List>
                  </Collapse></div>
                }
              }
            }
          })}
        </List>
    );
  }
}