import React from 'react';
import { Link } from "react-router-dom";

export default function Logo() {
    return <Link to="/" style={{ display: 'block', fontFamily: `'Righteous', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
        no.<span style={{ color: '#333' }}>studio</span>
    </Link>
};