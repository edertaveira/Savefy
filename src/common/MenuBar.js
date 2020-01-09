import React, { useState } from 'react';
import routeNames from '../constants/routeNames';
import { Menu, Icon, Button, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import './MenuBar.css';
import { useFirebase } from 'react-redux-firebase'
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ModalLanguage from '../components/ModalLanguage';

function MenuBar(props) {

    const firebase = useFirebase();
    const history = useHistory();
    const profile = useSelector(state => state.firebase.profile);
    const [modalLanguageVisible, setModalLanguageVisible] = useState(false);
    const { t } = useTranslation();

    const getLink = (route, roles) => {
        return route;
    }

    const menuItems = [
        {
            icon: "team",
            name: t('label.intentions'),
            link: getLink(routeNames.INTENCOES, []),
            roles: ['intercessor'],
            style: { color: 'rgb(118, 160, 255)' }
        },
    ];

    const handleLogout = () => {
        firebase.logout();
    }


    let indexSelected = menuItems.findIndex(item => history.location.pathname === item.link);
    let selected = indexSelected !== -1 ? `menu_${menuItems[indexSelected].name}` : '';

    return (<>
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

                <Tooltip title={t('label.changeLanguage')}>
                    <Button type="link" onClick={() => setModalLanguageVisible(true)}><img alt="flag" width={20} src={`flags/${localStorage.getItem('language')}.png`} /></Button>
                </Tooltip>

                <Button icon="logout" style={{ marginLeft: 10 }} onClick={() => handleLogout()} size="small" type="danger">{t('button.signout')}</Button>
            </div>
        </Menu>
        <ModalLanguage visible={modalLanguageVisible} setVisible={setModalLanguageVisible} />
    </>
    );
}

export default MenuBar;
