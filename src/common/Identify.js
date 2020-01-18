import React , { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import ModalLanguage from '../components/ModalLanguage';
import { Button, Tooltip } from 'antd';

function Indentify() {

    const { t } = useTranslation();
    const firebase = useFirebase();
    const profile = useSelector(state => state.firebase.profile);
    const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

    const handleLogout = () => {
        firebase.logout();
    }

    return (<>
        <div style={{ float: 'right' }} >
            {profile.name}

            <Tooltip title={t('label.changeLanguage')}>
                <Button type="link" onClick={() => setModalLanguageVisible(true)}><img alt="flag" width={20} src={`flags/${localStorage.getItem('language')}.png`} /></Button>
            </Tooltip>

            <Button icon="logout" style={{ margin: 10 }} onClick={() => handleLogout()} size="small" type="danger">{t('button.signout')}</Button>
        </div>
        <ModalLanguage visible={modalLanguageVisible} setVisible={setModalLanguageVisible} />
    </>);
}

export default Indentify;