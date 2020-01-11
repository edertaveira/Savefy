import React, { useState, useEffect } from 'react';
import routeNames from '../constants/routeNames';
import { Menu, Icon, Button, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import './MenuBar.css';
import { useFirebase } from 'react-redux-firebase'
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MenuBar(props) {

    const history = useHistory();
    const { t } = useTranslation();
    const [selected, setSelected] = useState(false);

    const getLink = (route, roles) => {
        return route;
    }

    const menuItems = [
        {
            icon: "team",
            name: t('label.intentions'),
            url: '/intencoes',
            link: getLink(routeNames.INTENCOES, []),
            roles: ['intercessor'],
            style: { color: 'rgb(118, 160, 255)' }
        },
    ];

    useEffect(() => {
        let indexSelected = menuItems.findIndex(item => history.location.pathname === item.url);
        setSelected(indexSelected !== -1 ? `menu_${menuItems[indexSelected].name}` : '');
    }, [])

    return (<>
        <Menu mode="inline" theme="dark" defaultSelectedKeys={[selected]}>
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

        </Menu>
    </>
    );
}

export default MenuBar;
