import React from 'react';
import './Global.css'
import { Link, useParams } from 'react-router-dom';
import { GetAudioUrl, ParseStringToHtml, lang, path2uuid, config } from './utils'
import { Helmet } from "react-helmet";

function Item(val:string){
  return <p dangerouslySetInnerHTML={{__html:ParseStringToHtml(val || '')}}></p>;
}
function MultiLanguage(id:string){
  const list: JSX.Element[] = [];
  list.push(Item(id));
  if (lang.cn![id]) list.push(Item(lang.cn![id]!));
  if (lang.en![id]) list.push(Item(lang.en![id]!));
  if (lang.sound![id]) list.push(GetAudioUrl(id)!);
  return list;
}

function Entity() {
  let results: JSX.Element[] = [];
  const path = (useParams().id ?? '').replaceAll('~', '/');
  if (path){
    results.push(<p className='break-inline'>{path.split(/(?<=\/)|(?=\/)/).map(term=><span>{term}</span>)}</p>);
    const idList = path2uuid[path] ?? [];
    idList.forEach(id => {
      results = results.concat(MultiLanguage(id));
    });
  }
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>{path} - {config.title}</title>
        </Helmet>
        <Link to={'/'}>返回首页</Link>
        {results}
    </div>
  );
}

export default Entity;
