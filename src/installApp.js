import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaPlusCircle } from 'react-icons/fa';

function InstallApp(props) {
    const [installButton, setInstallButton] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(true);
    const { t, i18n } = useTranslation();
    let deferredPrompt;

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setInstallButton(true);
        });
    }, []);

    const addToHome = () => {
        setInstallButton(false);
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    }

    const style = {
        borderRadius: 0
    }

    return (<>{installButton && <Button style={style} size="large" type="primary" block onClick={() => addToHome()} >
        <FaPlusCircle style={{ margin: '0px 10px -3px 0' }} />
        {t('msg.install')}
    </Button>}</>);
}

export default InstallApp;