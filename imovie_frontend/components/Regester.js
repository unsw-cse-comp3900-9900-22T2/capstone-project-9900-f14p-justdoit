
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {message, Modal, Input, Checkbox, Button} from "antd";
import { Base64 } from "js-base64";
import {checkEmail, checkUsername, sendEmail, userLogin, userRegister,registerVisitor} from "../pages/MockData";
import {KeyOutlined, LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
import {setCookie} from "../util/cookie";
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
        code : "",
        passwordSure : "",
        checkAge : false,
        checkRules : false
    });
    useImperativeHandle(regesterRef, () => ({
      changeVisible: (vis) => {
        changeRegisterVisible(vis);
      },
    }));
    function sendButtonEmail() {
        const {email} = newUser;
        if(!email|| !(email &&email.trim())){
            message.warn("Please enter your email");
            return
        }else{
            if(!(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test((email &&email.trim())))){
                message.warn("Please enter your email in the correct format");
                return
            }
            if(userEmailCheck && userEmailCheck.code === 400){
                message.warn(userEmailCheck.value || "Please fill in the correct user name");
                return;
            }
        }
        sendEmail({
            email
        }).then(res => {
            if(res.code === 200){
                Modal.info({
                    title: res.msg,
                    okText : "Yes",
                    cancelText : "No",
                    onOk() {
                        console.log('OK');
                    }
                });
            }else{
                message.error("Send email error, please check your email.")
            }
        }).catch(err => {
            message.error("Send email error, please check your email.")
        })
    }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: loginStyle }} />
      <Modal
        visible={registerVisible}
        title={`REGISTER`}
        okText="REGISTER"
        okButtonProps={{
            disabled : ((!!userEmailCheck.code && userEmailCheck.code === 400) || !userEmailCheck.code) ||
                ((!!userNameCheck.code && userNameCheck.code === 400) || !userNameCheck.code) ||
                (!newUser.userName || !(newUser.userName && newUser.userName.trim())) ||
                (!newUser.email || !(newUser.email && newUser.email.trim())) ||
                (!newUser.code || !(newUser.code && newUser.code.trim())) ||
                (!newUser.password || !(newUser.password && newUser.password.trim())) ||
                ((newUser.password &&newUser.password.trim()).length < 8) ||
                (!newUser.passwordSure || !(newUser.passwordSure && newUser.passwordSure.trim())) ||
                !newUser.checkAge || !newUser.checkRules
        }}
        zIndex={500}
        cancelText="CANCEL"
        onOk={() => {
          const {userName,passwordSure,password,email,checkAge,checkRules,code} = newUser;
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
            if(!(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test((email &&email.trim())))){
              message.warn("Please enter your email in the correct format");
              return
            }
              if(userEmailCheck && userEmailCheck.code === 400){
                  message.warn(userEmailCheck.value || "Please fill in the correct user name");
                  return;
              }
          }
            if(!code|| !(code &&code.trim())){
                message.warn("Please enter Verify Code");
                return
            }
          if(!password || !(password &&password.trim())){
            message.warn("Please enter password");
            return
          }else if((password &&password.trim()).length < 8){
              message.warn("Please enter a password with more than 8 digits");
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
            email : email.trim(),
            verifycode : code.trim(),
          }).then(res => {
            if(res.code === 200){
              message.success("Your registration was successful");
              changeRegisterVisible(false);
              changeLoginInVisible && changeLoginInVisible(true,userName.trim());
              changeNewUser({
                userName : "",
                password : "",
                email : "",
                  code : "",
                passwordSure : "",
                checkAge:false,
                checkRules:false
              })
                changeUserNameCheck({
                    code : "",
                    value : ""
                })
                changeEmailNameCheck({
                    code : "",
                    value : ""
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
              code : "",
            passwordSure : "",
            checkAge:false,
            checkRules:false
          })
            changeUserNameCheck({
                code : "",
                value : ""
            })
            changeEmailNameCheck({
                code : "",
                value : ""
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
                            username : (_value || "").trim(),
                            uid : null
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
                <Button
                    style={{
                        marginLeft : "5px"
                    }}
                    onClick={()=>{
                        sendButtonEmail()
                    }}
                    disabled={(!!userEmailCheck.code && userEmailCheck.code === 400) || !userEmailCheck.code}
                    type="primary">SEND EMAIL</Button>
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
                <h6>Verify Code</h6>
                <div className="switch_box">
                    <Input
                        prefix={<KeyOutlined />}
                        value={newUser.code}
                        placeholder="Please enter verify code"
                        onChange={(e) => {
                            const _value = e.target.value;
                            const _newPageMessage = _.clone(newUser);
                            _newPageMessage.code = _value;
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
                placeholder="Please enter a password with more than 8 digits"
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
            <h6 className={"register-to-login"}>
                Don't want to register?<span onClick={()=>{
                registerVisitor({}).then(res => {
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
                    }else{
                        message.error(res.msg)
                    }
                })
            }}>Create a visitor account</span>
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
