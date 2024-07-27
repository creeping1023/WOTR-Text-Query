import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContainerWithTitle, MultiLanguage, GetRelationJson, path2uuid, config } from './utils'
import { Helmet } from "react-helmet-async";

function SplitedLongString(text:string){
  return text.split(/(?<=\/)|(?=\/)/).map((term, i)=><span key={i}>{term}</span>);
}

function DumpRelation(relationData:Record<string, string[]>|null){
  if (!relationData) return [];
  return [['parents', '被引用'], ['children', '引用']].filter(([key, title])=>relationData[key]).map(([key, title], index) =>{
    const list = relationData[key];
    list.sort();
    return ContainerWithTitle(
      title,
      list.map((path, i)=><p key={i}>
        <Link to={'/entity/'+path.replaceAll('/','~')+'.jbp'} className='break-inline'>
          {SplitedLongString(path.replaceAll('~', '/'))}
        </Link>
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
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height: '100%',width:'100vw',padding:'0 50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>{path.replaceAll('~', '/')} - {config.title}</title>
        </Helmet>
        {path && <h2 className='break-inline'>{SplitedLongString(path.replaceAll('~', '/').replace(/\.jbp$/, ''))}</h2>}
        {path && (path2uuid[path.replaceAll('~', '/')] ?? []).map((id, index) => MultiLanguage(id, index))}
        {path ? DumpRelation(relationData) : 'loading...'}
    </div>
  );
}

export default Entity;
