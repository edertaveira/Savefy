import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Spin, Typography, Tooltip, List, Empty, Comment, Alert, Badge } from 'antd';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase'
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import momentPTBR from '../constants/momentPTBR';
import moment from 'moment';
import { FaPray, FaCross } from 'react-icons/fa'
import ModalRastrear from './ModalRastrear';
import ModalTestemunho from './ModalTestemunho';
import Logo from '../common/Logo';
import { useTranslation, Trans } from 'react-i18next';
const { Text } = Typography;


function Intencao(props) {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [visibleTestemunho, setVisibleTestemunho] = useState(false);
    const { t, i18n } = useTranslation();

    const parsed = queryString.parse(location.search);
    useFirestoreConnect([{ collection: 'intencoes', where: ['code', '==', parsed.code] }])
    const intencoes = useSelector(state => state.firestore.ordered.intencoes && state.firestore.ordered.intencoes);

    useEffect(() => {
        if (localStorage.getItem('language') !== 'en') {
            moment.locale(localStorage.getItem('language'), momentPTBR);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            i18n.changeLanguage(localStorage.getItem('language'));
        } else {
            moment.locale('en');
        }
    }, []);

    const getComentarios = () => {
        if (intencoes && intencoes.length > 0) {
            const comentarios = intencoes[0].comentarios.map(item => {
                return {
                    author: item.name,
                    content: <p>{item.content}</p>,
                    datetime: (<Tooltip title={moment(item.createdAt).format(t('dateformat'))}>
                        <span>{moment(item.createdAt).fromNow()}</span>
                    </Tooltip>),
                }
            });
            return comentarios;
        }
        return [];
    }

    const abrirModalRastrarIntencao = () => {
        setVisible(true);
    }

    const abrirModalTestemunho = () => {
        setVisibleTestemunho(true);
    }

    return (
        <Row type="flex" justify="center" align="top">
            <Col lg={18} md={18} sm={20} xs={20}>
                <Logo />


                <Spin spinning={!intencoes} tip={t('msg.searching')}>
                    {intencoes && intencoes.length > 0 && <>
                        <Text> {t('text.intention')} </Text>
                        <br />
                        <Text strong>{t('text.godbless')} </Text>
                        <br />
                        <br />

                        <Alert type="info" message={t('text.saveyourcode')} />

                        <Row gutter={16}>
                            <Col lg={12} md={12} sm={12} xs={24}>
                                <br />
                                <Card title={t('label.prayercode')}>
                                    <Text copyable>{intencoes[0].code}</Text>
                                </Card>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={24}>
                                <br />
                                <Card title={t('label.numberprayer')} >
                                    <FaPray size="16" />
                                    <Badge count={intencoes[0].oracoes.length} />
                                </Card>
                            </Col>
                        </Row>

                        <br />
                        {intencoes[0].testemunho
                            ? <Card title={<span><FaCross /> {t('label.testimonial')}</span>}>
                                <p>{intencoes[0].testemunho.content}</p>
                                <small>{moment(intencoes[0].testemunho.createdAt).fromNow()}</small>
                            </Card>
                            : <div style={{ textAlign: 'center' }}><Button onClick={() => abrirModalTestemunho()} ><FaCross /> {t('label.addtestimonial')}</Button></div>}

                        {<List
                            className="comment-list"
                            header={`${getComentarios().length} ${t('label.messages')}`}
                            itemLayout="horizontal"
                            dataSource={getComentarios()}
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
                        />}
                    </>}
                    {intencoes && intencoes.length === 0 && <div style={{ textAlign: 'center' }}>
                        <br /><br />
                        <Alert type="warning" message={`${t('msg.messagerequired')} ${parsed.code}`} />
                        <br /><br />
                        <Button onClick={() => abrirModalRastrarIntencao()} style={{ color: '#a25050' }} type="link"><FaPray /> Rastrear outra Intenção</Button>
                    </div>}
                </Spin>
                <ModalRastrear visible={visible} setVisible={setVisible} />
                <ModalTestemunho visible={visibleTestemunho} intencao={intencoes && intencoes[0]} setVisible={setVisibleTestemunho} />
            </Col>
        </Row>
    );
}

export default Intencao;