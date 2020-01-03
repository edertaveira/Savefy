import React from 'react'
import {
    Route,
    Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import MenuBar from './MenuBar';
import { Layout, Menu, Icon, Avatar, Button } from 'antd';
import Loadable from 'react-loadable';
import PageLoading from './PageLoading';

const { Header, Content, Footer, Sider } = Layout;

function PrivateRoute({ children, ...rest }) {
    const auth = useSelector(state => state.firebase.auth)


    const renderComponent = (AsyncFunc) => {
        return (
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }}>
                    <MenuBar />
                    {/* <Avatar style={{ backgroundColor: user.color }}>{firstLetters}</Avatar> <b>{user && user.nome}</b> */}
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 94 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                        <AsyncFunc />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>AnjoBom 2020</Footer>
            </Layout>
        );
    }

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoaded(auth) && !isEmpty(auth) ? renderComponent(Loadable({
                    loader: () => children,
                    loading: PageLoading
                }))
                    : <Redirect to={{ pathname: "/login", state: { from: location } }} />
            }
        />
    );
}
export default PrivateRoute;