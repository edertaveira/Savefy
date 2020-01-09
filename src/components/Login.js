import React, { useState, useEffect } from 'react';
import logo from '../logo.svg'
import { Form, Icon, Input, Button, Row, Col, message, Typography } from 'antd';
import { useHistory } from "react-router-dom";
import { useFirebase, isEmpty, isLoaded } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import routeNames from '../constants/routeNames';
import { useTranslation } from 'react-i18next'
import Logo from '../common/Logo';

const { Title } = Typography;

function LoginForm(props) {
    const { getFieldDecorator } = props.form;
    const [iconLoading, setIconLoading] = useState(false);
    const history = useHistory();
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase && state.firebase.auth)
    const { t } = useTranslation()

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                setIconLoading(true);
                firebase.login({
                    email: values.email,
                    password: values.password
                }).catch(e => {
                    let msg = '';
                    switch (e.code) {
                        case 'auth/user-not-found':
                            msg = t('msg.error.usernotfound');
                            break;
                        case 'auth/wrong-password':
                            msg = t('msg.error.wrongpassword');
                            break;
                        default:
                            msg = t('msg.error.general');
                            break;
                    }
                    message.error(msg);
                }).finally(() => setIconLoading(false))

            }
        });
    };

    useEffect(() => {
        if (isLoaded(auth) && !isEmpty(auth))
            history.push(routeNames.INTENCOES)
    });

    return (
        <>
            <Row type="flex" justify="center" align="top">
                <Col lg={10} md={10} sm={20} xs={20}>
                    <Logo />
                </Col>
            </Row>
            <Row type="flex" justify="center" align="top">
                <Col lg={10} md={10} sm={20} xs={20}>

                    {/* <Title style={{ textAlign: 'center' }} level={4}><FaChurch size={20} /> {t("button.prayer")}</Title> */}
                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Item label={t("label.email")}>
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: t('msg.error.emailrequired') }],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label={t("label.password")}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: t('msg.error.passwordrequired') }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <div style={{ textAlign: 'center' }}>
                                {/*<a className="login-form-forgot" href="">
                                Esqueci a senha
                            </a>*/}
                                <br />
                                <Button type="primary" htmlType="submit"
                                    icon="check"
                                    loading={iconLoading}>
                                    {t('label.logar')}
                            </Button>
                                {/*<span style={{ marginLeft: 10 }}>ou <Link to="/register">Cadastrar agora!</Link></span>*/}
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
            );
        }
        
const Login = Form.create({name: 'login' })(LoginForm);
export default Login;