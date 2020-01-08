import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Radio, Row, Col, List, Divider, Modal, message, Comment, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { useFirestore, useFirebase } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { useTranslation, Trans } from 'react-i18next';

const ModalLanguage = Form.create({ name: 'language' })(function LanguageForm(props) {

    const firebase = useFirebase();
    const [iconLoading, setIconLoading] = useState(false);
    const { getFieldDecorator } = props.form;
    const profile = useSelector(state => state.firebase.profile);
    const { t, i18n } = useTranslation();

    moment.locale('pt-BR', momentPTBR);

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                //firebase.updateProfile({ language: values.language });
                localStorage.setItem('language', values.language);
                i18n.changeLanguage(values.language.toLowerCase());
                props.setVisible(false);

            }
        });
    }

    const handleCancel = () => {
        props.setVisible(false);
    }

    useEffect(() => {
        console.log(localStorage.getItem('language'));
        props.form.setFieldsValue({ language: localStorage.getItem('language') })
    }, [])



    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };


    return (
        <Modal
            title={t('label.language')}
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form onSubmit={handleSubmit} className="comentario-form">
                <Form.Item>
                    {getFieldDecorator('language', {
                        rules: [{ required: true, message: 'A Lingua é obrigatória.' }],
                    })(
                        <Radio.Group>
                            <Radio style={radioStyle} value="en">
                                <img width={15} src={`flags/en.png`} /> 
                                English
                            </Radio>
                            <Radio style={radioStyle} value="pt-br">
                                <img width={15} src={`flags/pt-br.png`} /> 
                                Português
                            </Radio>
                            <Radio disabled style={radioStyle} value="es">
                                <img width={15} src={`flags/es.png`} /> 
                                Espanõl ({t('msg.commingsoon')})
                            </Radio>
                            <Radio disabled style={radioStyle} value="it">
                                <img width={15} src={`flags/it.png`} /> 
                                Italiano ({t('msg.commingsoon')})
                            </Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={iconLoading}
                        className="login-form-button">
                        Salvar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
});

export default ModalLanguage;