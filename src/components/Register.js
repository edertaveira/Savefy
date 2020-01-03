import React, { useState, useEffect }  from 'react';
import logo from '../logo.svg'
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { Link, useLocation } from "react-router-dom";
import { useFirebase, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

function RegisterForm(props) {
    const { getFieldDecorator } = props.form;
    const [iconLoading, setIconLoading] = useState(false);
    const [confirmDirty, setConfirmDirty] = useState(false);
    const firebase = useFirebase();

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                setIconLoading(true);
                console.log('Received values of form: ', values);
                firebase.createUser(
                    { email: values.email, password: values.password },
                    { name: values.name, email: values.email, phone: values.phone }
                ).then(data => {
                    console.info(data);
                    message.success('Muito grato pelo seu sim!');
                }).catch(e => {
                    console.error(e);
                    message.error('Algo deu errado! Contate-nos caso persista.');
                }).finally(() => setIconLoading(false));

            }
        });
    };

    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
            callback('As duas senhas não coincidem!');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    const formStyle = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };

    return (
        <Row>
            <Col span={12} offset={4}>
                <Form {...formStyle} onSubmit={handleSubmit} className="login-form">
                    <Link to="/" style={{ display: 'block', fontFamily: `'Beth Ellen', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
                        Anjo<span style={{ color: '#b7b7b7' }}>bom</span>
                    </Link>
                    <Form.Item label="Nome">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Por favor, preencha seu nome.' }],
                        })(
                            <Input placeholder="Nome" type="text" />,
                        )}
                    </Form.Item>
                    <Form.Item label="E-mail">
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Por favor, preencha seu email.' }],
                        })(
                            <Input placeholder="Email" type="email" />,
                        )}
                    </Form.Item>
                    <Form.Item label="Celular">
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: 'Por favor, preencha seu celular.' }],
                        })(
                            <PhoneInput className="ant-input" placeholder="Coloque seu celular aqui" />
                        )}
                    </Form.Item>
                    <Form.Item label="Senha">
                        {getFieldDecorator('password', {
                            rules: [
                                { required: true, message: 'Por favor, preencha sua senha.' },
                                { validator: validateToNextPassword }
                            ],
                        })(
                            <Input
                                type="password"
                                placeholder="Senha"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Confirmação">
                        {getFieldDecorator('confirm', {
                            rules: [
                                { required: true, message: 'Por favor, confirme sua senha.' },
                                { validator: compareToFirstPassword }
                            ],
                        })(
                            <Input
                                type="password"
                                placeholder="Confimação da Senha"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit"
                            icon="check"
                            loading={iconLoading}>
                            Cadastrar
                            </Button>
                        <span style={{ marginLeft: 10 }}>ou <Link to="/login">Já sou cadastrado!</Link></span>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

const Register = Form.create({ name: 'login' })(RegisterForm);
export default Register;