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