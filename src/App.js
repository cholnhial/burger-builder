import React, { useEffect, Suspense } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from "./container/BurgerBuilder/BurgerBuilder";
import { Route, Switch, withRouter, Redirect} from 'react-router-dom';
import Logout from "./container/Auth/Logout/Logout";
import { connect } from 'react-redux';
import * as action from './store/actions/index';

const Checkout = React.lazy(() => {
    return import('./container/Checkout/Checkout')
});

const Orders = React.lazy(() => {
    return import('./container/Orders/Orders');
});

const Auth = React.lazy(() => {
    return import('./container/Auth/Auth');
});

const App = props => {

        const {onTryAutoSignIn} = props;

        useEffect(() => {
            onTryAutoSignIn();
        }, [onTryAutoSignIn]);

        let routes = (
            <Switch>
                 <Route  path="/auth" render={(props) => <Auth {...props} />}/>
                 <Route path="/" exact component={BurgerBuilder} />
                 <Redirect to="/"/>
            </Switch>
        );

        if(props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route  path="/checkout" render={(props) => <Checkout {...props} />} />
                    <Route  path="/orders"   render={(props) => <Orders {...props} />} />
                    <Route  path="/logout"   component={Logout} />
                    <Route  path="/auth"   render={(props) => <Auth {...props} />} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/"/>
                </Switch>
            );
        }

    return (
        <div>
          <Layout>
              <Suspense fallback={<p>Loading..</p>}>
              { routes}
              </Suspense>
          </Layout>
        </div>
    );

};


const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(action.authCheckState())
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
