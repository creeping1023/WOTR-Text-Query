import cn from './Localization/zhCN.json';
import en from './Localization/enGB.json';
import sound from './Localization/Sound.json';
import path2uuidRaw from './Data/path2uuid.json';
import uuid2pathRaw from './Data/uuid2path.json';
import soundSwitchRaw from "./Data/sound_switch.json";

import { Tooltip } from "antd";
import React from 'react';

export type uuid = string;
export type Localization = {
    strings: Record<uuid, string | undefined>
};

export const lang: Record<string, Record<string, string | undefined> | undefined> = {
  cn: (cn as Localization).strings,
  en: (en as Localization).strings,
  sound: (sound as Localization).strings,
}
export const uuid2path = uuid2pathRaw as Record<uuid, string | undefined>;
export const path2uuid = path2uuidRaw as Record<string, uuid[] | undefined>;
const soundSwitch = soundSwitchRaw as Record<string, uuid[] | undefined>;

export const config = {
  title: '正义之怒文本查询',
  debug: process.env.NODE_ENV === "development",
};

interface ParseTerm{
  tag?: string,
  param?: string,
  content: string,
  index: number,
}

/**
 * {a|bcd}123{/a} || {a}123{/a} || <b>123</b> || {br}
 */
const regex = /(?:\{(?<tag>[a-z])(?:\|(?<param>[a-zA-Z0-9:_ ]+))?\}(?<content>.*?)\{\/\k<tag>\})|(?:<(?<tag>[a-z])>(?<content>.*?)<\/\k<tag>>)|(?:\{(?<tag>br)\})/g;

export function ParseString(s:string):ParseTerm[]{
  s = s.replaceAll('\n', '');
  let lastIndex = 0;
  let match = null;
  let count = 0;
  const result = [];
  while((match = regex.exec(s)) !== null){
    if (match.index > lastIndex){
      result.push({
        content: s.slice(lastIndex, match.index),
        index: count,
      });
      count += 1;
    }
    result.push({
      tag: match.groups?.tag!,
      param: match.groups?.param,
      content: match.groups?.content ?? '',
      index: count,
    });
    count += 1;
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < s.length) result.push({
    content: s.slice(lastIndex),
    index: count,
  });
  return result;
}

export function ParseStringToNodes(s:string):React.ReactNode[]{
  return ParseString(s).map((term)=>{
    if (!term.tag){
      return <React.Fragment key={term.index}>{term.content}</React.Fragment>;
    }
    else if(term.tag === 'br'){
      return <React.Fragment key={term.index}><br /></React.Fragment>;
    }
    else if(term.param){
      return  <React.Fragment key={term.index}>
        <Tooltip title={term.param}>
          <span className={term.tag}>
            {ParseStringToNodes(term.content)}
          </span>
        </Tooltip>
      </React.Fragment>;
    }
    else{
      return <React.Fragment key={term.index}>
        <span className={term.tag}>
          {ParseStringToNodes(term.content)}
        </span>
      </React.Fragment>;
    }
  });
}

export function ParsePlainText(s:string){
  return ParseString(s).map(term=>term.content).join(''); // 89ms
  // return s.replaceAll(regex, '$<content>'); // 75ms
}

export function GetAudios(id:uuid){
  const eventName = lang.sound![id];
  if (eventName) {
    const names = soundSwitch[eventName] ?? [eventName];
    // 这里的key必须是唯一的，以避免页面切换时音频不更新
    return names.map((name, index) => <p className='audio-container' key={name}>
      <span>{name}</span>
      <audio controls>
        <source src={'https://creeping1023.github.io/WOTR-Dialogues-Audio/dest/' + name + '.aac'} type="audio/aac" />
        Your browser does not support the audio element.
      </audio>
    </p>);
  }
  return [];
}

export async function GetRelationJson(path:string){
  if (!path) return null;
  const url = 'https://creeping1023.github.io/WOTR-BluePrint-Relation/data/' + path.replace(/\.jbp$/, '.json');
  return (await fetch(url)).json();
}


export function Item(val:string, key?:React.Key){
  return <p key={key}>{ParseStringToNodes(val)}</p>;
}

export function ContainerWithTitle(title:React.ReactNode, items:React.ReactNode, key?:React.Key){
  return <article className='flex-column' key={key}>
    <h3>{title}</h3>
    <div className='flex-column'>{items}</div>
  </article>
}

export function MultiLanguage(id:string, key?:React.Key){
  const list: JSX.Element[] = [];
  if (lang.cn![id]) list.push(Item(lang.cn![id]!, -1));
  if (lang.en![id]) list.push(Item(lang.en![id]!, -2));
  if (lang.sound![id]) GetAudios(id).forEach(o => list.push(o));
  return ContainerWithTitle(
    Item(id),
    list,
    key
  );
}