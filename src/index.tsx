import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import Results from './Results';
import Entity from './Entity';
import String from './String';
import SearchOnTop from './SearchOnTop'
import { SharedStateProvider } from "./SharedStateContext";
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from "react-helmet-async";
import { FloatButton, Layout, Button, Tooltip, ConfigProvider, theme, ThemeConfig } from "antd";
import { ArrowUpOutlined, GithubOutlined, HomeOutlined } from '@ant-design/icons';

const themeConfig:ThemeConfig = {
  hashed: false,
  token: {
    colorText: '#000',
    fontSize: 22,
    fontSizeXL: 30,
    fontFamily: `华文中宋, Times, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif`
  },
  components: {
    Layout: {
      headerBg: '#f5f5f5',
    }
  }
};
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
let main = (
  <ConfigProvider theme={themeConfig}>
    <Layout style={{ height: '100vh' }}>
      <Layout.Header style={{display:'flex', alignItems:'center', gap:'10px', boxShadow:'0 1px 2px 0 rgba(128, 128, 128, 0.06),0 1px 6px -1px rgba(128, 128, 128, 0.04),0 2px 4px 0 rgba(128, 128, 128, 0.04)'}}>
        <Tooltip placement="bottom" title="Home">
          <Link to={'/'} className='ant-btn ant-btn-circle ant-btn-default ant-btn-icon-only'><HomeOutlined /></Link>
        </Tooltip>
        <div style={{flexGrow:1, display: 'flex'}} >
          <SearchOnTop style={{maxWidth:'500px'}} />
        </div>
        <Tooltip placement="bottom" title="Github">
          <Button shape="circle" icon={<GithubOutlined />} href="https://github.com/creeping1023/WOTR-Text-Query" target='_blank'/>
        </Tooltip>
      </Layout.Header>
      <Layout.Content style={{ overflowY: 'scroll',  overflowX: 'hidden' }} id="main-content">
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/results' element={<Results/>}></Route>
          <Route path='/entity/:id' element={<Entity/>}></Route>
          <Route path='/string/:id' element={<String/>}></Route>
        </Routes>
        <FloatButton.BackTop target={()=>document.getElementById("main-content")!} visibilityHeight={window.innerHeight/2} duration={450} icon={<ArrowUpOutlined />} />
      </Layout.Content>
    </Layout>
  </ConfigProvider>
);
main = <SharedStateProvider>{main}</SharedStateProvider>;
main = <HelmetProvider>{main}</HelmetProvider>;
main = <Router basename={process.env.PUBLIC_URL}>{main}</Router>;
main = <React.StrictMode>{main}</React.StrictMode>;
root.render(main);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
