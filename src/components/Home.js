
import React, { useState, useEffect } from 'react';
import { Form,  Button, Tooltip, Row, Col, Divider, Tabs, message, Statistic } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore } from 'react-redux-firebase'
import { Link, useHistory } from "react-router-dom";
import shortid from 'shortid';
import { FaChurch, FaPray, FaCopyright } from 'react-icons/fa';
import publicIp from 'public-ip';
import iplocation from "iplocation";
import ModalRastrear from './ModalRastrear';
import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next'
import Logo from '../common/Logo';
import ModalLanguage from './ModalLanguage';
import detectBrowserLanguage from 'detect-browser-language'
import LanguageDetect from 'languagedetect';


const { TabPane } = Tabs;
const { Countdown } = Statistic;

function HomeForm(props) {
    const firestore = useFirestore();
    const history = useHistory();
    const [iconLoading, setIconLoading] = useState(false);
    const [modalLanguageVisible, setModalLanguageVisible] = useState(false);
    const [lastRecordedAt, setLastRecordedAt] = useState(null);
    const [visible, setVisible] = useState(false);
    const { t, i18n } = useTranslation()

    const { getFieldDecorator } = props.form;

    const configureLastRecorded = (recording = false) => {
        if (recording) localStorage.setItem('lastRecordedAt', + new Date());
        if (localStorage.getItem('lastRecordedAt')) {
            setLastRecordedAt(moment(parseInt(localStorage.getItem('lastRecordedAt'))).add(5, 'minute'))
        }
    }



    useEffect(() => {
        configureLastRecorded();
        if (localStorage.getItem('language')) {
            i18n.changeLanguage(localStorage.getItem('language'));
        } else {
            i18n.changeLanguage(detectBrowserLanguage().toLowerCase());
            localStorage.setItem('language', detectBrowserLanguage().toLowerCase());
        }
    }, []);

    const keywords = [
        'suicide', 'suicidio',
    ]

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                const ip = await publicIp.v4();
                const ipLocation = await iplocation(ip);
                const code = shortid.generate();
                const lngDetector = new LanguageDetect();
                const languages = lngDetector.detect(values.content);

                firestore.add('intencoes', {
                    ...values,
                    code,
                    createdAt: new Date(),
                    ip,
                    ...ipLocation,
                    oracoes: [],
                    comentarios: [],
                    language: languages[0]
                }).then((data) => {
                    configureLastRecorded(true);
                    setIconLoading(false);
                    props.form.resetFields();
                    message.success(t('msg.intention.success'));
                    history.push(`/intencao?code=${code}`);
                });


            }
        });
    };

    const abrirModalRastrarIntencao = () => {
        setVisible(true);
    }

    const onFinish = () => {
        localStorage.setItem('lastRecordedAt', null);
        setLastRecordedAt(null);
    }

    const operations = (<>
        <Tooltip title={t('button.prayer')}>
            <Link style={{ float: 'left', marginTop: '10px' }} className="ant-btn ant-btn-link" to='/login'><FaChurch size={20} /></Link>
        </Tooltip>
        <Tooltip title={t('label.changeLanguage')}>
            <Button type="link" onClick={() => setModalLanguageVisible(true)}><img alt="flag" width={20} src={`flags/${localStorage.getItem('language')}.png`} /></Button>
        </Tooltip>
    </>);


    const form = () => {
        return (<Form onSubmit={handleSubmit} className="login-form">
            {lastRecordedAt !== null && lastRecordedAt.isAfter(moment()) && <Countdown style={{ textAlign: 'center' }} title="Nova Intenção em" onFinish={onFinish} value={lastRecordedAt} />}
            <Form.Item>
                {getFieldDecorator('content', {
                    rules: [{ required: true, message: t('msg.intention.required') }],
                })(
                    <TextArea
                        autoSize={{ minRows: 4, maxRows: 12 }}
                        disabled={lastRecordedAt && lastRecordedAt.isAfter(moment())}
                        type="password"
                        placeholder={t('msg.intention.placeholder')}
                    />,
                )}
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon="check"
                    loading={iconLoading}
                    disabled={lastRecordedAt && lastRecordedAt.isAfter(moment())}
                    className="login-form-button">
                    {t('button.request.pray')}
                </Button> <Button onClick={() => abrirModalRastrarIntencao()} type="link"><FaPray /> {t('button.track.intention')}</Button>
            </Form.Item>
        </Form>);
    }



    return (
        <Row type="flex" justify="center" align="top">
            <Col lg={18} md={18} sm={20} xs={20}>
                <Logo />

                <Tabs type="card" tabBarExtraContent={operations}>
                    <TabPane tab={t('tab.ask')} key="1">
                        {form()}
                    </TabPane>
                    <TabPane tab={t('tab.about')} key="2">
                        <Trans i18nKey='tab.about.description'>
                            Savefy é uma iniciativa sem fins lucrativos para ajudar pessoas que sentem necessidade de pedir orações por um problema sério que esteja passando. Pensamentos ruins, de suicídio, problemas nas quais aparentemente não há solução, Deus pode intervir e uma palavra, uma oração, pode salvar uma vida.
                            <h2 style={{ marginTop: 10 }}>Como funciona?</h2>
                            O usuário preenche sua intenção (sem necessidade de identificar-se) e clica no botão de enviar, será gerado um código único para a oração e todos os intercessores cadastrados na plataforma irão receber esta intenção podendo clicar em 'Interceder' e enviar mensagens, tudo isso podendo ser acompanhado pelo usuário através do código gerado.
                            O usuário através do mesmo código, pode também colocar mais tarde um testemunho, frutificando outras pessoas. Tais testemunhos são publicados aqui e nas redes sociais.
                            <h2 style={{ marginTop: 10 }}>Como se tornar um Intercessor?</h2>
                            A princípio somente pessoas préviamente cadastradas por nós são os intercessores, porém estamos estudando uma forma de permitir cadastro automático, com uma avaliação anterior prezando pela segurança da plataforma.
                        </Trans>
                    </TabPane>
                </Tabs>

                <Divider />
                <div style={{ textAlign: 'center' }}>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="D3R5W3QUV48J4" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                        {/* <img alt="" border="0" src="https://www.paypal.com/en_BR/i/scr/pixel.gif" width="1" height="1" /> */}
                    </form>
                    <br /><br /><br />
                    <div><span style={{ fontFamily: `'Pacifico', cursive` }}>savefy</span> <FaCopyright style={{ margin: '-2px 9px' }} /> 2020</div>
                </div>
                <ModalRastrear visible={visible} setVisible={setVisible} />
                <ModalLanguage visible={modalLanguageVisible} setVisible={setModalLanguageVisible} />
            </Col>
        </Row>
    );
}

const Home = Form.create({ name: 'home' })(HomeForm);
export default Home;