import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import MenuBar from './MenuBar';
import { Layout, Button, Icon, Divider, Tooltip } from 'antd';
import Loadable from 'react-loadable';
import PageLoading from './PageLoading';
import { FaCopyright } from 'react-icons/fa';
import './PrivateRoute.css';
import Indentify from './Identify';

const { Header, Content, Footer, Sider } = Layout;

function PrivateRoute({ children, ...rest }) {

    const auth = useSelector(state => state.firebase.auth);

    const logoStyle = {
        margin: '16px 0px 16px',
        float: 'left',
        fontFamily: `'Pacifico', cursive`,
        fontSize: '20px'
    }

    const renderComponent = (AsyncFunc) => {
        return (

            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <Button type="link" block style={logoStyle}>savefy </Button>
                    <Divider />
                    <MenuBar />
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Indentify />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                            padding: 20,
                            background: '#fff',
                            minHeight: 360,
                        }}
                    >
                        <AsyncFunc />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}><span style={{ fontFamily: `'Pacifico', cursive` }}>savefy</span> <FaCopyright style={{ margin: '-2px 9px' }} /> 2020</Footer>
                </Layout>
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