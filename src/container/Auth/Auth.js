import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom'

class Auth extends Component {

    state = {
        controls: {
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
        },
        isSignUp: true
    };

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        });
    };
    inputChangedHandler  = (event, inputIdentifier) => {


        const controlsCopy = {
            ...this.state.controls
        };

        const updatedFormElement = { ...controlsCopy[inputIdentifier]};

        updatedFormElement.value = event.target.value;
        if(updatedFormElement.validation) {
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        }
        controlsCopy[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched = true;

        let formIsValid = true;

        for(let inputIdentifier in controlsCopy) {
            if(controlsCopy[inputIdentifier].hasOwnProperty('valid')) {
                formIsValid = controlsCopy[inputIdentifier].valid && formIsValid;
            }

        }

        this.setState({controls: controlsCopy, formIsValid: formIsValid});
    };

    checkValidity(value, rules) {
        let isValid = true;

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if(rules.isEmail) {
            isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) && isValid;
        }

        return Boolean(isValid);
    }

    submitHandler = (event) => {
        event.preventDefault();

        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }

    render() {

        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
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
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    value={formElement.value}
                />));

            if (this.props.loading) {
               form = <Spinner/>;
            }

            let errorMessage = null;
            if(this.props.error) {
                errorMessage = (<p>{this.props.error.message}</p>)
            }

            let authRedirect = null;
            if(this.props.isAuthenticated) {
                authRedirect = <Redirect to={this.props.authRedirectPath} />
            }

            return (
                <div className={classes.Auth}>
                    {authRedirect}
                    {errorMessage}
                    <form onSubmit={this.submitHandler}>
                        {form}
                        <Button btnType="Success">SUBMIT</Button>
                    </form>
                    <Button clicked={this.switchAuthModeHandler} btnType="Danger">SWITCH TO { this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
                </div>
            );
        }
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
