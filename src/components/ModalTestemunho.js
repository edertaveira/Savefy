import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tooltip, Row, Col, List, Divider, Modal, message, Comment, Empty } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { Link, useLocation } from "react-router-dom";
import queryString from 'query-string'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { useTranslation, Trans } from 'react-i18next';

const ModalTestemunho = Form.create({ name: 'testemunho' })(function TestemunhoForm(props) {

    const firestore = useFirestore();
    const [iconLoading, setIconLoading] = useState(false);
    const { getFieldDecorator } = props.form;
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (localStorage.getItem('language') !== 'en') {
            moment.locale(localStorage.getItem('language'), momentPTBR);
            i18n.changeLanguage(localStorage.getItem('language'));
        } else {
            moment.locale('en');
        }
    }, []);


    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                setIconLoading(true);

                firestore.collection('intencoes').doc(props.intencao.id)
                    .set({ ...props.intencao, testemunho: { ...values, createdAt: Date.now() } }).then(data => {
                        message.success(t('msg.testimonial.success'));
                        props.setVisible(false);
                        props.form.resetFields();
                    }).catch(e => {
                        message.error(t('msg.error.general'));
                    }).finally(() => {
                        setIconLoading(false);
                    })
            }
        });
    }

    const handleCancel = () => {
        props.setVisible(false);
    }


    return (
        <Modal
            title={t('label.testimonial')}
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form onSubmit={handleSubmit} className="comentario-form">
                <p>{t('text.testimonial.1')}</p>
                <p>{t('text.testimonial.2')}</p>
                <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: t('msg.testimonialrequired') }],
                    })(
                        <TextArea
                            autoSize={{ minRows: 4, maxRows: 12 }}
                            type="password"
                            placeholder={t('text.testimonial.placeholder')}
                        />,
                    )}
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon="check"
                        loading={iconLoading}
                        className="login-form-button">
                        {t('label.send')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
});

export default ModalTestemunho;