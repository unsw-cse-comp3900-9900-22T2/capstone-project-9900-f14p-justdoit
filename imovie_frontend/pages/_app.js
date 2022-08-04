
import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
import { getCookie } from '../util/common'
import {Container} from 'next/app'
import { ConfigProvider, message } from "antd";
import enUS from 'antd/lib/locale/en_US';
import { getUserDetail,sentRecentMovie } from "./MockData";
import { Base64 } from "js-base64";

const App = ({ Component, pageProps, cookie, router }) => {
  let _cookie = getCookie('USER_MESSAGE', cookie)
  try {
    if (!!_cookie) {
      _cookie = JSON.parse(_cookie)
    } else {
      _cookie = null
    }
  } catch (e) {
    _cookie = null
  }
  sentRecentMovie({})
  if(_cookie && _cookie.id){
    getUserDetail({
      uid : _cookie.uid
    }).then(res => {
      if(res.code === 200){
        const {username,email} = result;
        window.localStorage.setItem("USER_MESSAGE_FOR_USER",Base64.encode(JSON.stringify({
          email,username
        })));
      }
    })
  }

  return (
        <Container>

          <style>
            {`
              .ant-popover-inner-content{
                 padding: 0;
              }
              `}
          </style>
          <ConfigProvider locale={enUS}>
            <Component {...pageProps} USERMESSAGE={_cookie}/>
          </ConfigProvider>
        </Container>
  )
}
App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  let _cookie  = "";

  if(ctx && ctx.req && ctx.req.headers){
    _cookie = ctx.req.headers.cookie
  }
  return {
    pageProps: pageProps,
    cookie: _cookie
  }
}
export default App
