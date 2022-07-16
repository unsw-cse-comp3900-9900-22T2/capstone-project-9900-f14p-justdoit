
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { message, Modal, Input, Checkbox } from "antd";
import { Base64 } from "js-base64";
import {checkEmail, checkUsername, userLogin, userRegister} from "../pages/MockData";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5')
const Regester = ({regesterRef,changeLoginInVisible}) => {
    const [registerVisible, changeRegisterVisible] = useState(false);
    const [userSetTime,changeUserSetTime] = useState(null)
    const [userNameCheck,changeUserNameCheck] = useState({
        code : "",
        value : ""
    })
    const [userEmailCheck,changeEmailNameCheck] = useState({
        code : "",
        value : ""
    })
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
          if(!userName || !(userName &&userName.trim())){
            message.warn("Please enter your username");
            return
          }
            if(userNameCheck && userNameCheck.code === 400){
                message.warn(userNameCheck.value || "Please fill in the correct user name");
                return;
            }
          if(!email || !(email &&email.trim())){
            message.warn("Please enter your email");
            return
          }else{
            if(!((email &&email.trim()).match("^([\\w\\.-]+)@([a-zA-Z0-9-]+)(\\.[a-zA-Z\\.]+)$"))){
              message.warn("Please enter your email in the correct format");
              return
            }
          if(userEmailCheck && userEmailCheck.code === 400){
              message.warn(userEmailCheck.value || "Please fill in the correct user name");
              return;
          }
          }
          if(!password || !(password &&password.trim())){
            message.warn("Please enter password");
            return
          }
          if(password !== passwordSure){
            message.warn("Passwords must match!");
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
          const _pass = Base64.encode(md5(password.trim()))
          userRegister({
            username : userName.trim(),
            password : _pass,
            email : email.trim()
          }).then(res => {
            if(res.code === 200){
              message.success("Your registration was successful");
              changeRegisterVisible(false);
              changeLoginInVisible && changeLoginInVisible(true,userName.trim());
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
            <h6>Username</h6>
            <div className="switch_box">
              <Input
                value={newUser.userName}
                placeholder="Please enter your username"
                prefix={<UserOutlined />}
                onChange={(e) => {
                    const _value = e.target.value;
                    const _newPageMessage = _.clone(newUser);
                    _newPageMessage.userName = _value;
                    changeNewUser(_newPageMessage);
                    if(!!userSetTime){
                        clearTimeout(userSetTime);
                        changeUserSetTime(null);
                    }
                    const setTime = setTimeout(()=>{
                        if(!((_value || "").trim())){
                            return
                        }
                        checkUsername({
                            username : (_value || "").trim()
                        }).then(res => {
                            const _userNameCheck = _.cloneDeep(userNameCheck);
                            _userNameCheck.code = res.code;
                            _userNameCheck.value = res.msg;
                            changeUserNameCheck(_userNameCheck);
                        })
                        clearTimeout(userSetTime);
                        changeUserSetTime(null);
                    },500)
                    changeUserSetTime(setTime)
                }}
              />
            {
                !!userNameCheck.code && <h5 className={`errorMsgTip ${userNameCheck.code === 200 && "errorMsgTipSuccess" || ""}`}>
                    {
                        userNameCheck.code === 200 ? (userNameCheck.value || "ok") :
                            (userNameCheck.value || "error")
                    }
                </h5>
            }
            </div>
          </div>
          <div className="box">
            <h6>Email</h6>
            <div className="switch_box">
              <Input
                prefix={<MailOutlined />}
                value={newUser.email}
                placeholder="Please enter your email"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser)
                  _newPageMessage.email = _value;
                    if(!!userSetTime){
                        clearTimeout(userSetTime);
                        changeUserSetTime(null);
                    }
                    const setTime = setTimeout(()=>{
                        if(!((_value || "").trim())){
                            return
                        }
                        checkEmail({
                            email : (_value || "").trim()
                        }).then(res => {
                            const _userEmailCheck = _.cloneDeep(userEmailCheck);
                            _userEmailCheck.code = res.code;
                            _userEmailCheck.value = res.msg;
                            changeEmailNameCheck(_userEmailCheck);
                        })
                        clearTimeout(userSetTime);
                        changeUserSetTime(null);
                    },500)
                    changeUserSetTime(setTime)
                  changeNewUser(_newPageMessage)
                }}
              />
                {
                    !!userEmailCheck.code && <h5 className={`errorMsgTip ${userEmailCheck.code === 200 && "errorMsgTipSuccess" || ""}`}>
                        {
                            userEmailCheck.code === 200 ? (userEmailCheck.value || "ok") :
                                (userEmailCheck.value || "error")
                        }
                    </h5>
                }
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
          }}>LOGIN</span>
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
