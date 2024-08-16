import React, { Suspense, useRef, useCallback, useLayoutEffect, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ParseStringToNodes, ParsePlainText, uuid2path, lang, config } from './utils';
import { Helmet } from "react-helmet-async";
import { VariableSizeList } from 'react-window';

type ItemProps = {
  id: string;
  val: string;
};

const Item: React.FC<ItemProps> = React.memo(({ id, val }) => {
  const path = uuid2path[id];

  return (
    <Link 
      to={path ? (`/entity/${(path || '').replaceAll('/', '~')}`) : (`/string/${id}`)}
      data-raw={config.debug ? val : undefined}
      data-plain={config.debug ? ParsePlainText(val) : undefined}
      className='result'
    >
      {ParseStringToNodes(val)}
    </Link>
  );
});

type MeasureItemProps = ItemProps & {
  onHeightMeasured: (id: string, height: number) => void;
};

const MeasureItem: React.FC<MeasureItemProps> = ({ id, val, onHeightMeasured }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      onHeightMeasured(id, height);
    }
  }, [id, val, onHeightMeasured]);

  return (
    <div ref={ref} style={{ position: 'absolute', visibility: 'hidden', width: '100%' }}>
      <Item id={id} val={val} />
    </div>
  );
};

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get('search') || '';

  const results: [string, string][] = React.useMemo(() => {
    if (!paramValue) return [];
    const searchTerms = paramValue.split(/\s+/);
    return Object.entries(lang.cn as Record<string, string>).filter(([k, v]) =>
      searchTerms.every(term => ParsePlainText(v).includes(term))
    );
  }, [paramValue]);

  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});
  const [listHeight, setListHeight] = useState<number>(window.innerHeight / 2); // VariableSizeList的高度与section绑定

  const listRef = useRef<VariableSizeList>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const setHeight = useCallback((id: string, height: number) => {
    setItemHeights(prev => ({
      ...prev,
      [id]: height,
    }));

    // Force the list to recompute item sizes
    if (listRef.current) {
      const index = results.findIndex(([itemId]) => itemId === id);
      listRef.current.resetAfterIndex(index);
    }
  }, [results]);

  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const [id, val] = results[index];
    return itemHeights[id]
      ? <div style={style}><Item id={id} val={val} /></div> // 已确定高度时直接通过style设置高度
      : <MeasureItem id={id} val={val} onHeightMeasured={setHeight} />; // 首次渲染时测量其高度
  };

  const getItemSize = useCallback((index: number) => {
    const [id] = results[index];
    return itemHeights[id] || 100;
  }, [results, itemHeights]);

  // 窗口大小变化时重新计算列表尺寸
  useEffect(() => {
    let listHeight = sectionRef.current?.clientHeight || 0;
    let listWidth = sectionRef.current?.clientWidth || 0;

    const handleResize = function(force:boolean = false){
      if (sectionRef.current) {
        const newHeight = sectionRef.current.clientHeight;
        const newWidth = sectionRef.current.clientWidth;

        if (force || newHeight !== listHeight) {
          setListHeight(newHeight);
          listHeight = newHeight;
        }
  
        if (force || newWidth !== listWidth) {
          setItemHeights({});
          listWidth = newWidth;
        }
      }
    }; 
    
    handleResize(true);
    const binded = handleResize.bind(null, false);
    window.addEventListener('resize', binded);
    return () => window.removeEventListener('resize', binded);
  }, []);

  return (
    <div className="component-container">
      <Helmet>
        <title>搜索结果 - {config.title}</title>
      </Helmet>
      <h2>共{results.length}项关于[{paramValue}]的结果</h2>
      <section ref={sectionRef} className='result-list' style={{flex: 1}}>
        <Suspense fallback={<div>Loading...</div>}>
          <VariableSizeList
            ref={listRef}
            height={listHeight}
            itemCount={results.length}
            itemSize={getItemSize}
            width={'100%'}
          >
            {Row}
          </VariableSizeList>
        </Suspense>
      </section>
    </div>
  );
}

export default Results;
