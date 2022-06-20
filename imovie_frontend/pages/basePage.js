import { withRouter } from 'next/router'
import { useState, useImperativeHandle, useEffect, useRef } from 'react'
import React from 'react'
import _ from 'lodash'
import { Base64 } from 'js-base64'
import basePageStyle from "./basePage.less"
import { message, Modal ,Input,Select} from "antd";
const { Option } = Select;
import { userLogin, userRegister } from "./MockData";
import { LockOutlined, MailOutlined, UserOutlined ,SearchOutlined} from "@ant-design/icons";
import DocunceSelectComponent from "../components/DounceSelect"
const Page = ({ router, children }) => {
  const [body, changeBody] = useState(children);
  const [tabList] = useState([{
     value : 1,
     name : "HOME",
     href : "/movie/home",
  },{
    value : 2,
    name : "LOGIN IN",
  },{
    value : 3,
    name : "REGESTER",
  },{
    value : 4,
    name : "MOVIELIST",
    href : "/movie/list",
  },{
    value : 5,
    name : "BROWSE BY",
    href : "/movie/home?browseBy=1",
  }]);
  const [enterTab , changeEnterTab] = useState("");
  const [chooseTab,changeChooseTab] = useState("");
  const [newUser,changeNewUser] = useState({
    userName : "",
    password : "",
    email : "",
    passwordSure : ""
  });
  const [user,changeUser] = useState({
    userName : "",
    password : "",
  });
  const [scrollTop,changeScrollTop] = useState(0);
  const [searchValue,changeSearchValue] = useState("")
  const [registerVisible, changeRegisterVisible] = useState(false);
  const [loginInVisible, changeLoginInVisible] = useState(false);
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
  },[]);
  function tabClick(item) {
    if(!!item.href){
       window.location.href = item.href
    }else{
       if(item.value === 2){
         changeLoginInVisible(true);
       }else if(item.value === 3){
         changeRegisterVisible(true);
       }
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
                 <div className={"tab-select-list"}>
                   {
                     tabList && tabList.map((item,index) => {
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
                    <div className={"tag-search-logo"}>
                      <SearchOutlined/>
                    </div>
                    <DocunceSelectComponent  value={searchValue || undefined}
                                             allowClear
                                             placeholder="Search Movie"
                                             size={'middle'}
                                             fetchOptions={null}
                                             onChange={(newValue) => {
                                               changeSearchValue(newValue);
                                             }}
                                             style={{
                                               width: '90%',
                                             }}
                                             defaultActiveFirstOption={false}
                                             showArrow={false}
                                             filterOption={false}
                                             bordered={false}
                                             nodeDom={(options)=>{
                                               return options &&
                                                 options.map((item) => {
                                                   return (
                                                     <Option key={'labelData_' + item.poiId + "_poiId"} value={item.poiId}>
                                                       <div
                                                         style={{
                                                           width: "100%",
                                                           wordWrap: 'break-word',
                                                           wordBreak: 'break-all',
                                                           whiteSpace: 'normal',
                                                         }}
                                                         dangerouslySetInnerHTML={{
                                                           __html: item.hierarchy
                                                         }}
                                                       />
                                                     </Option>
                                                   );
                                                 })
                                             }}
                                             showSearch />
                  </div>
               </div>
             </div>
        </div>
        {
          body
        }
      </div>
      <Modal
        visible={registerVisible}
        title={`register`}
        okText="ok"
        zIndex={300}
        cancelText="cancel"
        onOk={() => {
          const {userName,passwordSure,password,email} = newUser;
          if(!userName){
            message.warn("Please enter userName");
            return
          }
          if(!email){
            message.warn("Please enter email");
            return
          }else{
            if(!(email.match(/^\w+@\w+\.\w+$/i))){
              message.warn("Please enter a mailbox in the correct format");
              return
            }
          }
          if(!password){
            message.warn("Please enter password");
            return
          }
          if(password !== passwordSure){
            message.warn("Entered passwords differ!");
            return
          }
          const _pass = Base64.encode(md5(password))
          userRegister({
            username:userName,password : _pass,email
          }).then(res => {
            if(res.status === 200){
              message.success("register was successful");
              changeRegisterVisible(false);
              changeNewUser({
                userName : "",
                password : "",
                email : "",
                passwordSure : ""
              })
            }else{
              message.error(res.msg)
            }
          })
        }}
        onCancel={() => {
          changeRegisterVisible(false);
          changeNewUser({
            userName : "",
            password : "",
            email : "",
            passwordSure : ""
          })
        }}>
        <div className={"modal_box"}>
          <div className="box">
            <h6>UserName</h6>
            <div className="switch_box">
              <Input
                value={newUser.userName}
                placeholder="Please enter userName"
                prefix={<UserOutlined />}
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.userName = _value;
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>Email</h6>
            <div className="switch_box">
              <Input
                prefix={<MailOutlined />}
                value={newUser.email}
                placeholder="Please enter email"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser)
                  _newPageMessage.email = _value
                  changeNewUser(_newPageMessage)
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>PassWord</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={newUser.password}
                placeholder="Please enter password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.password = _value;
                  changeNewUser(_newPageMessage)
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>Confirm</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={newUser.passwordSure}
                placeholder="Please confirm password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.passwordSure = _value;
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        visible={loginInVisible}
        title={`Login In`}
        okText="ok"
        zIndex={300}
        cancelText="cancel"
        onOk={() => {
          const {userName,password} = user;
          if(!userName){
            message.warn("Please enter userName");
            return
          }
          if(!password){
            message.warn("Please enter password");
            return
          }
          const _pass = Base64.encode(md5(password))
          userLogin({
            username:userName,password : _pass
          }).then(res => {
            if(res.status === 200){
              message.success("register was successful");
              changeLoginInVisible(false);
              changeUser({
                userName : "",
                password : ""
              })
            }else{
              message.error(res.msg)
            }
          })
        }}
        onCancel={() => {
          changeLoginInVisible(false);
          changeUser({
            userName : "",
            password : "",
          })
        }}>
        <div className={"modal_box"}>
          <div className="box">
            <h6>UserName</h6>
            <div className="switch_box">
              <Input
                value={user.userName}
                placeholder="Please enter userName"
                prefix={<UserOutlined />}
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(user);
                  _newPageMessage.userName = _value;
                  changeUser(_newPageMessage);
                }}
              />
            </div>
          </div>
          <div className="box">
            <h6>PassWord</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={user.password}
                placeholder="Please enter password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(user);
                  _newPageMessage.password = _value;
                  changeUser(_newPageMessage)
                }}
              />
            </div>
          </div>
          <h6 className={"forgetPassword"}>
            Forget Password
          </h6>
        </div>
      </Modal>
    </React.Fragment>
  )
}
export default withRouter(Page)
