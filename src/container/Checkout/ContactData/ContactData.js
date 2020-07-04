import React, { Component, useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { purchaseBurger } from "../../../store/actions";
import {checkValidity, updateObject} from "../../../shared/utility";

const ContactData  = props  => {

    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false

        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP CODE'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            },
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your Email'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: 'fastest'
        }
    });

    const [formIsValid, setFormIsValid] = useState(false);



    const orderHandler = (event) => {
        event.preventDefault();

      const formData = {

      };

      for(let formElementIdentifier in orderForm) {
          formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
      }

        const order = {
            ingredients: props.ings,
            price: props.price.toFixed(2),
            orderData: formData,
            userId: props.userId
        };

      props.onOrderBurger(order, props.token);
    };

    const inputChangedHandler  = (event, inputIdentifier) => {

       const updatedFormElement = updateObject(orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
            touched: true
       });

        const updatedOrderForm = updateObject(orderForm, {
            [inputIdentifier]: updatedFormElement
        });

       let formIsValid = true;

       for(let inputIdentifier in updatedOrderForm) {
           if(updatedOrderForm[inputIdentifier].hasOwnProperty('valid')) {
               formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
           }

       }

       setOrderForm(updatedOrderForm);
       setFormIsValid(formIsValid);
    };

        const formElementsArray = [];
        for (let key  in orderForm) {
            formElementsArray.push({
                id: key,
                config: orderForm[key]
            })
        }

        let form = (
            <form onSubmit={orderHandler}>
                <h4>Enter your Contact Data</h4>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => inputChangedHandler(event, formElement.id)}
                        value={formElement.value}
                    />
                ))}
                <Button disabled={!formIsValid}  btnType="Success">ORDER</Button>
            </form>
        );
        if (props.loading) {
            form = <Spinner/>
        }

        return (
            <div className={classes.ContactData}>
                {form}
            </div>
        );

};

const mapStateToProps =  state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId

    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
