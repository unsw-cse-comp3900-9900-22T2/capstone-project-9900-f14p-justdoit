
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { message, Modal, Input } from "antd";
import { Base64 } from "js-base64";
import { userLogin } from "../pages/MockData";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5')
const Login = ({loginRef,changeResetPasswordVisible}) => {
   const [loginInVisible, changeLoginInVisible] = useState(false);
    const [user,changeUser] = useState({
      userName : "",
      password : "",
    });
    useImperativeHandle(loginRef, () => ({
      changeVisible: (vis) => {
        changeLoginInVisible(vis);
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
            username:userName,
            password : _pass
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
          <div className="box box2">
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
