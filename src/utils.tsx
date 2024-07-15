import cn from './Localization/zhCN.json';
import en from './Localization/enGB.json';
import sound from './Localization/Sound.json';
import path2uuidRaw from './Data/path2uuid.json';
import uuid2pathRaw from './Data/uuid2path.json';
import soundSwitchRaw from "./Data/sound_switch.json";

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

function recursiveReplace(s:string, pattern:RegExp, repl:string):string{
  if (!pattern.test(s)) return s;
  s = s.replaceAll(pattern, repl);
  return recursiveReplace(s, pattern, repl);
}

/**
 * 转换为HTML格式
 */
export function ParseStringToHtml(s:string){
  s = recursiveReplace(s, /\{g\|([^}]+)\}(.*?)\{\/g\}/g, '<span class="g" title="$1">$2</span>');
  s = recursiveReplace(s, /\{d\|([^}]+)\}(.*?)\{\/d\}/g, '<span class="d" title="$1">$2</span>');
  s = recursiveReplace(s, /\{n\}(.*?)\{\/n\}/g, '<span class="n">$1</span>');
  return s;
}

/**
 * 去除特殊标记，用于查找
 */
export function ParsePlainText(s:string){
  s = s.replaceAll('\n', '');
  s = recursiveReplace(s, /\{(?<tag>[a-z])(?:\|[a-zA-Z0-9:_ ]+)?\}(?<content>.*?)\{\/\k<tag>\}/g, '$<content>');
  s = recursiveReplace(s, /<(?<tag>[a-z])>(?<content>.*?)<\/\k<tag>>/g, '$<content>');
  return s;
}

function AudioNameToComponent(name:string){
  return (<p className='audio-container'>
    <span>{name}</span>
    <audio controls>
      <source src={'https://creeping1023.github.io/WOTR-Dialogues-Audio/dest/' + name + '.aac'} type="audio/aac" />
      Your browser does not support the audio element.
    </audio>
  </p>);
}

export function GetAudios(id:uuid){
  const eventName = lang.sound![id];
  if (eventName) {
    const names = soundSwitch[eventName] ?? [eventName];
    return names.map(AudioNameToComponent);
  }
  return [];
}