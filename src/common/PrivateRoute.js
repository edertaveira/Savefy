import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import MenuBar from './MenuBar';
import { Layout, Button } from 'antd';
import Loadable from 'react-loadable';
import PageLoading from './PageLoading';
import { FaCopyright } from 'react-icons/fa';

const { Header, Content, Footer } = Layout;

function PrivateRoute({ children, ...rest }) {
    const auth = useSelector(state => state.firebase.auth)

    const logoStyle = {
        margin: '16px 0 0 0',
        float: 'left',
        fontFamily: `'Pacifico', cursive`,
        fontSize: '20px'
    }

    const renderComponent = (AsyncFunc) => {
        return (
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff' }}>
                    <Button type="link" style={logoStyle}>in4<span style={{ color: '#333' }}>us</span></Button>
                    <MenuBar />
                    {/* <Avatar style={{ backgroundColor: user.color }}>{firstLetters}</Avatar> <b>{user && user.nome}</b> */}
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 94 }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                        <AsyncFunc />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}><span style={{ fontFamily: `'Pacifico', cursive` }}>sospray</span> <FaCopyright style={{ margin: '-2px 9px' }} /> 2020</Footer>
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