import React from 'react';
import './Global.css'
import { Link, useParams } from 'react-router-dom';
import {ParseStringToHtml} from './utils'
import { Localization, uuid } from './types'
import cn from './Localization/zhCN.json'
import en from './Localization/enGB.json'
import sound from './Localization/Sound.json'
const cnLocalization = cn as Localization;
const enLocalization = en as Localization;
const soundLocalization = sound as Localization;

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
  const uuid = (useParams().id ?? '');
  if (uuid){
    results = results.concat(MultiLanguage(uuid));
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
