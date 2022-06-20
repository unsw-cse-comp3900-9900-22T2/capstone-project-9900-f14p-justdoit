import { useState, useEffect } from 'react'
import { Input, Button, message ,Modal} from 'antd'
import { UserOutlined, LockOutlined ,MailOutlined} from '@ant-design/icons'
import { Base64 } from 'js-base64'
const md5 = require('js-md5')
import { delCookie ,setCookie} from '../util/cookie'
import {userRegister,userLogin} from "./MockData";
import Style from "./login.less"
import _ from "lodash"
const UgcLogin = ({}) => {
  const [user, changeUser] = useState('admin')
  const [password, changePassword] = useState('');
  const [newUser,changeNewUser] = useState({
     userName : "",
     password : "",
     email : "",
     passwordSure : ""
  });
  const [registerVisible, changeRegisterVisible] = useState(false)
  useEffect(() => {
    sessionStorage.removeItem('TAB_PANE')
    delCookie('USER_MESSAGE', null)
    let account = localStorage.getItem('USER_ACCOUNT')
    if (!!account) {
      try {
        account = Base64.decode(account)
        const accountList = account.split(' || ')
        changeUser(accountList[0])
        changePassword(accountList.length > 1 && accountList[1])
      } catch (e) {
        console.log('e', e)
      }
    }
  }, [])
  function inputChange(e, type) {
    if (type === 'user') {
      changeUser(e.target.value)
    } else if (type === 'password') {
      changePassword(e.target.value)
    }
  }
  function login() {
    const _user = user.trim();
    const _password = password.trim();
    if (!_user) {
      message.error('enter your username');
      return false
    }
    if (!_password) {
      message.error('enter your password');
      return false
    }
    const _pass = Base64.encode(md5(_password));
    userLogin({
      userName : _user,
      password : _pass
    }).then(res => {
      if(res.status === 0){
        message.success("login was successful");
         setCookie("USER_MESSAGE",JSON.stringify(res.data || {}),10);
        localStorage.setItem(
          'USER_ACCOUNT',
          Base64.encode(`${_user} || ${_password}`)
        )
      }else{
        message.error(res.msg || "login was fail")
      }
    })
  }
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: Style }} />
      <div className="login_big_box">
        <div className="loginBox">
          <p>LOGO</p>
          <div className="loginInputBox">
            <div className="loginImage"/>
            <div>
              <Input
                placeholder="enter your username"
                onChange={(e) => inputChange(e, 'user')}
                prefix={<UserOutlined />}
                value={user}
              />
              <Input.Password
                placeholder="enter your password"
                onChange={(e) => inputChange(e, 'password')}
                prefix={<LockOutlined />}
                value={password}
              />
            </div>
            <h6
              onClick={()=>{
                changeRegisterVisible(true)
              }}
              className={"register"}>register</h6>
            <Button type="primary" onClick={() => login()}>
              LOGIN
            </Button>
          </div>
        </div>
      </div>
      <Modal
        visible={registerVisible}
        title={`register`}
        okText="ok"
        zIndex={2}
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
            userName,password : _pass,email
          }).then(res => {
            if(res.status === 0){
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
      </React.Fragment>
  )
}

UgcLogin.getInitialProps = async (status) => {
  return {
    stateMessage: {}
  }
}

export default UgcLogin
