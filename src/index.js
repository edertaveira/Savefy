import React from 'react';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store, rrfProps } from './firebase-config';

ReactDOM.render(
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <Root />
        </ReactReduxFirebaseProvider>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
