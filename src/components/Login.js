import React, { useState, useEffect } from 'react';
import logo from '../logo.svg'
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { Link, useLocation, useHistory } from "react-router-dom";
import { useFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import routeNames from '../constants/routeNames'

function LoginForm(props) {
    const { getFieldDecorator } = props.form;
    const [iconLoading, setIconLoading] = useState(false);
    const history = useHistory();
    const firebase = useFirebase();
    const auth = useSelector(state => state.firebase && state.firebase.auth)

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                setIconLoading(true);
                firebase.login({
                    email: values.email,
                    password: values.password
                }).catch(e => {
                    let msg = '';
                    switch (e.code) {
                        case 'auth/user-not-found':
                            msg = 'Usuário não existe.';
                            break;
                        case 'auth/wrong-password':
                            msg = 'Senha ou Login incorreta.';
                            break;
                        default:
                            msg = 'Algo deu errado! Contate-nos caso persista.';
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
                    <Link to="/" style={{ display: 'block', fontFamily: `'Beth Ellen', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
                        Anjo<span style={{ color: '#b7b7b7' }}>bom</span>
                    </Link>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="top">
                <Col lg={10} md={10} sm={20} xs={20}>
                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                rules: [{ required: true, message: 'Por favor, preencha o email.' }],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="Senha">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Por favor, preencha sua senha.' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Senha"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {/*<a className="login-form-forgot" href="">
                                Esqueci a senha
                            </a>*/}
                            <br />
                            <Button type="primary" htmlType="submit"
                                icon="check"
                                loading={iconLoading}>
                                Logar
                            </Button>
                            {/*<span style={{ marginLeft: 10 }}>ou <Link to="/register">Cadastrar agora!</Link></span>*/}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

const Login = Form.create({ name: 'login' })(LoginForm);
export default Login;