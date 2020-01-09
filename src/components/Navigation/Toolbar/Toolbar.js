import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../../components/Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import SideDrawerToggle from '../SideDrawerToggle/SideDrawerToggle';

const toolbar = (props) => (
    <header className={classes.Toolbar}>

        <SideDrawerToggle clicked={props.onSideDrawerOpened}/>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
    </header>
);


export default toolbar;
