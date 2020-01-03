import React, { useEffect } from 'react';
import routeNames from '../constants/routeNames';
import { Layout, Menu, Icon, Button } from 'antd';
import { Link, withRouter } from "react-router-dom";
import { useSelector } from 'react-redux'
import './MenuBar.css';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import { useHistory } from 'react-router-dom';
const { Sider } = Layout;

function MenuBar(props) {

    const firebase = useFirebase();
    const history = useHistory();
    const profile = useSelector(state => state.firebase.profile)

    const getLink = (route, roles) => {
        return route;
    }

    const menuItems = [
        {
            icon: "team",
            name: 'Intenções',
            link: getLink(routeNames.INTENCOES, []),
            roles: ['intercessor'],
            style: { color: 'rgb(118, 160, 255)' }
        },
        // {
        //     icon: "setting",
        //     name: 'Configurações',
        //     link: getLink(routeNames.CONFIGURACOES, []),
        //     roles: ['intercessor'],
        //     style: { color: 'rgb(118, 160, 255)' }
        // }
    ];

    const handleLogout = () => {
        firebase.logout();
    }


    let indexSelected = menuItems.findIndex(item => history.location.pathname === item.link);
    let selected = indexSelected !== -1 ? `menu_${menuItems[indexSelected].name}` : '';

    return (
        <Menu mode="horizontal" style={{ lineHeight: '64px' }} defaultSelectedKeys={[selected]}>
            {menuItems.map((menu, index) => {
                //const user = JSON.parse(localStorage.getItem('user'));
                //const found = menu.roles.some(r=> user.roles.includes(r))
                //if (!found) return;

                return (<Menu.Item style={menu.style} key={`menu_${menu.name}`}>
                    <Link to={menu.link ? menu.link : '#'} style={menu.style} >
                        <Icon type={menu.icon} />
                        <span className="nav-text">{menu.name}</span>
                    </Link>
                </Menu.Item>)
            })}
            <div style={{ float: 'right' }} >
                {profile.name} 
                <Button icon="logout" style={{ marginLeft: 10}} onClick={() => handleLogout()} size="small" type="danger">Sair</Button>
            </div>
        </Menu>
    );
}

export default MenuBar;
