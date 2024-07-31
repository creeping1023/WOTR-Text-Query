import React from 'react';
import { useParams } from 'react-router-dom';
import { MultiLanguage, config } from './utils'
import { Helmet } from "react-helmet-async";

function Entity() {
  const uuid = (useParams().id ?? '');
  return (
    <div className="component-container">
        <Helmet>
          <title>{uuid} - {config.title}</title>
        </Helmet>
        {uuid && MultiLanguage(uuid)}
    </div>
  );
}

export default Entity;
