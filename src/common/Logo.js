import React from 'react';
import { Link } from "react-router-dom";

export default function Logo() {
    return <Link to="/" 
    style={{ display: 'block', fontFamily: `'Pacifico', cursive`, textAlign: 'center', fontSize: 60, margin: '60px auto' }}>
        intercede4<span style={{ color: '#333' }}>.us</span>
    </Link>
};