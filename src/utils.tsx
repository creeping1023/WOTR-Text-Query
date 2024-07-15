import cn from './Localization/zhCN.json'
import en from './Localization/enGB.json'
import sound from './Localization/Sound.json'
import path2uuidRaw from './Data/path2uuid.json';
import uuid2pathRaw from './Data/uuid2path.json'

export type uuid = string;
export type Localization = {
    strings: Record<uuid, string | undefined>
}

export const lang: Record<string, Record<string, string | undefined> | undefined> = {
  cn: (cn as Localization).strings,
  en: (en as Localization).strings,
  sound: (sound as Localization).strings,
}
export const uuid2path = uuid2pathRaw as Record<uuid, string | undefined>;
export const path2uuid = path2uuidRaw as Record<string, uuid[] | undefined>;

/**
 * 转换为HTML格式
 */
export function ParseStringToHtml(val:string, highlight?:string){
    val = val
      .replaceAll(/\{g\|([^}]+)\}(.*?)\{\/g\}/g, '<span class="g" title="$1">$2</span>')
      .replaceAll(/\{d\|([^}]+)\}(.*?)\{\/d\}/g, '<span class="d" title="$1">$2</span>')
      .replaceAll(/\{n\}(.*?)\{\/n\}/g, '<span class="n">$1</span>')
    /*if (highlight){
      val = val.replace(highlight, '<strong>'+highlight+'</strong>');
    }*/
    return val;
}

/**
 * 去除特殊标记，用于查找
 */
export function ParsePlainText(val:string){
  return val
    .replaceAll(/\{(?<tag>[a-z])(?:\|[a-zA-Z0-9:_]+)?\}(?<content>.*?)\{\/\k<tag>\}/g, '$<content>')
    .replaceAll(/<(?<tag>[a-z])>(?<content>.*?)<\/\k<tag>>/g, '$<content>')
    .replaceAll('\\n', '');
}

export function GetAudioUrl(id:uuid){
  const name = lang.sound![id];
  if (name) return (<audio controls>
    <source src={'https://creeping1023.github.io/WOTR-Dialogues-Audio/dest/' + name + '.aac'} type="audio/aac" />
    Your browser does not support the audio element.
  </audio>)
}