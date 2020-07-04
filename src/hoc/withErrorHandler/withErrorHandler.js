import React, {Component, useState, useEffect} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux  from '../../hoc/Aux/Aux';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

            let modal = null;
            if(error !== null) {
               modal = <Modal modalClosed={errorConfirmedHandler} show={error}>{error.message}</Modal>;
            }

            return (
                <Aux>
                    {modal}
                    <WrappedComponent {...props}/>
                </Aux>
            );
    };

};

export default withErrorHandler;
