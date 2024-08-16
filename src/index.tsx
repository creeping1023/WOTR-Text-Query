import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SharedStateProvider } from "./SharedStateContext";
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from "react-helmet-async";
import { ConfigProvider, ThemeConfig } from "antd";
import Main from './Main';

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
let main = <Main />
main = <ConfigProvider theme={themeConfig}>{main}</ConfigProvider>
main = <SharedStateProvider>{main}</SharedStateProvider>;
main = <HelmetProvider>{main}</HelmetProvider>;
main = <BrowserRouter basename={process.env.PUBLIC_URL}>{main}</BrowserRouter>;
main = <React.StrictMode>{main}</React.StrictMode>;
root.render(main);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);