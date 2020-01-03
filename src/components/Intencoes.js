import React, { useState, useEffect } from 'react';
import { Card, List, Tooltip, Col, Row, Badge, Layout, Spin, Statistic, Icon, Typography, Button, PageHeader, Input, Alert, Empty, Divider, Modal } from 'antd';
import { Offline, Online } from "react-detect-offline";
//import ExtraLinks from '../common/ExtraLinks';
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore, useFirebase } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { FaChurch, FaPray, FaMicrophone, FaStop, FaPen, FaCross } from 'react-icons/fa';
import ModalComentario from './ModalComentario';


function Intencoes() {

    const [comentarios, setComentarios] = useState([]);
    const [intencao, setIntencao] = useState({});
    const [visible, setVisible] = useState(false);
    const [visibleTestemunho, setVisibleTestemunho] = useState(false);
    const [testemunho, setTestemunho] = useState({});

    useFirestoreConnect(() => [
        { collection: 'intencoes', orderBy: [['createdAt', 'desc']] },
    ])
    const firestore = useFirestore();
    let intencoes = useSelector(state => state.firestore.ordered.intencoes);
    moment.locale('pt-BR', momentPTBR);
    const auth = useSelector(state => state.firebase.auth);

    const rezar = async (id) => {
        const intencao = intencoes.find(item => item.id === id);
        //const oracao = intencao.oracoes && intencao.oracoes.find(item => item === auth.uid);
        let oracoes = [...intencao.oracoes, auth.uid];
        await firestore.collection('intencoes').doc(id).set({ ...intencao, oracoes });
    }

    const abrirModalComentario = (intencao) => {
        const comentarios = intencao.comentarios.map(item => {
            return {
                author: item.name,
                content: <p>{item.content}</p>,
                datetime: (<Tooltip title={moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
                    <span>{moment(item.createdAt).fromNow()}</span>
                </Tooltip>),
            }
        });
        setIntencao(intencao);
        setComentarios(comentarios);
        setVisible(true);
    }

    const abrirModalTestemunho = (intencao) => {
        if (intencao.testemunho) {
            setVisibleTestemunho(true);
            setTestemunho(intencao.testemunho);
        }
    }

    const getTotal = () => {
        let comentariosTotal = 0;
        let oracoesTotal = 0;
        let testemunhosTotal = 0;
        if (intencoes) {
            intencoes.map(item => { comentariosTotal += item.comentarios.length; });
            intencoes.map(item => { oracoesTotal += item.oracoes.length; });
            intencoes.map(item => { if (item.testemunho) testemunhosTotal += 1; });
        }
        return {
            intencoesTotal: intencoes && intencoes.length,
            oracoesTotal,
            comentariosTotal,
            testemunhosTotal
        };
    }


    return (
        <>
            <Offline>
                <Alert type="warning" message="Verifique sua conexão com a internet" />
                <br /><br />
            </Offline>
            <Online>
                <Spin spinning={!intencoes} tip="Carregando Intenções...">
                    <Row gutter={16}>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title="Intenções" value={getTotal().intencoesTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title="Intercessores" value={getTotal().oracoesTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title="Mensagens" value={getTotal().comentariosTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title="Testemunhos" value={getTotal().testemunhosTotal} />
                        </Col>
                    </Row>
                    <br />
                    <Divider />
                    <br />

                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 3,
                            xl: 4,
                            xxl: 3,
                        }}
                        locale={{
                            emptyText: <Empty description="Nenhuma Intenção encontrada" />
                        }}
                        dataSource={intencoes}
                        renderItem={intencao => {
                            const rezou = intencao.oracoes && intencao.oracoes.find(value => value === auth.uid)

                            return <List.Item key={intencao.id}>
                                <Card style={rezou ? { background: '#F0FFE4' } : {}} actions={[
                                    <Tooltip title={rezou ? "Você já Intercedeu!": "Interceder!"}>
                                        <Button disabled={rezou} onClick={() => rezar(intencao.id)} type="link">
                                            <FaPray size="16" />
                                            <Badge count={intencao.oracoes && intencao.oracoes.length} style={{ backgroundColor: '#52c41a', marginTop: '-7px' }} />
                                        </Button>
                                    </Tooltip>,
                                    <Tooltip title="Deixar uma mensagem">
                                        <Button onClick={() => abrirModalComentario(intencao)} type="link">
                                            <FaPen size="16" />
                                            <Badge count={intencao.comentarios && intencao.comentarios.length} style={{ marginTop: '-7px' }} />
                                        </Button>
                                    </Tooltip>,
                                    <Tooltip title="Ver Testemunho">
                                        <Button disabled={!intencao.testemunho} onClick={() => abrirModalTestemunho(intencao)} type="link">
                                            <FaCross size="16" />
                                        </Button>
                                    </Tooltip>,
                                ]}>
                                    <p>{intencao.content}</p>
                                    <p style={{ color: '#666666' }}>{intencao.city}-{intencao.regionCode}, {intencao.country}</p>
                                    <small>{moment(intencao.createdAt.toDate()).fromNow()}</small>
                                </Card>
                            </List.Item>
                        }}
                    />
                </Spin>
                <ModalComentario intencao={intencao} comentarios={comentarios} visible={visible} setVisible={setVisible} />
                <Modal
                    title="Testemunho"
                    visible={visibleTestemunho}
                    onCancel={() => setVisibleTestemunho(false)}
                    footer={null}
                >
                    <p>{testemunho.content}</p>
                    <small>{moment(testemunho.createdAt && testemunho.createdAt).fromNow()}</small>
                </Modal>
        </Online >
        </>
    )

}


export default Intencoes;