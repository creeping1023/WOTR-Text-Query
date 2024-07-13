import React from 'react';
import './Global.css'
import { Link, useParams } from 'react-router-dom';
import {ParseStringToHtml} from './utils'
import { Localization, uuid } from './types'
import cn from './Localization/zhCN.json'
import en from './Localization/enGB.json'
import sound from './Localization/Sound.json'
import path2uuid from './Data/path2uuid.json';
const cnLocalization = cn as Localization;
const enLocalization = en as Localization;
const soundLocalization = sound as Localization;
const path2uuidMap = path2uuid as Record<string, uuid[]>;

function Item(val:string){
  return <p dangerouslySetInnerHTML={{__html:ParseStringToHtml(val || '')}}></p>;
}
function MultiLanguage(id:uuid){
  const list: JSX.Element[] = [];
  list.push(Item(id));
  if (cnLocalization.strings[id]) list.push(Item(cnLocalization.strings[id]));
  if (enLocalization.strings[id]) list.push(Item(enLocalization.strings[id]));
  if (soundLocalization.strings[id]) list.push(Item(soundLocalization.strings[id]));
  return list;
}

function Entity() {
  let results: JSX.Element[] = [];
  const path = (useParams().id ?? '').replaceAll('~', '/');
  if (path){
    results.push(Item(path));
    const idList = path2uuidMap[path] || [];
    idList.forEach(id => {
      results = results.concat(MultiLanguage(id));
    });
  }
  return (
    <div style={{
      display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <Link to={'/'}>返回首页</Link>
        {results}
    </div>
  );
}

export default Entity;
