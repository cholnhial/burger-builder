import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from "./ContactData/ContactData";

class Checkout extends Component {

    state = {
        ingredients: {
            salad: 1,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    };

    componentDidMount() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let newIngredients = {};
        queryParams.forEach((v, k) => {
            newIngredients[k] = Number(v);
        });

        this.setState({
            ingredients: newIngredients
        });
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
        return (
            <div>
                <CheckoutSummary checkoutCancelled={this.checkoutCancelledHandler}
                                 checkoutContinued={this.checkoutContinuedHandler}
                                 ingredients={this.state.ingredients}/>
                                 <Route path={this.props.match.path + '/contact-data'} render={() => <ContactData
                                     ingredients={this.state.ingredients}/>} />
            </div>
        )
    }

}

export default Checkout;
