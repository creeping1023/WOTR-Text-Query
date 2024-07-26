import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ParseStringToNodes, ParsePlainText, uuid2path, lang, config } from './utils'
import { Helmet } from "react-helmet-async";
function Item(id:string, val:string, highlight:string){
  const path = uuid2path[id];
  return <Link to={path ? ('/entity/'+(path||'').replaceAll('/', '~')) : ('/string/'+id)}
    data-raw={config.debug ? val : false}
    data-plain={config.debug ? ParsePlainText(val) : false}
    className='result' key={id}>
      {ParseStringToNodes(val)}
    </Link>
}

function Results() {
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get('search') || '';
  let results: [string,string][] = [];
  if (paramValue){
    const terms = paramValue.split(/\s+/);
    results = Object.entries(lang.cn as Record<string,string>).filter(([k,v])=>
      terms.every(term => ParsePlainText(v).includes(term))
    );
  }
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height: '100%',width:'100vw',padding:'0 50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>搜索结果 - {config.title}</title>
        </Helmet>
        <h2>共{results.length}项关于[{paramValue}]的结果</h2>
        <section className='result-list'>{results.map(([k,v])=> Item(k, v, paramValue))}</section>
    </div>
  );
}

export default Results;