
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { message, Modal, Input, Checkbox } from "antd";
import { Base64 } from "js-base64";
import { userLogin, userRegister } from "../pages/MockData";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5')
const Regester = ({regesterRef,changeLoginInVisible}) => {
    const [registerVisible, changeRegisterVisible] = useState(false);
    const [newUser,changeNewUser] = useState({
        userName : "",
        password : "",
        email : "",
        passwordSure : "",
        checkAge : false,
        checkRules : false
    });
    useImperativeHandle(regesterRef, () => ({
      changeVisible: (vis) => {
        changeRegisterVisible(vis);
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: loginStyle }} />
      <Modal
        visible={registerVisible}
        title={`REGISTER`}
        okText="REGISTER"
        zIndex={500}
        cancelText="CANCEL"
        onOk={() => {
          const {userName,passwordSure,password,email,checkAge,checkRules} = newUser;
          if(!userName){
            message.warn("Please enter userName");
            return
          }
          if(!email){
            message.warn("Please enter email");
            return
          }else{
            if(!(email.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$"))){
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
          if(!checkAge){
            message.warn("Please enter some rule!");
            return
          }
          if(!checkRules){
            message.warn("Please enter some rule!");
            return
          }
          const _pass = Base64.encode(md5(password))
          userRegister({
            username : userName,
            password : _pass,
            email
          }).then(res => {
            if(res.code === 200){
              message.success("register was successful");
              changeRegisterVisible(false);
              changeLoginInVisible && changeLoginInVisible(true,userName);
              changeNewUser({
                userName : "",
                password : "",
                email : "",
                passwordSure : "",
                checkAge:false,
                checkRules:false
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
            passwordSure : "",
            checkAge:false,
            checkRules:false
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
            <h6>Password</h6>
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
            <h6>Check Password</h6>
            <div className="switch_box">
              <Input.Password
                prefix={<LockOutlined />}
                value={newUser.passwordSure}
                placeholder="Please check password"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser);
                  _newPageMessage.passwordSure = _value;
                  changeNewUser(_newPageMessage);
                }}
              />
            </div>
          </div>
          <h6 className={"register-to-login"}>
            Already has an account?<span onClick={()=>{
            changeRegisterVisible(false);
            changeNewUser({
              userName : "",
              password : "",
              email : "",
              passwordSure : "",
              checkAge:false,
              checkRules:false
            })
            changeLoginInVisible && changeLoginInVisible(true)
          }}>Login</span>
          </h6>
          <div className={"check-box"}>
            <Checkbox
              onChange={(e)=>{
                const _value = e.target.checked;
                const _newPageMessage = _.clone(newUser);
                _newPageMessage.checkAge = _value;
                changeNewUser(_newPageMessage);
              }}
              value={newUser.checkAge}>I'm at least 16 years old and accept the Terms of User</Checkbox>
          </div>
          <div className={"check-box"}>
            <Checkbox
              onChange={(e)=>{
                const _value = e.target.checked;
                const _newPageMessage = _.clone(newUser);
                _newPageMessage.checkRules = _value;
                changeNewUser(_newPageMessage);
              }}
              value={newUser.checkRules}>I accept the Privacy Policy</Checkbox>
          </div>
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default Regester
