import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContainerWithTitle, MultiLanguage, GetRelationJson, path2uuid, config } from './utils'
import { Helmet } from "react-helmet-async";

function SplitedLongString(text:string){
  if (window.innerWidth <= 480){
    return <span>{text}</span>
  }
  return text.split(/(?<=\/)|(?=\/)/).map((term, i)=><span key={i}>{term}</span>);
}

function DumpRelation(relationData:Record<string, string[]>|null){
  if (!relationData) return [];
  return [['referenced', '被引用'], ['referencing', '引用']].filter(([key, title])=>relationData[key]).map(([key, title], index) =>{
    const map = {} as Record<string, string[]>;
    const list = relationData[key]
    list.filter(pair=>{
      const key = pair[0].replaceAll(/\[\d+\]/g,'[]');
      const val = pair[1];
      if (!map[key]) map[key] = [];
      map[key].push(val);
    });
    const keys = Array.from(Object.keys(map));
    keys.sort();
    const data = keys.map(key=>{return {key:key, list:map[key]};});
    return ContainerWithTitle(
      title,
      data.map((pair, i)=><p key={i}>
        <div>
          {pair.key}
        </div>
        <div>
          {pair.list.map(path => (<Link to={'/entity/'+path.replaceAll('/','~')+'.jbp'} className='break-inline'>
            {SplitedLongString(path)}
          </Link>))}
        </div>
      </p>),
      index
    );
  });
}

function Entity() {
  const path = (useParams().id ?? '');

  const [relationData, setRelationData] = useState(null as Record<string, string[]>|null);
  useEffect(() => {
    if (path) {
      GetRelationJson(path).then(data => {
        setRelationData(data);
      }).catch(e => {
        console.warn(e);
        setRelationData({});
      });
    }
  }, [path]);

  return (
    <div className="component-container">
        <Helmet>
          <title>{path.replaceAll('~', '/')} - {config.title}</title>
        </Helmet>
        {path && <h2 className='break-inline'>{SplitedLongString(path.replaceAll('~', '/').replace(/\.jbp$/, ''))}</h2>}
        {path && (path2uuid[path.replaceAll('~', '/')] ?? []).map((id, index) => MultiLanguage(id, index))}
        {path && (DumpRelation(relationData) ?? 'loading...')}
        {path && ContainerWithTitle(
          '原始数据',
          <Link to={'https://creeping1023.github.io/WOTR_BluePrint/'+path.replaceAll('~', '/').replace('.jbp', '.json')} className='break-inline' target="_blank">
            {SplitedLongString(path.replaceAll('~', '/').replace('.jbp', '.json'))}
          </Link>,
        )}
    </div>
  );
}

export default Entity;
