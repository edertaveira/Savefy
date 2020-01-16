import React, { useState, useEffect } from 'react';
import { Card, List, Tooltip, Col, Row, Badge, Spin, Statistic, Button, Alert, Empty, Divider, Modal, Input, Typography, Popover, Radio } from 'antd';
import { Offline, Online } from "react-detect-offline";
//import ExtraLinks from '../common/ExtraLinks';
import { useSelector } from 'react-redux'
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase'
import moment from 'moment';
import momentPTBR from '../constants/momentPTBR';
import { FaPray, FaPen, FaCross } from 'react-icons/fa';
import ModalComentario from './ModalComentario';
import { useTranslation } from 'react-i18next'

const { Search } = Input;
const { Paragraph } = Typography;

function Intencoes() {

    const [comentarios, setComentarios] = useState([]);
    const [intencao, setIntencao] = useState({});
    const [result, setResult] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleTestemunho, setVisibleTestemunho] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
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


    useEffect(() => {
        console.log('getting result...');
        let result = intencoes;
        const keywords = ['suicide', 'suicídio', 'suicidio', 'suicidar', 'matar', 'kill', 'morrer', 'aborto', 'abortion']
        switch (filter) {
            case 'urgent':
                result = intencoes.filter(item => keywords.some(word => item.content.includes(word)));
                break;
            case 'prayed':
                result = intencoes.filter(item => item.oracoes && item.oracoes.find(value => value === auth.uid));
                break;
            default:
                break;
        }
        setResult(search === '' ? result: result.filter(item => item.content.includes(search)));
        
    }, [intencoes, filter, search])

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

    const onSearch = ({ target: { value } }) => {
        setSearch(value);
    }

    const onFilter = (e) => {
        console.log(e);
        setFilter(e.target.value);
    }

    return (
        <>
            <Offline>
                <Alert type="warning" message={t('msg.info.networkfail')} />
                <br /><br />
            </Offline>
            <Online>

                <Spin spinning={!intencoes} tip={t('msg.loading.intention')}>
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
                </Spin>
                <br />
                <Divider />
                <Row>
                    <Col lg={10} md={10} sm={12} xs={24}>
                        <Search placeholder={t('label.search')} style={{ margin: '5px' }} size="small" onChange={onSearch} loading={loadingSearch} />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={24}>
                        <Radio.Group style={{ margin: '5px' }} defaultValue="all" size="small" onChange={onFilter}>
                            <Radio.Button value="all">{t('label.all')}</Radio.Button>
                            <Radio.Button value="urgent">{t('label.urgent')}</Radio.Button>
                            <Radio.Button value="prayed">{t('label.prayed')}</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <br />
                <Spin spinning={!intencoes} tip={t('msg.loading.intention')}>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 2,
                            sm: 2,
                            md: 3,
                            lg: 3,
                            xl: 4,
                            xxl: 3,
                        }}
                        locale={{
                            emptyText: <Empty description={t('msg.info.nointentions')} />
                        }}
                        dataSource={result}
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
                                    <Popover content={intencao.content} title={`${intencao.city}-${intencao.regionCode}`}>
                                        <Paragraph ellipsis={{ rows: 1 }}>{intencao.content}</Paragraph>
                                        <p style={{ color: '#666666' }}>{intencao.city}-{intencao.regionCode}, {intencao.country}</p>
                                        <small>{moment(intencao.createdAt.toDate()).fromNow()}</small>
                                    </Popover>
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