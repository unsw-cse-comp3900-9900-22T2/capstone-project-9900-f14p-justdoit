import { withRouter } from 'next/router'
import { useState, useImperativeHandle, useEffect, useRef, useReducer } from 'react'
import React from 'react'
import basePageStyle from "./basePage.less"
import {Select,Avatar,Popover} from "antd";
const { Option } = Select;
import { SearchOutlined,UserOutlined} from "@ant-design/icons";
import DocunceSelectComponent from "../components/DounceSelect"
import LoginComponent from "../components/Login"
import RegesterComponent from "../components/Regester"
import ResetPasswordComponent from "../components/ResetPassword"
import { delCookie } from "../util/common";
import { Base64 } from "js-base64";

const Page = ({ router, children,USERMESSAGE }) => {
  const [body, changeBody] = useState(children);
  const [tabList] = useState([{
    value : 2,
    name : "LOGIN",
    login : false,
  },{
    value : 3,
    name : "REGISTER",
    login : false,
  },{
    value : 1,
    name : "HOME",
    href : "/movie/home",
    login : true,
  },
  //   {
  //   value : 4,
  //   name : "MOVIE LISTS",
  //   href : "/movie/list",
  //   login : true,
  // },
    {
    value : 5,
    name : "BROWSE BY",
    href : "/movie/browseBy",
    login : true,
  }]);
// const reducer=useReducer()
  const [userTabList,changeUserTabList] = useState([])
  const [enterTab , changeEnterTab] = useState("");
  const [chooseTab,changeChooseTab] = useState("");
  const loginRef=useRef();
  const regesterRef=useRef();
  const resetPasswordRef=useRef();
  const [scrollTop,changeScrollTop] = useState(0);
  const [searchValue,changeSearchValue] = useState("")
  if (body !== children) {
    changeBody(children)
  }
  useEffect(()=>{
    const pathname = window.location.pathname;
    for(let i = 0 ; i < tabList.length ; i++){
      const {value,href} = tabList[i];
      if(href === pathname){
        changeChooseTab(value);
        break;
      }
    }
    if(!!USERMESSAGE){
      const USER_MESSAGE_FOR_USER = window.localStorage.getItem("USER_MESSAGE_FOR_USER");
      let msg = Base64.decode(USER_MESSAGE_FOR_USER);
      try{
        msg = JSON.parse(msg);
      }catch (e) {
        msg = null
      }
      let MSGList = [];
      if(!!msg){
        MSGList = [{
          key : 1,
          value : msg.username,
          onHref : true
        },{
          key : 2,
          value : msg.email,
          hasBorder : true,
          onHref : true
        }]
      }
      changeUserTabList([...MSGList,...[{
        key : 3,
        value : "Profile",
        hasBorder : false,
        href : "/movie/userMsg"
      },
      //   {
      //   key : 4,
      //   value : "history",
      //   hasBorder : false,
      //   href : "/movie/userMsg?activeKey=4&nouser=1"
      // },
        {
        key : 5,
        value : "Wishlist",
        hasBorder : false,
        href : "/movie/userMsg?activeKey=1&nouser=1"
      },
        {
        key : 6,
        value : "Watched",
        hasBorder : false,
        href : "/movie/userMsg?activeKey=2&nouser=1"
      },
      // {
      //   key : 7,
      //   value : "movie lists",
      //   hasBorder : false,
      //   href : "/movie/userMsg?activeKey=3&nouser=1"
      // },{
      //   key : 8,
      //   value : "reviews",
      //   hasBorder : false,
      //   href : "/movie/userMsg?activeKey=5&nouser=1"
      // },{
      //   key : 9,
      //   value : "likes",
      //   hasBorder : false,
      //   href : "/movie/userMsg?activeKey=6&nouser=1"
      // },{
      //   key : 10,
      //   value : "disLikes",
      //   hasBorder : true,
      //   href : "/movie/userMsg?activeKey=7&nouser=1"
      // },
        {
        key : 11,
        value : "Sigh Out",
        hasBorder : false
      }]])
    }

  },[]);
  function tabClick(item) {
    if(!!item.href){
       window.location.href = item.href
    }else{
       if(item.value === 2){
         loginRef && loginRef.current && loginRef.current.changeVisible(true);
       }else if(item.value === 3){
         regesterRef && regesterRef.current && regesterRef.current.changeVisible(true);
       }
    }
  }
  function userTabClick(item) {
    const {key,href} = item;
    if(!!href){
      window.location.href = href;
    }
    if(key === 11){
      delCookie('USER_MESSAGE');
      window.localStorage.removeItem("USER_MESSAGE_FOR_USER");
      window.location.reload();
    }
  }

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: basePageStyle }} />
      <div className={"base_page"} onScroll={(e)=>{
        changeScrollTop(e.target.scrollTop);
      }}>
        {scrollTop > 100 && <div className={"tab_choose_scroll"}/>}
        <div className={`base_page_choose ${scrollTop > 100 && "base_page_choose_fixed"}`} id={"header_tab"}>
             <div className={"tab-row"}>
                <div className={"logo"}/>
                <div className={"tab-select"}>
                  <div className={"tab-select-line"}/>
                 <div className={"tab-select-list"} style={{ justifyContent : "flex-end"}}>
                   {
                     tabList && tabList.map((item,index) => {
                       if(!!USERMESSAGE){
                         if(!item.login){
                           return null;
                         }
                       }
                       return <div
                         onMouseEnter={()=>{
                           changeEnterTab(item.value);
                         }}
                         onMouseLeave={()=>{
                           changeEnterTab("");
                         }}
                         onClick={()=>{
                           tabClick(item)
                         }}
                         className={`tab-select-item ${(chooseTab === item.value ||enterTab === item.value )&& "tab-select-item-choose" || ""}`}
                         key={"tab-select-item-" + index}>
                           {
                             (chooseTab === item.value ||
                             enterTab === item.value )&&
                             <div className={"tab-select-item-top-line"}/>
                           }
                         {item.name}
                       </div>
                     })
                   }
                 </div>
                  <div className={"tab-search"}>
                    {/*<div className={"tag-search-logo"}>*/}
                    {/*  <SearchOutlined/>*/}
                    {/*</div>*/}
                    {/*<DocunceSelectComponent  value={searchValue || undefined}*/}
                    {/*                         allowClear*/}
                    {/*                         placeholder="Search Movie"*/}
                    {/*                         size={'middle'}*/}
                    {/*                         fetchOptions={null}*/}
                    {/*                         onChange={(newValue) => {*/}
                    {/*                           changeSearchValue(newValue);*/}
                    {/*                         }}*/}
                    {/*                         style={{*/}
                    {/*                           width: '90%',*/}
                    {/*                         }}*/}
                    {/*                         defaultActiveFirstOption={false}*/}
                    {/*                         showArrow={false}*/}
                    {/*                         filterOption={false}*/}
                    {/*                         bordered={false}*/}
                    {/*                         nodeDom={(options)=>{*/}
                    {/*                           return options &&*/}
                    {/*                             options.map((item) => {*/}
                    {/*                               return (*/}
                    {/*                                 <Option key={'labelData_' + item.poiId + "_poiId"} value={item.poiId}>*/}
                    {/*                                   <div*/}
                    {/*                                     style={{*/}
                    {/*                                       width: "100%",*/}
                    {/*                                       wordWrap: 'break-word',*/}
                    {/*                                       wordBreak: 'break-all',*/}
                    {/*                                       whiteSpace: 'normal',*/}
                    {/*                                     }}*/}
                    {/*                                     dangerouslySetInnerHTML={{*/}
                    {/*                                       __html: item.hierarchy*/}
                    {/*                                     }}*/}
                    {/*                                   />*/}
                    {/*                                 </Option>*/}
                    {/*                               );*/}
                    {/*                             })*/}
                    {/*                         }}*/}
                    {/*                         showSearch />*/}
                  </div>
                  {
                    !!USERMESSAGE && <div className="user-logo">
                      <Popover
                        overlayClassName='user-logo-status'
                        placement="bottom"
                        title={null}
                        onVisibleChange={(visible)=>{
                          if(visible){
                            const USER_MESSAGE_FOR_USER = window.localStorage.getItem("USER_MESSAGE_FOR_USER");
                            let msg = Base64.decode(USER_MESSAGE_FOR_USER);
                            try{
                              msg = JSON.parse(msg);
                            }catch (e) {
                              msg = null
                            }
                            let MSGList = [];
                            if(!!msg){
                              MSGList = [{
                                key : 1,
                                value : msg.username,
                                onHref : true
                              },{
                                key : 2,
                                value : msg.email,
                                hasBorder : true,
                                onHref : true
                              }];
                              let _userTabList = _.cloneDeep(userTabList);
                              const filter = _userTabList && _userTabList.filter((item)=>{
                                return item.key === 1 || item.key === 2
                              }) || []
                              if(!filter || filter.length === 0){
                                _userTabList = [...MSGList,..._userTabList];
                              }else{
                                for(let i = 0 ; i < _userTabList.length ; i++){
                                   if(_userTabList[i].key === 1){
                                    _userTabList[i].value = msg.username
                                  }else if(_userTabList[i].key === 2){
                                     _userTabList[i].value = msg.email
                                   }
                                }
                              }
                              changeUserTabList(_userTabList);
                            }
                          }
                        }}
                        content={() => {
                          return (
                            <div className={"user-msg-popover-box"}>
                              <ul style={{
                                width:  '200px',
                                margin : 0,
                                padding:0,
                                border:"none"
                              }}>
                                {userTabList && userTabList.map((item)=>{
                                  return <li
                                    onClick={()=>{
                                      userTabClick(item)
                                    }}
                                    className={ `${item.onHref && "no-href" || ""} ${!item.hasBorder && "no-border" || ""}`}>
                                    {item.value}
                                  </li>
                                })}
                              </ul>
                            </div>
                          )
                        }}
                        trigger="hover">
                        <Avatar size={40}
                               /* onClick={()=>{
                                  window.location.href = "/movie/userMsg"
                                }}*/
                                icon={<UserOutlined />} />
                      </Popover>
                    </div>
                  }

               </div>
             </div>
        </div>
        {
          body
        }
      </div>
      <LoginComponent
        changeResetPasswordVisible={()=>{
          resetPasswordRef && resetPasswordRef.current && resetPasswordRef.current.changeVisible(true);
        }}
        loginRef={loginRef}/>
      <RegesterComponent
        changeLoginInVisible={(isVis,userName)=>{
          loginRef && loginRef.current && loginRef.current.changeVisible(true,userName);
        }}
        regesterRef={regesterRef}/>
      <ResetPasswordComponent
        resetPasswordRef={resetPasswordRef}/>
    </React.Fragment>
  )
}
export default withRouter(Page)
