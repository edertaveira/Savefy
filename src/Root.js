import React, { Suspense } from 'react';
import PageLoading from './common/PageLoading';
import Loadable from 'react-loadable';
import routeNames from './constants/routeNames';
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from './common/PrivateRoute';
import './i18n';
import InstallApp from './installApp';

class Root extends React.Component {

    render() {
        return (
            <Suspense fallback={null}>
                <InstallApp />
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
