
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { message, Modal, Input } from "antd";
import { Base64 } from "js-base64";
import { userLogin } from "../pages/MockData";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5');
import {setCookie} from "../util/cookie"
const Login = ({loginRef,changeResetPasswordVisible}) => {
   const [loginInVisible, changeLoginInVisible] = useState(false);
    const [user,changeUser] = useState({
      userName : "",
      password : "",
    });
    useImperativeHandle(loginRef, () => ({
      changeVisible: (vis,userName) => {
        changeLoginInVisible(vis);
        const _user = _.cloneDeep(user);
        _user.userName = userName;
        changeUser(_user);
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: loginStyle }} />
      <Modal
        visible={loginInVisible}
        title={`LOGIN`}
        okText="LOGIN"
        cancelText={"CANCEL"}
        zIndex={300}
        onOk={() => {
          const {userName,password} = user;
          if(!userName|| !(userName &&userName.trim())){
            message.warn("Please enter your username");
            return
          }
          if(!password|| !(password &&password.trim())){
            message.warn("Please enter your password");
            return
          }
          let _pass = "";
          if(userName.trim() === "admin"){
              _pass = password.trim()
          }else{
              _pass = Base64.encode(md5(password.trim()))
          }
          userLogin({
            username:userName.trim(),
            password : _pass
          }).then(res => {
            if(res.code === 200){
              message.success("Your registration was successful");
              const msg = res.result;
              const {uid,token,email,username,role} = msg;
              setCookie("USER_MESSAGE",JSON.stringify({
                uid,
                token,
                role
              }),30);
              window.localStorage.setItem("USER_MESSAGE_FOR_USER",Base64.encode(JSON.stringify({
                email,username
              })));
              window.location.reload();
              changeLoginInVisible(false);
              changeUser({
                userName : "",
                password : ""
              })
            }else{
              message.error(res.msg)
            }
          }).catch(err => {
           const res = {"code":200,"msg":"Login successful","result":{
             "description":null,
               "email":"12344321@gmail.com",
               "username":"amber6",
               "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTU4NjIzMTYsImlhdCI6MTY1NTg1NTExNiwiZGF0YSI6eyJpZCI6NSwidXNlcm5hbWUiOiJhbWJlcjYifX0.miHzBQm2Y9lRFxYMqnGaABfY7F38naz7qKLxryJrKH4",
               "uid" : "12333"
             }}
            const msg = res.result;
            const {uid,token,email,username} = msg;
            setCookie("USER_MESSAGE",JSON.stringify({
              uid,
              token
            }),30);
            window.localStorage.setItem("USER_MESSAGE_FOR_USER",Base64.encode(JSON.stringify({
              email,username
            })));
            window.location.reload();
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
          <div className="box box2">
            <h6>Username</h6>
            <div className="switch_box">
              <Input
                value={user.userName}
                placeholder="Please enter your username"
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
          <div className="box box2">
            <h6>Password</h6>
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
          <h6 className={"forgetPassword"}
            onClick={()=>{
              changeResetPasswordVisible && changeResetPasswordVisible(true)
            }}
          >
            Forgot your password?
          </h6>
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default Login
