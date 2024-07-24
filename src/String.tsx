import React from 'react';
import './Global.css'
import { Link, useParams } from 'react-router-dom';
import { MultiLanguage, config } from './utils'
import { Helmet } from "react-helmet-async";

function Entity() {
  const uuid = (useParams().id ?? '');
  return (
    <main style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>{uuid} - {config.title}</title>
        </Helmet>
        <Link to={'/'}>返回首页</Link>
        {uuid && MultiLanguage(uuid)}
    </main>
  );
}

export default Entity;
