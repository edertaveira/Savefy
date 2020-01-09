import React, { Suspense } from 'react';
import PageLoading from './common/PageLoading';
import { Layout, Menu, Icon, Avatar, Button } from 'antd';
import Loadable from 'react-loadable';
import routeNames from './constants/routeNames';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import PrivateRoute from './common/PrivateRoute';
import './i18n'

class Root extends React.Component {




    render() {
        return (
            <Suspense fallback={null}>
                <Router>
                    <Route exact path={routeNames.LOGIN} component={Loadable({
                        loader: () => import('./components/Login'),
                        loading: PageLoading
                    })} />
                    <Route exact path={routeNames.HOME} component={Loadable({
                        loader: () => import('./components/Home'),
                        loading: PageLoading
                    })} />
                    <Route exact path={routeNames.INTENCAO} component={Loadable({
                        loader: () => import('./components/Intencao'),
                        loading: PageLoading
                    })} />
                    {/* <Route exact path={routeNames.REGISTER} component={Loadable({
                        loader: () => import('./components/Register'),
                        loading: PageLoading
                    })} /> */}
                    <PrivateRoute exact path={routeNames.INTENCOES} >
                        {import('./components/Intencoes')}
                    </PrivateRoute>
                </Router>
            </Suspense>
        );
    }
}

export default Root;
