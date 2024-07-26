import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiLanguage, config } from './utils'
import { Helmet } from "react-helmet-async";

function Entity() {
  const uuid = (useParams().id ?? '');
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height: '100%',width:'100vw',padding:'0 50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>{uuid} - {config.title}</title>
        </Helmet>
        {uuid && MultiLanguage(uuid)}
    </div>
  );
}

export default Entity;
