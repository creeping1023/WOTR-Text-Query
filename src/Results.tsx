import React from 'react';
import './Global.css'
import { Link, useSearchParams } from 'react-router-dom';
import {ParseStringToHtml, ParsePlainText} from './utils'
import { Localization, uuid } from './types'
import cn from './Localization/zhCN.json'
import uuid2path from './Data/uuid2path.json'
const cnLocalization = cn as Localization;
const uuid2pathMap = uuid2path as Record<uuid, string>;

function Item(uuid:string, val:string, highlight:string){
  const path = uuid2pathMap[uuid];
  val = ParseStringToHtml(val, highlight);
  if (!path) return <Link to={'/string/'+uuid} className='result' key={uuid} dangerouslySetInnerHTML={{__html:val}}></Link>
  return <Link to={'/entity/'+(path||'').replaceAll('/', '~')} className='result' key={uuid} dangerouslySetInnerHTML={{__html:val}}></Link>
}

function Results() {
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get('search') || '';
  let results: [uuid,string][] = [];
  if (paramValue){
    const terms = paramValue.split(/\s+/);
    results = Object.entries(cnLocalization.strings).filter(([k,v])=>
      terms.every(term => ParsePlainText(v).includes(term))
    );
  }
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <span>共{results.length}项关于[{paramValue}]的结果</span>
        <Link to={'/'}>返回首页</Link>
        <div className='result-list'>{results.map(([k,v])=> Item(k, v, paramValue))}</div>
    </div>
  );
}

export default Results;
