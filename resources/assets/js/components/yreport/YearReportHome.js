import ReactGA from 'react-ga'; // https://github.com/react-ga/react-gaimport React, { Component } from 'react';
import React, { Component } from "react";
import ReactDOM from 'react-dom';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import {green100, green500, green700} from 'material-ui/styles/colors';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ResponsiveDrawer from './ResponsiveDrawer';

// const muiTheme = getMuiTheme({
//     palette: {
//         primary1Color: green500,
//         primary2Color: green700,
//         primary3Color: green100,
//     },
// }, {
//     avatar: {
//         borderColor: null,
//     },
//     appBar: {
//         height: 50,
//     },
//     userAgent: request.headers['user-agent'],
// });

export default class YearReportHome extends Component {
    constructor() {
        super();
        // this.state = {
        //     someData: null,
        // };

        // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
        // ReactGA.initialize('UA-10706568-3', { debug: true });
        // This just needs to be called once since we have no routes in this case.
        // ReactGA.pageview(window.location.pathname);
    }

    render() {
        // console.log('im rendering.');
        // return (<div>aaa</div>);
        return <ResponsiveDrawer />;
    }

    componentDidMount() {
        // console.log('im mounted.');
    }
}
 
/* The if statement is required so as to Render the component on pages that have a div with an ID of "yreport_root";  
*/
 
if (document.getElementById('yreport_root')) {
    // console.log('root founded.');
    ReactDOM.render(<YearReportHome />, document.getElementById('yreport_root'));
}