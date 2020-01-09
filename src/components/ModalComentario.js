import React, { useState, useEffect } from 'react';
import { Form, Button, List, Modal, message, Comment, Empty } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { useTranslation } from 'react-i18next';

const ModalComentario = Form.create({ name: 'comentario' })(function ComentarioForm(props) {

    const firestore = useFirestore();
    const [iconLoading, setIconLoading] = useState(false);
    const { getFieldDecorator } = props.form;
    const auth = useSelector(state => state.firebase.auth);
    const profile = useSelector(state => state.firebase.profile);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (localStorage.getItem('language') !== 'en') {
            moment.locale(localStorage.getItem('language'), momentPTBR);
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
                let comentarios = [...props.intencao.comentarios];
                comentarios.push({ ...values, userId: auth.uid, name: profile.name, createdAt: Date.now() });

                console.log(comentarios);
                firestore.collection('intencoes').doc(props.intencao.id)
                    .set({ ...props.intencao, comentarios }).then(data => {
                        message.success(t('msg.message.success'));
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
            title={t('label.messages')}
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form onSubmit={handleSubmit} className="comentario-form">
                <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: t('msg.messagerequired') }],
                    })(
                        <TextArea
                            autoSize={{ minRows: 4, maxRows: 12 }}
                            type="password"
                            placeholder={t('msg.message.placeholder')}
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

                <List
                    className="comment-list"
                    header={`${props.comentarios && props.comentarios.length} ${t('label.messages')}`}
                    itemLayout="horizontal"
                    dataSource={props.comentarios}
                    locale={{
                        emptyText: <Empty description={t('msg.nomessages')} />
                    }}
                    renderItem={item => (
                        <li>
                            <Comment
                                author={item.author}
                                content={item.content}
                                datetime={item.datetime}
                            />
                        </li>
                    )}
                />

            </Form>
        </Modal>
    )
});

export default ModalComentario;