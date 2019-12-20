import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };


    orderHandler = (event) => {
        event.preventDefault();
        const order = {
           ingredients: this.props.ingredients,
           price: this.props.totalPrice.toFixed(2),
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
           this.setState({loading: false});
           this.props.history.push("/");
       }).catch(error => {
           this.setState({loading: false});
       });
    };

    render() {

        let form = (
            <form>
                <h4>Enter your Contact Data</h4>
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <p><strong>Total Price: </strong> {this.props.totalPrice.toFixed(2)}</p>
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner/>
        }

        return (
            <div className={classes.ContactData}>
                {form}
            </div>
        );
    }
}

export default ContactData;
