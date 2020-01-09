import React, { useState, useEffect } from 'react';
import { Card, List, Tooltip, Col, Row, Badge, Spin, Statistic, Button, Alert, Empty, Divider, Modal } from 'antd';
import { Offline, Online } from "react-detect-offline";
//import ExtraLinks from '../common/ExtraLinks';
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { FaPray, FaPen, FaCross } from 'react-icons/fa';
import ModalComentario from './ModalComentario';
import { useTranslation } from 'react-i18next'


function Intencoes() {

    const [comentarios, setComentarios] = useState([]);
    const [intencao, setIntencao] = useState({});
    const [visible, setVisible] = useState(false);
    const [visibleTestemunho, setVisibleTestemunho] = useState(false);
    const [testemunho, setTestemunho] = useState({});
    const { t, i18n } = useTranslation();

    useFirestoreConnect(() => [
        { collection: 'intencoes', orderBy: [['createdAt', 'desc']] },
    ])
    const firestore = useFirestore();
    let intencoes = useSelector(state => state.firestore.ordered.intencoes);

    useEffect(() => {
        if (localStorage.getItem('language') !== 'en') {
            moment.locale(localStorage.getItem('language'), momentPTBR);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            i18n.changeLanguage(localStorage.getItem('language'));
        } else {
            moment.locale('en');
        }
    }, []);

    const auth = useSelector(state => state.firebase.auth);

    const rezar = async (id) => {
        const intencao = intencoes.find(item => item.id === id);
        let oracoes = [...intencao.oracoes, auth.uid];
        await firestore.collection('intencoes').doc(id).set({ ...intencao, oracoes });
    }

    const abrirModalComentario = (intencao) => {
        const comentarios = intencao.comentarios.map(item => {
            return {
                author: item.name,
                content: <p>{item.content}</p>,
                datetime: (<Tooltip title={moment(item.createdAt).format(t('dateformat'))}>
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
            intencoes.map(item => { comentariosTotal += item.comentarios.length; return; });
            intencoes.map(item => { oracoesTotal += item.oracoes.length; return; });
            intencoes.map(item => { if (item.testemunho) testemunhosTotal += 1; return; });
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
                <Alert type="warning" message={t('msg.info.networfail')} />
                <br /><br />
            </Offline>
            <Online>
                <Spin spinning={!intencoes} tip="Carregando Intenções...">
                    <Row gutter={16}>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title={t('label.intentions')} value={getTotal().intencoesTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title={t('label.prayers')} value={getTotal().oracoesTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title={t('label.messages')} value={getTotal().comentariosTotal} />
                        </Col>
                        <Col lg={6} md={6} sm={12} xs={12}>
                            <Statistic title={t('label.testimonials')} value={getTotal().testemunhosTotal} />
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
                            emptyText: <Empty description={t('msg.info.nointentions')} />
                        }}
                        dataSource={intencoes}
                        renderItem={intencao => {
                            const rezou = intencao.oracoes && intencao.oracoes.find(value => value === auth.uid)

                            return <List.Item key={intencao.id}>
                                <Card style={rezou ? { background: '#F0FFE4' } : {}} actions={[
                                    <Tooltip title={rezou ? t('label.prayed') : t('label.pray')}>
                                        <Button disabled={rezou} onClick={() => rezar(intencao.id)} type="link">
                                            <FaPray size="16" />
                                            <Badge count={intencao.oracoes && intencao.oracoes.length} style={{ backgroundColor: '#52c41a', marginTop: '-7px' }} />
                                        </Button>
                                    </Tooltip>,
                                    <Tooltip title={t('label.message')}>
                                        <Button onClick={() => abrirModalComentario(intencao)} type="link">
                                            <FaPen size="16" />
                                            <Badge count={intencao.comentarios && intencao.comentarios.length} style={{ marginTop: '-7px' }} />
                                        </Button>
                                    </Tooltip>,
                                    <Tooltip title={t('label.testimonials')}>
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