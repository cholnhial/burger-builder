import React, {Component, useEffect, useState, useCallback} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import {connect, useDispatch, useSelector} from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';
import axios from '../../axios-orders';
import * as actions from "../../store/actions";

const BurgerBuilder = props => {


    const [isPurchasing, setIsPurchasing] = useState(false);

    const dispatch = useDispatch();
    const onAddIngredient = (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName));
    const onRemoveIngredient = (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName));
    const initIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = useCallback(() => dispatch(actions.purchaseInit()), [dispatch]);
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));


    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });

    const price = useSelector(state => {
       return state.burgerBuilder.totalPrice
    });

    const error = useSelector(state => {
        return state.burgerBuilder.error
    });

    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null
    });


    useEffect(() => {
        initIngredients();
        onInitPurchase();
    }, [initIngredients, onInitPurchase]);


    const updateCanBePurchaseState = ingredients => {

        const sum = Object.keys(ingredients).map((key, i) => {
            return ingredients[key]
        }).reduce((total, next) => total += next, 0);

        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setIsPurchasing(true);
        } else {
            onSetAuthRedirectPath("/checkout");
            props.history.push('/auth');
        }

    };

    const purchaseCancelHandler = () => {
        setIsPurchasing(false);
    };

    const purchaseContinuedHandler = () => {

         onInitPurchase();
        props.history.push("/checkout");

    };
    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;


    let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner/>;

    if (ings != null) {
        burger = (
            <Aux>
                <Burger ingredients={ings}/>
                <BuildControls
                    ordered={purchaseHandler}
                    price={price}
                    disabledInfo={disabledInfo}
                    canBePurchased={updateCanBePurchaseState(ings)}
                    ingredientAdded={onAddIngredient}
                    isAuth={isAuthenticated}
                    ingredientRemoved={onRemoveIngredient}
                />
            </Aux>);

        orderSummary = <OrderSummary
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinuedHandler}
            price={price}
            ingredients={ings}/>;
    }

    /*    if (this.state.loading) {
            orderSummary = <Spinner/>;
        }*/


    return (
        <Aux>
            <Modal show={isPurchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}

        </Aux>
    );
};

export default withErrorHandler(BurgerBuilder, axios);
