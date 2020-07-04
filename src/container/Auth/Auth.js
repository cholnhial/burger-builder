import React, { Component, useState, useEffect } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom'
import {checkValidity} from "../../shared/utility";

const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'joe@gmail.com'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false

        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false

        }
    });

    const [isSignUp, setIsSignUp] = useState(true);

    const { onSetAuthRedirectPath, buildingBurger, authRedirectPath } = props;
    useEffect(() => {
        if(!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [onSetAuthRedirectPath, buildingBurger, authRedirectPath]);

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    };

    const inputChangedHandler  = (event, inputIdentifier) => {


        const controlsCopy = {
            ...authForm
        };

        const updatedFormElement = { ...controlsCopy[inputIdentifier]};

        updatedFormElement.value = event.target.value;
        if(updatedFormElement.validation) {
            updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        }
        controlsCopy[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched = true;

        let formIsValid = true;

        for(let inputIdentifier in controlsCopy) {
            if(controlsCopy[inputIdentifier].hasOwnProperty('valid')) {
                formIsValid = controlsCopy[inputIdentifier].valid && formIsValid;
            }

        }

        setAuthForm(controlsCopy);
    };


    const submitHandler = (event) => {
        event.preventDefault();

        props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    };

        const formElementsArray = [];
        for (let key in authForm) {
            formElementsArray.push({
                id: key,
                config: authForm[key]
            });
        }


            let form = formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => inputChangedHandler(event, formElement.id)}
                    value={formElement.value}
                />));

            if (props.loading) {
               form = <Spinner/>;
            }

            let errorMessage = null;
            if(props.error) {
                errorMessage = (<p>{props.error.message}</p>)
            }

            let authRedirect = null;
            if(props.isAuthenticated) {
                authRedirect = <Redirect to={props.authRedirectPath} />
            }

            return (
                <div className={classes.Auth}>
                    {authRedirect}
                    {errorMessage}
                    <form onSubmit={submitHandler}>
                        {form}
                        <Button btnType="Success">SUBMIT</Button>
                    </form>
                    <Button clicked={switchAuthModeHandler} btnType="Danger">SWITCH TO { isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
                </div>
            );

}


const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
