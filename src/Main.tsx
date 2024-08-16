import React from 'react';
import Home from './Home';
import Results from './Results';
import Entity from './Entity';
import String from './String';
import SearchOnTop from './SearchOnTop'
import { Link, Route, Routes } from 'react-router-dom';
import { FloatButton, Layout, Button, Tooltip } from "antd";
import { ArrowUpOutlined, GithubOutlined, HomeOutlined } from '@ant-design/icons';

export default function Main(){
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header style={{display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 1px 2px 0 rgba(128, 128, 128, 0.06),0 1px 6px -1px rgba(128, 128, 128, 0.04),0 2px 4px 0 rgba(128, 128, 128, 0.04)'}}>
        <Tooltip placement="bottom" title="Home">
          <Link to={'/'} className='ant-btn ant-btn-circle ant-btn-default ant-btn-icon-only'><HomeOutlined /></Link>
        </Tooltip>
        <div style={{flexGrow:1, display: 'flex'}} >
          <SearchOnTop style={{maxWidth:'500px'}} />
        </div>
        <Tooltip placement="bottom" title={<div style={{display:'flex', flexDirection:'column', alignItems: 'center'}}><div>Github</div><div>给孩子点个star吧</div></div>}>
          <Button shape="circle" icon={<GithubOutlined />} href="https://github.com/creeping1023/WOTR-Text-Query" target='_blank'/>
        </Tooltip>
      </Layout.Header>
      <Layout.Content style={{ overflow: 'auto' }} id="main-content">
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/results' element={<Results/>}></Route>
          <Route path='/entity/:id' element={<Entity/>}></Route>
          <Route path='/string/:id' element={<String/>}></Route>
        </Routes>
        <FloatButton.BackTop target={()=>document.getElementById("main-content")!} visibilityHeight={window.innerHeight/2} duration={450} icon={<ArrowUpOutlined />} />
      </Layout.Content>
    </Layout>
  );
}