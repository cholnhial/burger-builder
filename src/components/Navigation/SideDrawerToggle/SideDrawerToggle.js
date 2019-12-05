import React from 'react';
import classes from './SideDrawerToggle.css';

const sideDrawerToggle = (props) => (
    <div onClick={props.clicked} className={classes.SideDrawerToggle}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default sideDrawerToggle;
