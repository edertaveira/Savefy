import React, { useState, useEffect } from 'react';
import { Card, List, Tooltip, Col, Row, Badge, Layout, Statistic, Icon, Typography, Button, PageHeader, Input, Alert, Empty, Divider } from 'antd';
import { Offline, Online } from "react-detect-offline";
//import ExtraLinks from '../common/ExtraLinks';
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore, useFirebase } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { FaChurch, FaPray, FaMicrophone, FaStop, FaPen } from 'react-icons/fa';
import ModalComentario from './ModalComentario';


function Intencoes() {

    const [comentarios, setComentarios] = useState([]);
    const [intencao, setIntencao] = useState({});
    const [visible, setVisible] = useState(false);

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

    const getTotal = () => {
        let comentariosTotal = 0;
        let oracoesTotal = 0;
        if (intencoes) {
            intencoes.map(item => { comentariosTotal += item.comentarios.length; });
            intencoes.map(item => { oracoesTotal += item.oracoes.length; });
        }
        return {
            intencoesTotal: intencoes && intencoes.length,
            oracoesTotal,
            comentariosTotal,
            testemunhosTotal: 0
        };
    }


    return (
        <>
            <Offline>
                <Alert type="warning" message="Verifique sua conexão com a internet" />
                <br /><br />
            </Offline>
            <Online>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title="Intenções" value={getTotal().intencoesTotal} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Orações Realizadas" value={getTotal().oracoesTotal} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Comentários" value={getTotal().comentariosTotal} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Testemunhos" value={getTotal.testemunhosTotal} />
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
                                <Tooltip title="Rezar!">
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
                            ]}>
                                <p>{intencao.content}</p>
                                <p style={{ color: '#666666'}}>{intencao.city}-{intencao.regionCode}, {intencao.country}</p>
                                <small>{moment(intencao.createdAt.toDate()).fromNow()}</small>
                            </Card>
                        </List.Item>
                    }}
                />
                <ModalComentario intencao={intencao} comentarios={comentarios} visible={visible} setVisible={setVisible} />
            </Online >
        </>
    )

}


export default Intencoes;