import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        }
    };


    orderHandler = (event) => {
        event.preventDefault();
        const order = {
           ingredients: this.state.ingredients,
           price: this.state.totalPrice.toFixed(2),
           customer: {
               name: 'Chol Nhial',
               address: {
                   street: '17 Sesame St',
                   zipCode: '1337',
                   country: 'Australia'
               }
           },
           email: 'c.nhial@gmail.com',
           deliveryMethod: 'fastest'
       };

      this.setState({loading: true});
       axios.post('/orders.json', order).then(response => {
           this.setState({loading: false, purchasing: false});

       }).catch(error => {
           this.setState({loading: false, purchasing: false});
       });
    };

    render() {
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                <form>
                    <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                    <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                    <input className={classes.Input} type="text" name="street" placeholder="Street" />
                    <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                    <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                </form>
            </div>
        );
    }
}

export default ContactData;
