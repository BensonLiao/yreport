import React from 'react'; 
import IconButton from 'material-ui/IconButton';
import NavigationIcon from '@material-ui/icons/Navigation';

const styles = {
    scrollButton: {
        opacity: '0.3',
        width: '40px',
        height: '40px',
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        borderRadius: '5px',
        border: 'none',
    }
};

/** React components for scrolling back to the top of the page **/
export default class ScrollButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            intervalId: 0,
            display: false,
        };
    }

    scrollStep = () => {
        if (window.pageYOffset === 0) {
            clearInterval(this.state.intervalId);
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }

    scrollToTop = () => {
        let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
        this.setState({ intervalId: intervalId });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    handleScroll = (event) => {
        let display = this.state.display;
        let onScroll = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20);
        // console.log('display='+display);
        if (display !== onScroll) this.setState({ display: onScroll });
    }

    render () {
        const { display } = this.state;
        const button = 
        <div>
            <style>
            {`
                .scrollButton:hover {
                    opacity: 1 !important;
                }  
            `}
            </style>
            <IconButton className='scrollButton' style={styles.scrollButton} onClick={() => { this.scrollToTop(); }} title='Back to top'>
                <NavigationIcon />
            </IconButton>
        </div>;

        if (display) return button;
        return null;
    }
} 