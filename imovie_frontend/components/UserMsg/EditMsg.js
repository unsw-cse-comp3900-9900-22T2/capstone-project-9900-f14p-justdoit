
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {Modal,Input,Button,message} from "antd"
import EditMsgStyle from "./EditMsg.less";
import { ArrowLeftOutlined, LockOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Base64 } from "js-base64";
const { TextArea } = Input;
const md5 = require('js-md5');
import {modifyUserDetail,changePasswordInDetial} from "../../pages/MockData";
const EditMsgComponent = ({userMsg,EditMsgRef,changeEdit,uid,setUserMsg}) => {
    const [msg ,changeMsg] = useState({
       ...userMsg,
      ...{
         password : "",
         newPassWord : "",
         checkNewPassWord : ""
      }
    });

  const [initMsg,changeInitMsg] = useState({
    ...userMsg,
    ...{
      password : "",
      newPassWord : "",
      checkNewPassWord : ""
    }
  });
    const [isChangePassWord ,changeIsChangePassWord] = useState(false)
    function submitMsg() {
       if(!isChangePassWord){
          if(JSON.stringify(initMsg) === JSON.stringify(msg)){
            message.warn("Nothing change");
            return;
          }
          const {username,email,description} = msg;
          if(!username || !(username &&username.trim())){
            message.warn("Please enter your username");
            return;
          }
         if(!email || !(email &&email.trim())){
           message.warn("Please enter your email");
           return;
         }else{
           if(!((email &&email.trim()).match("^([\\w\\.-]+)@([a-zA-Z0-9-]+)(\\.[a-zA-Z\\.]+)$"))){
             message.warn("Please enter your email in the correct format.");
             return
           }
         }
        /* if(!description || !(description &&description.trim())){
           message.warn("please enter description");
           return;
         }*/
         modifyUserDetail({
           uid,
           username : username.trim(),
           email : email.trim(),
           description :(description || "" ).trim()
         }).then(res => {
            if(res.code === 200){
               message.success("Modified successfully");
              changeInitMsg({
                ...msg,
                ...{
                  password : "",
                  newPassWord : "",
                  checkNewPassWord : ""
                }
              })
              setUserMsg({
                username : username.trim(),
                email : email.trim(),
                description : (description || "" ).trim()
              })
              window.localStorage.setItem("USER_MESSAGE_FOR_USER",Base64.encode(JSON.stringify({
                email : email.trim(),
                username : username.trim()
              })));
            }else{
              message.error(res.msg   || "Modified failed");
            }
         }).catch(err =>{
           message.error("Modified failed");
         })
       }else{
         const {password,newPassWord,checkNewPassWord} = msg;
         if(!password || !(password &&password.trim())){
           message.warn("Please enter password");
           return;
         }
         if(!newPassWord|| !(newPassWord &&newPassWord.trim())){
           message.warn("Please enter new password");
           return;
         }
         if(!checkNewPassWord || !(checkNewPassWord &&checkNewPassWord.trim())){
           message.warn("Please check new Password");
           return;
         }
         if(newPassWord !== checkNewPassWord){
           message.warn("Passwords must match!");
           return;
         }
         const _pass = Base64.encode(md5(password.trim()));
         const _new_pass = Base64.encode(md5(newPassWord.trim()));
         changePasswordInDetial({
           new_password : _new_pass,
           old_password : _pass,
           uid
         }).then(res => {
           if(res.code === 200){
             message.success("Password reset complete");
             changeIsChangePassWord(false);
             const _newPageMessage = _.clone(msg);
             changeMsg({
               ..._newPageMessage,
               ...{
                 password : "",
                 newPassWord : "",
                 checkNewPassWord : ""
               }
             })
           }else{
             message.error(res.msg ||  "Password change failed")
           }
         }).catch(err => {
           message.error("Password change failed")
         })
       }
    }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: EditMsgStyle }} />
        <div
          onClick={()=>{
            if(isChangePassWord){
               changeIsChangePassWord(false);
              const _newPageMessage = _.clone(msg);
              changeMsg({
                ..._newPageMessage,
                ...{
                  password : "",
                  newPassWord : "",
                  checkNewPassWord : ""
                }
              })
            }else{
              changeEdit && changeEdit();
            }
          }}
          className={"user-msg-edit-component-go-back"}>
          <ArrowLeftOutlined />
          <span className={"user-msg-edit-component-go-back-msg"}>Back</span>
        </div>
        <div className={"userMsgEditComponent"}>
          <p>Profile Setting</p>
          <div className="profile">
             <div className={"profile-item"}>
               <h6>
                 Username
               </h6>
               <Input
                 disabled={isChangePassWord}
                 value={msg.username}
                 placeholder="Please enter your username"
                 onChange={(e) => {
                   const _value = e.target.value;
                   const _newPageMessage = _.clone(msg);
                   _newPageMessage.username = _value;
                   changeMsg(_newPageMessage);
                 }}
               />
             </div>
            <div className={"profile-item"}>
              <h6>
                Email
              </h6>
              <Input
                disabled={isChangePassWord}
                value={msg.email}
                placeholder="Please enter your email"
                onChange={(e) => {
                  const _value = e.target.value;
                  const _newPageMessage = _.clone(msg);
                  _newPageMessage.email = _value;
                  changeMsg(_newPageMessage);
                }}
              />
            </div>
            {
              isChangePassWord ? <>
                <div className={"profile-item"}>
                  <h6>
                    Password
                  </h6>
                  <Input.Password
                    prefix={<LockOutlined />}
                    value={msg.password}
                    placeholder="Please enter password"
                    onChange={(e) => {
                      const _value = e.target.value;
                      const _newPageMessage = _.clone(msg);
                      _newPageMessage.password = _value;
                      changeMsg(_newPageMessage)
                    }}
                  />
                </div>
                <div className={"profile-item"}>
                  <h6>
                    New password
                  </h6>
                  <Input.Password
                    prefix={<LockOutlined />}
                    value={msg.newPassWord}
                    placeholder="Please enter new password"
                    onChange={(e) => {
                      const _value = e.target.value;
                      const _newPageMessage = _.clone(msg);
                      _newPageMessage.newPassWord = _value;
                      changeMsg(_newPageMessage)
                    }}
                  />
                </div>
                <div className={"profile-item"}>
                  <h6>
                    Check new password
                  </h6>
                  <Input.Password
                    prefix={<LockOutlined />}
                    value={msg.checkNewPassWord}
                    placeholder="Please check new password"
                    onChange={(e) => {
                      const _value = e.target.value;
                      const _newPageMessage = _.clone(msg);
                      _newPageMessage.checkNewPassWord = _value;
                      changeMsg(_newPageMessage)
                    }}
                  />
                </div>
              </> :
                <div className={"profile-item"}>
                <h6>
                  Bio
                </h6>
                <TextArea
                  value={msg.description}
                  onChange={(e)=>{
                    const _value = e.target.value;
                    const _newPageMessage = _.clone(msg);
                    _newPageMessage.description = _value;
                    changeMsg(_newPageMessage);
                  }}
                  placeholder="Writing your description"
                  maxLength={800}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </div>
            }
          </div>
          <div className={"userMsgEditButton"}>
            {!isChangePassWord ?<Button
               onClick={()=>{
                 changeMsg(initMsg);
                 changeIsChangePassWord(true);
               }}
            >
              CHANGE PASSWORD
            </Button> : <div/>}
            <Button
              onClick={()=>{
                submitMsg();
              }}
              type="primary">
              {!isChangePassWord ? "SAVE CHANGES" : "CHANGE PASSWORD"}
            </Button>
          </div>

        </div>
      </React.Fragment>
    )
}

export default EditMsgComponent
