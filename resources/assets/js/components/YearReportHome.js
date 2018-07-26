import ReactGA from 'react-ga'; // https://github.com/react-ga/react-gaimport React, { Component } from 'react';
import React, { Component } from "react";
import ReactDOM from 'react-dom';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import {green100, green500, green700} from 'material-ui/styles/colors';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import PopOverMenuBar from './PopOverMenuBar';
// import DrawerMenuBar from './DrawerMenuBar';
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

/* An example React component */
// const FactBookHome = () => (
    // <MuiThemeProvider>
        // <ResponsiveDrawer />
    // </MuiThemeProvider>
// );

export default class YearReportHome extends Component {
    constructor() {
        super();
        this.state = {
            someData: null,
        };

        // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
        ReactGA.initialize('UA-10706568-3', { debug: true });
        // This just needs to be called once since we have no routes in this case.
        ReactGA.pageview(window.location.pathname);
    }

    render() {
        return <ResponsiveDrawer />;
    }

    // componentDidMount() {
    //     console.log(ga.q);
    // }
}
 
/* The if statement is required so as to Render the component on pages that have a div with an ID of "main";  
*/
 
if (document.getElementById('main')) {
    ReactDOM.render(<YearReportHome />, document.getElementById('main'));
}