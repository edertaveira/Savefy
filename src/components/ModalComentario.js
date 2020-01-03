import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tooltip, Row, Col, List, Divider, Modal, message, Comment, Empty } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { Link, useLocation } from "react-router-dom";
import queryString from 'query-string'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';

const ModalComentario = Form.create({ name: 'comentario' })(function ComentarioForm(props) {

    const firestore = useFirestore();
    const [iconLoading, setIconLoading] = useState(false);
    const { getFieldDecorator } = props.form;
    const auth = useSelector(state => state.firebase.auth);
    const profile = useSelector(state => state.firebase.profile);
    moment.locale('pt-BR', momentPTBR);

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
                        message.success('Comentário enviado!');
                        props.setVisible(false);
                        props.form.resetFields();
                    }).catch(e => {
                        message.error('Aconteceu algo de errado, tente novamente mais tarde.');
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
            title="Comentario"
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form onSubmit={handleSubmit} className="comentario-form">
                <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: 'Por favor, coloque seu comentário.' }],
                    })(
                        <TextArea
                            autoSize={{ minRows: 4, maxRows: 12 }}
                            type="password"
                            placeholder="Coloque aqui o que o Senhor te revelou, uma palavra de ciência ou sabedoria, uma passagem, um conselho."
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
                        Comentar
                    </Button>
                </Form.Item>

                <List
                    className="comment-list"
                    header={`${props.comentarios && props.comentarios.length} comentários`}
                    itemLayout="horizontal"
                    dataSource={props.comentarios}
                    locale={{
                        emptyText: <Empty description="Nenhum Comentário" />
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