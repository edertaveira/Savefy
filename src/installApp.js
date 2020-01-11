import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaPlusCircle } from 'react-icons/fa';

function InstallApp(props) {
    const [installButton, setInstallButton] = useState(true);
    const { t, i18n } = useTranslation();
    let deferredPrompt;

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;

            // Update UI to notify the user they can add to home screen
            setInstallButton(true);
        });

    }, []);

    const addToHome = () => {
        // hide our user interface that shows our A2HS button
        setInstallButton(false);
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
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