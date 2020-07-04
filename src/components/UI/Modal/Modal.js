import React, {Component} from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from "../Backdrop/Backdrop";

const Modal = props => {


   /* shouldComponentUpdate(nextProps, nextState, nextContext) {
       return nextProps.show !== props.show || nextProps.children !== props.children;
    }*/

        return (
            <Aux>
                <Backdrop show={props.show} backdropClicked={props.modalClosed}/>
                <div className={classes.Modal} style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                    {props.children}
                </div>
            </Aux>
        );
};

export default React.memo(Modal, (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children);
