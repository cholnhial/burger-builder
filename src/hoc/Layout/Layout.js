import React, {Component, useState} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';


const Layout = props => {

    const [sideDrawerisVisible, setSideDrawerIsVisible] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    };

    const sideDrawerOpenedHandler = () => {
       setSideDrawerIsVisible(true);
    };

        return (
            <Aux>
                <Toolbar
                    isAuth={props.isAuthenticated}
                    onSideDrawerOpened={sideDrawerOpenedHandler}
                />
                <SideDrawer
                    isAuth={props.isAuthenticated}
                    open={sideDrawerisVisible}
                    closed={sideDrawerClosedHandler}
                />
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Aux>
        );

};


const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);
