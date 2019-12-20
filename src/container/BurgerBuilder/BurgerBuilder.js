import React, {Component} from 'react';
import axios from '../../axios-orders';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4.00,
        canBePurchased: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('https://burger-builder-d3b53.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            }).catch(error => {
                this.setState({error: true})
            });
    }

    updateCanBePurchaseState(ingredients) {

        const sum = Object.keys(ingredients).map((key, i) => {
            return ingredients[key]
        }).reduce((total, next) => total += next, 0);

        this.setState({
            canBePurchased: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });

        this.updateCanBePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });

        this.updateCanBePurchaseState(updatedIngredients);
    };

    purchaseHandler = () =>  {
        this.setState({purchasing: true})
    };

    purchaseCancelHandler = () => {
      this.setState({purchasing: false})
    };

    purchaseContinuedHandler = () => {

 const query = new URLSearchParams({...this.state.ingredients, totalPrice: this.state.totalPrice});
 this.props.history.push({
     pathname: "/checkout/",
     search: query.toString()
 });
    };

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;


        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

        if(this.state.ingredients != null) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                        disabledInfo={disabledInfo}
                        canBePurchased={this.state.canBePurchased}
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                    />
                </Aux>);

            orderSummary = <OrderSummary
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinuedHandler}
                price={this.state.totalPrice}
                ingredients={this.state.ingredients}/>;
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }


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

export default withErrorHandler(BurgerBuilder, axios);
