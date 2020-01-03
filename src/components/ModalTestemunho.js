import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tooltip, Row, Col, List, Divider, Modal, message, Comment, Empty } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { Link, useLocation } from "react-router-dom";
import queryString from 'query-string'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';

const ModalTestemunho = Form.create({ name: 'testemunho' })(function TestemunhoForm(props) {

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

                firestore.collection('intencoes').doc(props.intencao.id)
                    .set({ ...props.intencao, testemunho: { ...values, createdAt: Date.now() } }).then(data => {
                        message.success('Testemunho enviado!');
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
            title="Testemunho"
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form onSubmit={handleSubmit} className="comentario-form">
                <p>Deus fez muito! partilhe conosco as obras do Altíssimo para que outros irmãos possam ser alcançados.</p>
                <p>Uma vez Postado você não poderá editar nem excluir.</p>
                <Form.Item>
                    {getFieldDecorator('content', {
                        rules: [{ required: true, message: 'Por favor, coloque seu comentário.' }],
                    })(
                        <TextArea
                            autoSize={{ minRows: 4, maxRows: 12 }}
                            type="password"
                            placeholder="Coloque aqui o que o Senhor fez na sua vida sobre esta intenção."
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
                        Postar Testemunho
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
});

export default ModalTestemunho;