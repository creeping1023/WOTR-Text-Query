import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { config } from "./utils";
import { useSharedState } from './SharedStateContext';

function Home() {
  const navigate = useNavigate();
  const { sharedState, setSharedState } = useSharedState();
  const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setSharedState(prev=>({
        ...prev,
        search: e.target.value
    }));
  }
  const submit = () => {
    if (!sharedState.search) return;
    const newParams = new URLSearchParams('');
    newParams.set('search', sharedState.search.replace(/\s+/, ' '));
    navigate(`/results?${newParams.toString()}`);
  }
  const handleKeyPress = (e: React.KeyboardEvent ) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey){
      e.preventDefault();
      submit();
    }
  }
  return (
    <div className="component-container">
        <Helmet>
          <title>{config.title}</title>
        </Helmet>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex: 1, gap: 10}}>
          <Input.TextArea placeholder="input search text" defaultValue={sharedState.search} onChange={handleChange} onKeyDown={handleKeyPress} allowClear autoFocus
            size="large" autoSize={{ minRows: 1, maxRows: 6 }} style={{maxWidth:'800px'}} />
          <Button type="primary" icon={<SearchOutlined />} onClick={submit} disabled={!sharedState.search}>查找</Button>
        </div>
    </div>
  );
}

export default Home;
