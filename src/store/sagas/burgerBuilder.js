import axios from "../../axios-orders";
import * as actions from '../actions';
import { put } from "@redux-saga/core/effects";

export function* initIngredientsSaga(action) {

    try {
        const response = yield axios.get('https://burger-builder-d3b53.firebaseio.com/ingredients.json');
        yield put(actions.setIngredients(response.data));
    }
    catch (error) {
        yield put(actions.fetchIngredientsFailed());
    }
}
