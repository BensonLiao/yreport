import React from 'react'; 
import Paper from 'material-ui/Paper';
import ReactDataGrid from 'react-data-grid';
import { Editors, Toolbar, Formatters } from 'react-data-grid-addons';
import update from 'immutability-helper';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NumericEditor from './NumericEditor';
import ErrorBoundary from './wrapper/ErrorBoundary';
import ReactDataGridWrapper from './wrapper/ReactDataGridWrapper';

const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

// options for priorities autocomplete editor
const priorities = [{ id: 0, title: 'Critical' }, { id: 1, title: 'High' }, { id: 2, title: 'Medium' }, { id: 3, title: 'Low'} ];
const PrioritiesEditor = <AutoCompleteEditor options={priorities} />;

// options for IssueType dropdown editor
// these can either be an array of strings, or an object that matches the schema below.
// const issueTypes = [
//   { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
//   { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
//   { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
//   { id: 'story', value: 'story', text: 'Story', title: 'Story' }
// ];

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
    );
  }
}

export default class EditableDataGrid extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { 
      columns: [],
      rows: [],
      rowsToUpdate: [],
      rowsNoToDelete: [],
      categoryDropdowns: [
        { id: 'bug', value: 'bug', text: 'Bug', title: 'Bug' },
        { id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement' },
        { id: 'epic', value: 'epic', text: 'Epic', title: 'Epic' },
        { id: 'story', value: 'story', text: 'Story', title: 'Story' }
      ],
      yearDropdowns: this.createYearDropDown(1999),
      step: 1,
      // rows: this.createRows(1000) 
    };
  }

  // createRows = (numberOfRows) => {
  //   let rows = [];
  //   for (let i = 1; i < numberOfRows; i++) {
  //     rows.push({
  //       id: i,
  //       task: 'Task ' + i,
  //       priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
  //       issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
  //     });
  //   }

  //   return rows;
  // };

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  getDateNow = () => {
    let date = new Date();
    let now = date.toLocaleString('zh-TW', { hour12: false }).replace(/\/(\d)/gi, '-0$1').replace(/-0(\d\d)/gi, '-$1');
    return now;
  }

  createYearDropDown = (start) => {
    let range = [];
    let date = new Date();
    let yearNow = date.getFullYear();
    let end = yearNow + 101;
    if (start > end) throw 'Range start must be less than end';
    for (let i = start; i < end; i++) {
      range.push({
        id: i,
        value: i,
        text: i,
        title: i,
      });
    }
    // console.log('range = '+range)
    return range;
  }

  handleNumericSettings = (newStep) => {
    this.setState({ step: newStep });
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // const now = this.getDateNow();
    let rows = this.state.rows.slice();
    let rowsToUpdate = this.state.rowsToUpdate.slice();
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let rowNoToUpdate = rowToUpdate.data_no;
      // console.log('rowNoToUpdate='+rowNoToUpdate);
      rowsToUpdate = rowsToUpdate.filter(row => row.data_no !== rowNoToUpdate);
      let updatedRow = update(rowToUpdate, {$merge: updated});
      // updatedRow = updatedRow.map((row) => {row.latest_date = now; return row;});
      // console.log('i='+i);
      rowsToUpdate.push(updatedRow);
      rows[i] = updatedRow;
      // rows[i].latest_date = now;
    }
    // console.table(rowsToUpdate);
    this.setState({ rows, rowsToUpdate });
    // console.table(rows);
  };

  handleAddRow = ({ newRowIndex }) => {
    // const now = this.getDateNow();
    const newRow = {
      value: newRowIndex,
      class_id: '',
      rep_id: '',
      rep_no: '',
      data_no: '',
      c_id: '',
      year: '',
      category_name: '',
      y_data: 0,
      unit: '',
      latest_date: '',
      description: '',
      login_id: ''
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  };

  handleDeleteRow = (deleteRowIndex) => {
    console.log('deleteRowIndex='+deleteRowIndex);
    //Filter out the deleted row
    let rows = this.state.rows.slice();
    rows = rows.filter(row => row.id !== deleteRowIndex);
    //Store the number of deleted row
    let rowsNoToDelete = this.state.rowsNoToDelete;
    rowsNoToDelete.push({data_no: deleteRowIndex});
    this.setState({ rows, rowsNoToDelete });
  };

  handleSaveGrid = () => {
    let rows = this.state.rows.slice();
    let rowsToUpdate = this.state.rowsToUpdate.slice();
    console.table(rowsToUpdate);
    // let reportToUpdate = encodeURIComponent(JSON.stringify(rowsToUpdate));
    let reportToUpdate = JSON.stringify(rowsToUpdate);
    // console.log('reportToUpdate='+reportToUpdate);
    let deleteRowsNo = this.state.rowsNoToDelete;
    // console.table(deleteRowsNo);
    let reportToDelete = JSON.stringify(deleteRowsNo);
    let loginID = this.props.loginInfo.hasOwnProperty('loginname') ? this.props.loginInfo.loginname : 'test_no_login';
    // console.log('loginID='+loginID);
    fetch('/api/updateReport', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        reportToDelete: reportToDelete,
        reportToUpdate: reportToUpdate,
        loginID: loginID,
      })
    })
    .then(response => {
        console.log('finish request.');
        return response.json();
    })
    .then(json => {
        console.log(json);
        // for (let i = fromRow; i <= toRow; i++) {
        //   let rowToUpdate = rows[i];
        //   let rowNoToUpdate = rowToUpdate.data_no;
        //   // console.log('rowNoToUpdate='+rowNoToUpdate);
        //   rowsToUpdate = rowsToUpdate.filter(row => row.data_no !== rowNoToUpdate);
        //   let updatedRow = update(rowToUpdate, {$merge: updated});
        //   // console.log('i='+i);
        //   rowsToUpdate.push(updatedRow);
        //   rows[i] = updatedRow;
        // }
    })
    .catch(error => {
      // Do something with the error object
      // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
      console.log(error);
    });
  };

  getReport = reportID => {
    fetch('/api/getReport/'+reportID)
    .then(response => {
      return response.json();
    })
    .then(report => {
      // console.table(report);
      let rowsForRender = report.data.map((data, idx) => {
        data.id = idx; //Add a unique index for react to render component
        // console.log(data);
        // console.log('typeof data.category_name = '+typeof data.category_name);
        return data;
      });
      // console.table(rowsForRender);

      let categoriesForDropdowns = [];
      report.categories.map((data) => {
        let option = {};
        option.id = data.c_id; //Add a unique index for react to render component
        option.value = data.c_id;
        option.text = data.category_name;
        option.title = data.category_name;
        // console.log(data);
        categoriesForDropdowns.push(option);
      });
      this.setState({ rows: rowsForRender, categoryDropdowns: categoriesForDropdowns });
    })
    .catch(error => {
      // Do something with the error object
      // If without this callback, you could probably get 'TypeError: failed to fetch' error when make request after a failed request
      console.log(error);
    });
  }

  componentDidMount() {
    // console.log('this.props.reportID='+this.props.reportID);
    /* fetch API and get report data from a folder depends on report id*/
    this.getReport(this.props.reportID);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('this.props.reportID='+this.props.reportID);
    // console.log('prevProps.reportID='+prevProps.reportID);
    if (this.props.reportID !== prevProps.reportID) {
      // console.log('content changed');
      this.getReport(this.props.reportID);
    }
  }

  render() {
    const { login } = this.props;
    const { rows, categoryDropdowns, yearDropdowns, step } = this.state;
    // console.table(yearDropdowns);
    let yearEditor = login ? <DropDownEditor options={yearDropdowns}/> : null;
    let categoryEditor = login ? <DropDownEditor options={categoryDropdowns}/> : null;
    // console.table(categoryEditor.props.options);
    let defaultValue = categoryDropdowns.length > 0 ? categoryDropdowns[0].value : '';
    // console.log('defaultValue='+defaultValue);
    let categoryFormatter = login ? <DropDownFormatter options={categoryDropdowns} value={defaultValue}/> : null;
    // console.table(categoryFormatter.props.options);
    let numericEditor = login ? <NumericEditor step={step}/> : null;
    // let numericEditor = login ? NumericEditor : null;
    let columns = [
      { key: 'id', name: 'ID', width: 80 }, //React needs an id to make sure component is unique, not from database
      { key: 'class_id', name: 'class_id', hidden: true },
      { key: 'rep_id', name: 'rep_id', hidden: true },
      { key: 'rep_no', name: 'rep_no', hidden: true },
      { key: 'data_no', name: 'data_no', hidden: true },
      { key: 'year', name: '年度', width: 200, editor: yearEditor },
      { key: 'c_id', name: '分類', editor: categoryEditor, formatter: categoryFormatter, resizable: true },
      { key: 'y_data', name: '數據', editor: numericEditor, resizable: true },
      { key: 'unit', name: '單位', hidden: true },
      { key: 'latest_date', name: '最後更新時間' },
      { key: 'description', name: '描述', hidden: true },
      { key: 'login_id', name: '填報人員' },
      {
        key: '$delete',
        name: '', 
        width: 40, 
        getRowMetaData: (row) => row,
        formatter: ({ dependentValues }) => (
          <Tooltip id='tooltip_delete_row' title='Delete a row' placement='left'>
            <a 
              style={{color: 'rgba(0, 0, 0, 0.54)'}} 
              href='javascript:;'
              onClick={() => this.handleDeleteRow(dependentValues.id)}>
              <DeleteIcon />
            </a>
          </Tooltip>
        ), 
        hidden: !login 
      },
    ];

    let dynamicColumns = columns.filter(function (column) {
      if (column.hasOwnProperty('hidden')) {
        return column.hidden === false
      }
      return true;
    });
    let rowsHeight = rows.length * 35 + 50;
    // console.log('rowsHeight='+rowsHeight);
    let viewHeight = window.innerHeight - 220;
    // console.log('viewHeight='+viewHeight);
    let height = rowsHeight > viewHeight ? viewHeight : rowsHeight;
    // console.log('height='+height);

    const wrapperProps = {
      originalRows: rows,
      originalColumns: dynamicColumns,
      originalStep: step,
      handleNumericSettings: this.handleNumericSettings,
      originalToolbar: <CustomToolbar onAddRow={this.handleAddRow} onSaveGrid={this.handleSaveGrid}/>,
    };
    // console.log(wrapperProps)

    return (
      <Paper>
        {/* <ReactDataGrid
          enableCellSelect={login}
          // enableRowSelect={true}
          columnEquality={() => false} //Passing this prop to make DropDownEditor's option reflect the state changes
          columns={dynamicColumns}
          headerRowHeight={50}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          minHeight={height}
          onGridRowsUpdated={this.handleGridRowsUpdated} 
          toolbar={login && <CustomToolbar onAddRow={this.handleAddRow} onSaveGrid={this.handleSaveGrid}/>} 
        /> */}
        <ErrorBoundary>
          <ReactDataGridWrapper wrapper={wrapperProps} />
        </ErrorBoundary>
      </Paper>
    );
  }
}