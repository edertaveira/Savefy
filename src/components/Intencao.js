import React, { useState, useEffect } from 'react';
import { Form, Icon, Input, Button, Card, Row, Col, Spin, Typography, Tooltip, Divider, List, Empty, Comment, Alert, Badge } from 'antd';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import { useFirestore, useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { Link, useLocation } from "react-router-dom";
import queryString from 'query-string';
import momentPTBR from '../constants/momentPTBR';
import moment from 'moment';
import { FaPray, FaCross } from 'react-icons/fa'
import ModalRastrear from './ModalRastrear';
import ModalTestemunho from './ModalTestemunho';
const { Text, Title } = Typography;


function Intencao(props) {
    const firestore = useFirestore();
    const location = useLocation();
    const [iconLoading, setIconLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleTestemunho, setVisibleTestemunho] = useState(false);
    const [elem, setElem] = useState({});

    const parsed = queryString.parse(location.search);
    useFirestoreConnect([{ collection: 'intencoes', where: ['code', '==', parsed.code] }])
    const intencoes = useSelector(state => state.firestore.ordered.intencoes && state.firestore.ordered.intencoes);
    moment.locale('pt-BR', momentPTBR);

    const getComentarios = () => {
        if (intencoes && intencoes.length > 0) {
            const comentarios = intencoes[0].comentarios.map(item => {
                return {
                    author: item.name,
                    content: <p>{item.content}</p>,
                    datetime: (<Tooltip title={moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
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
        <Row>
            <Col span={12} offset={6}>
                <Link to="/" style={{ display: 'block', fontFamily: `'Beth Ellen', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
                    Anjo<span style={{ color: '#b7b7b7' }}>bom</span>
                </Link>


                <Spin spinning={!intencoes} tip="Buscando Intenção...">
                    {intencoes && intencoes.length > 0 && <>
                        <Text>
                            Aqui você acompanha o andamento da sua oração,
                            quantas intercessores rezaram por você e se há alguma palavra para você.
                        </Text>
                        <br />
                        <Text strong>Deus o abençoe!</Text>
                        <br />
                        <br />

                        <Alert type="info" message={`Guarde o Código da sua Intenção (${intencoes[0].code}) para você rastrear mais tarde.`} />
                        <br />
                        <br />

                        <Row gutter={16}>
                            <Col span={12}>
                                <Card title="Código da Intenção">
                                    <Text copyable>{intencoes[0].code}</Text>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Número de Intercessores" >
                                    <FaPray size="16" />
                                    <Badge count={intencoes[0].oracoes.length} />
                                </Card>
                            </Col>
                        </Row>

                        <br />
                        {intencoes[0].testemunho
                            ? <Card title={<span><FaCross /> Testemunho</span>}>
                                <p>{intencoes[0].testemunho.content}</p>
                                <small>{moment(intencoes[0].createdAt.toDate()).fromNow()}</small>
                            </Card>
                            : <div style={{ textAlign: 'center' }}><Button onClick={() => abrirModalTestemunho()} ><FaCross />Adicionar Testemunho</Button></div>}

                        {<List
                            className="comment-list"
                            header={`${getComentarios().length} mensagens`}
                            itemLayout="horizontal"
                            dataSource={getComentarios()}
                            locale={{
                                emptyText: <Empty description="Nenhuma mensagem" />
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
                        <Alert type="warning" message={`A intenção de código ${parsed.code} não existe.`} />
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