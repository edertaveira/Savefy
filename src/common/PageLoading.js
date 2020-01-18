import React from 'react';
import { Spin } from 'antd';

const PageLoading = ({isLoading, error}) => {
    if(isLoading) {
        const style = {
            textAlign: 'center',
            marginBottom: '20px',
            padding: '60px 60px',
            margin: '20px 0'
        }

        return  <div style={style}><Spin /></div>;
    }
    else if(error) {
        return <div>Erro ao carregar esta página.</div>;
    }

    return null;
}

export default PageLoading;