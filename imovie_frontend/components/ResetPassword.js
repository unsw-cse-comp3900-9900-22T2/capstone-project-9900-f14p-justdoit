
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import "./login.less"
import { message, Modal, Input, Button } from "antd";
import { Base64 } from "js-base64";
import {  userRegister } from "../pages/MockData";
import { LockOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import _ from 'lodash'
import loginStyle from "./login.less";
const md5 = require('js-md5')
const ResetPassword = ({resetPasswordRef}) => {
    const [registerVisible, changeRegisterVisible] = useState(false);
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
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: loginStyle }} />
      <Modal
        visible={registerVisible}
        title={`Reset Password`}
        okText="RESET"
        zIndex={500}
        cancelText="CANCEL"
        onOk={() => {
          const {code,passwordSure,password,email,checkAge,checkRules} = newUser;
          if(!email){
            message.warn("Please enter email");
            return
          }else{
            if(!(email.match(/^\w+@\w+\.\w+$/i))){
              message.warn("Please enter a mailbox in the correct format");
              return
            }
          }
          if(!code){
            message.warn("Please enter Verify Code");
            return
          }
          if(!password){
            message.warn("Please enter password");
            return
          }
          if(password !== passwordSure){
            message.warn("Entered passwords differ!");
            return
          }
          const _pass = Base64.encode(md5(password));
         /* userRegister({
            password : _pass,
            email ,
            verifyCode : code
          }).then(res => {
            if(res.status === 0){
              message.success("register was successful");
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
          })*/
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
                placeholder="Please enter email"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(newUser)
                  _newPageMessage.email = _value
                  changeNewUser(_newPageMessage)
                }}
              />
              <Button
                style={{
                  marginLeft : "5px"
                }}
                type="primary">Send Email</Button>
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
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default ResetPassword
