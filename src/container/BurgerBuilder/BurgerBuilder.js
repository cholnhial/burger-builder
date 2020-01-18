import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import axios from '../../axios-orders';
import {initIngredients} from "../../store/actions/index";
import * as actions from "../../store/actions";

export class BurgerBuilder extends Component {

    state = {
        purchasing: false
    };

    componentDidMount() {
        this.props.initIngredients();
        this.props.onInitPurchase();
    }

    updateCanBePurchaseState(ingredients) {

        const sum = Object.keys(ingredients).map((key, i) => {
            return ingredients[key]
        }).reduce((total, next) => total += next, 0);

        return sum > 0;
    }

    purchaseHandler = () =>  {
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            this.props.onSetAuthRedirectPath("/checkout");
            this.props.history.push('/auth');
        }

    };

    purchaseCancelHandler = () => {
      this.setState({purchasing: false})
    };

    purchaseContinuedHandler = () => {

         this.props.onInitPurchase();
         this.props.history.push( "/checkout");

    };

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;


        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

        if(this.props.ings != null) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ordered={this.purchaseHandler}
                        price={this.props.totalPrice}
                        disabledInfo={disabledInfo}
                        canBePurchased={this.updateCanBePurchaseState(this.props.ings)}
                        ingredientAdded={this.props.onAddIngredient}
                        isAuth={this.props.isAuthenticated}
                        ingredientRemoved={this.props.onRemoveIngredient}
                    />
                </Aux>);

            orderSummary = <OrderSummary
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinuedHandler}
                price={this.props.totalPrice}
                ingredients={this.props.ings}/>;
        }

    /*    if (this.state.loading) {
            orderSummary = <Spinner/>;
        }*/


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}

            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredient: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onRemoveIngredient: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        initIngredients: () => dispatch(initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
