import React from 'react';
import './Global.css'
import { Link, useSearchParams } from 'react-router-dom';
import { ParseStringToHtml, ParsePlainText, uuid2path, lang, config } from './utils'
import { Helmet } from "react-helmet";
function Item(id:string, val:string, highlight:string){
  const path = uuid2path[id];
  val = ParseStringToHtml(val, highlight);
  if (!path) return <Link to={'/string/'+id} className='result' key={id} dangerouslySetInnerHTML={{__html:val}}></Link>
  return <Link to={'/entity/'+(path||'').replaceAll('/', '~')} className='result' key={id} dangerouslySetInnerHTML={{__html:val}}></Link>
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
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>搜索结果 - {config.title}</title>
        </Helmet>
        <span>共{results.length}项关于[{paramValue}]的结果</span>
        <Link to={'/'}>返回首页</Link>
        <div className='result-list'>{results.map(([k,v])=> Item(k, v, paramValue))}</div>
    </div>
  );
}

export default Results;
