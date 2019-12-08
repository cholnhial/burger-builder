import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux  from '../../hoc/Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {

        state = {
            error: null
        };


        componentWillMount() {
            axios.interceptors.request.use(req => {
                this.setState({error: null});

                return req;
            });

            axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})

                return Promise.reject(error);
            })
        }

        errorConfirmedHandler = () => {
            this.setState({error: true})
        };

        render() {
            let modal = null;
            if(this.state.error !== null) {
               modal = <Modal backdropClicked={this.errorConfirmedHandler} show={this.state.error}>{this.state.error.message}</Modal>;
            }

            return (
                <Aux>
                    {modal}
                    <WrappedComponent {...this.props}/>
                </Aux>
            );
        }
    };

};

export default withErrorHandler;
