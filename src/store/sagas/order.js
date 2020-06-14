import axios from "../../axios-orders";
import * as actions from '../actions';
import {put} from "@redux-saga/core/effects";
import {fetchOrdersFail, fetchOrdersStart, fetchOrdersSuccess} from "../actions/order";

export function* purchaseBurgerSaga(action) {
    yield put(actions.purchaseBurgerStart());
    try {
        const response = yield axios.post('/orders.json?auth=' + action.token, action.orderData);
        yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
    }
    catch (error) {
        yield put(actions.purchaseBurgerFail(error));
    }
}

export function* fetchOrdersSaga(action) {
    yield put(actions.fetchOrdersStart());
    const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
    try {
        const response = yield  axios.get('/orders.json' + queryParams);
        let orders = Object.keys(response.data).map((k, i) => {
            return {...response.data[k], id: k};
        });
        yield put(actions.fetchOrdersSuccess(orders));
    } catch (error) {
        yield  put(actions.fetchOrdersFail(error));
    }
}
