import React from 'react';
import { Input } from 'antd';
import { useNavigate, useSearchParams, useMatch } from 'react-router-dom';
import type { InputProps } from 'antd/es/input';
import { useSharedState } from './SharedStateContext';

interface SearchProps extends InputProps {
  // You can add any additional props specific to your Search component here
}

const Search: React.FC<SearchProps> = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sharedState, setSharedState } = useSharedState();
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSharedState(prev=>({
        ...prev,
        search: e.target.value
    }));
  }
  const submit = (text:string) => {
    if (!text) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('search', text.replace(/\s+/, ' '));
    navigate(`/results?${newParams.toString()}`);
  }
  // fontSize > 22px 时，input 和 search icon 会无法对齐
  return (
    !useMatch('/') 
        ? <Input.Search placeholder="input search text" defaultValue={sharedState.search} 
            onChange={handleChange} onSearch={submit} allowClear enterButton {...props} /> 
        : null
  );
}

export default Search;
