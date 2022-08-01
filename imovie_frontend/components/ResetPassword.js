
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import "./login.less"
import { message, Modal, Input, Button } from "antd";
import { Base64 } from "js-base64";
import {  sendEmail,changePassword } from "../pages/MockData";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5');
const { confirm } = Modal;
const ResetPassword = ({resetPasswordRef}) => {
    const [registerVisible, changeRegisterVisible] = useState(false);
    const [emailCheck,changeEmailCheck] = useState(true)
    const [newUser,changeNewUser] = useState({
        code : "",
        password : "",
        email : "",
        passwordSure : ""
    });
    useImperativeHandle(resetPasswordRef, () => ({
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
        title={`Reset Password`}
        okText="RESET"
        okButtonProps={{
            disabled :
                (!newUser.email || !(newUser.email && newUser.email.trim())) ||
                (!newUser.code || !(newUser.code && newUser.code.trim())) ||
                (!newUser.password || !(newUser.password && newUser.password.trim())) ||
                ((newUser.password &&newUser.password.trim()).length < 8) ||
                (!newUser.passwordSure || !(newUser.passwordSure && newUser.passwordSure.trim()))
        }}
        zIndex={500}
        cancelText="CANCEL"
        onOk={() => {
          const {code,passwordSure,password,email} = newUser;
          if(!email|| !(email &&email.trim())){
            message.warn("Please enter your email");
            return
          }else{
            if(!(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test((email &&email.trim())))){
              message.warn("Please enter your email in the correct format");
              return
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
          const _pass = Base64.encode(md5(password.trim()));
          changePassword({
            email : email.trim(),
            verifycode : code.trim(),
            password:_pass
          }).then(res => {
            if(res.code === 200){
              message.success("Change password successful");
              changeRegisterVisible(false);
              changeNewUser({
                code : "",
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
            code : "",
            password : "",
            email : "",
            passwordSure : ""
          })
        }}>
        <div className={"modal_box"}>
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
                  _newPageMessage.email = _value
                  changeNewUser(_newPageMessage);
                   let _check = false;
                    if(!_value|| !(_value &&_value.trim())){
                        _check =  true
                    }else{
                        if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test((_value &&_value.trim())))){
                            _check =  true
                        }
                    }
                    changeEmailCheck(_check);
                }}
              />
              <Button
                style={{
                  marginLeft : "5px"
                }}
                disabled={emailCheck}
                onClick={()=>{
                  sendButtonEmail()
                }}
                type="primary">SEND EMAIL</Button>
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
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default ResetPassword
