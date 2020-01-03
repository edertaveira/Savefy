import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Tooltip, Row, Col, List, Divider, Modal, message, Comment, Empty } from 'antd';
import { Link, useLocation, useHistory } from "react-router-dom";

const ModalRastrear = Form.create({ name: 'comentario' })(function RastrearForm(props) {

    const [iconLoading, setIconLoading] = useState(false);
    const { getFieldDecorator } = props.form;
    const history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields(async (err, values) => {
            if (!err) {
                history.push(`/intencao?code=${values.code}`);
                props.setVisible(false);
                props.form.resetFields();
            }
        });
    }

    const handleCancel = () => {
        props.setVisible(false);
    }


    return (
        <Modal
            title="Rastrear Intenção"
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
            size="small"
        >
            <Form onSubmit={handleSubmit} className="rastrear-form">
                <Form.Item>
                    {getFieldDecorator('code', {
                        rules: [{ required: true, message: 'Por favor, coloque o código da sua intenção.' }],
                    })(
                        <Input type="text" placeholder="Código da Intenção" />,
                    )}
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={iconLoading}
                        className="login-form-button">
                        Rastrear Intenção
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
});

export default ModalRastrear;