import React, { useState } from 'react';
import './Global.css';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { config } from "./utils";
const { TextArea } = Input;

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');;
  const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }
  const submit = () => {
    if (!inputValue) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('search', inputValue.replace(/\s+/, ' '));
    navigate(`/results?${newParams.toString()}`);
  }
  const handleKeyPress = (e: React.KeyboardEvent ) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey){
      e.preventDefault();
      submit();
    }
  }
  return (
    <div style={{
      display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:'10px',
      height:'100vh',width:'100vw',padding:'50px',boxSizing:'border-box'}}>
        <Helmet>
          <title>{config.title}</title>
        </Helmet>
        <TextArea placeholder="input search text" allowClear onChange={handleChange} onKeyDown={handleKeyPress} autoFocus
          size="large" autoSize={{ minRows: 1, maxRows: 6 }} style={{maxWidth:'800px'}} />
        <Button type="primary" icon={<SearchOutlined />} onClick={submit} disabled={!inputValue}>查找</Button>
    </div>
  );
}

export default Home;
