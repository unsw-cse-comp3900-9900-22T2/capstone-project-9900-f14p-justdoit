import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import { Tabs, message, Avatar } from "antd";
const {TabPane} = Tabs;
import {getUserDetail} from "../MockData";
import userMsgStyle from "./userMsg.less";
import { UserOutlined ,LikeOutlined ,DislikeOutlined,
  HistoryOutlined,EyeOutlined,PlaySquareOutlined,HeartOutlined,HighlightOutlined} from "@ant-design/icons";
import { delCookie } from "../../util/common";
import EditMsgComponent from "../../components/UserMsg/EditMsg"
import WishListComponent from "../../components/UserMsg/WishList"
import {addHref} from "../../util/common";
const UserMsg = ({USERMESSAGE,initQuery}) => {
  const [uid,changeUid] = useState(null);
  const [edit,changeEdit] = useState(initQuery.profile);
  const [activeKey,changeActiveKey] = useState(initQuery.activeKey)
  const [userMsg, changeUserMsg] = useState({
    description : "jksdhfjkshfjkshfjkshfkjhsjkfhsjkhf shdfjkhsjkf sdhfsjk fhs" +
      "jkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjkshfkjhsjkfhsjkhf shdfj" +
      "khsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjkshfkjhsjk" +
      "fhsjkhf shdfjkhsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjks" +
      "hfkjhsjkfhsjkhf shdfjkhsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh ",
    email : "512170894@qq.com",
    username : "jiajie.chen"
  });
  const [tabList] = useState([{
     key : 1,
     value : "wishlist",
    icon : <HeartOutlined />
  },{
    key : 2,
    value : "watched",
    icon : <EyeOutlined />
  },{
    key : 3,
    value : "movielist",
    icon : <PlaySquareOutlined />
  },{
    key : 4,
    value : "history",
    icon : <HistoryOutlined />
  },{
    key : 5,
    value : "reviews",
    icon :<HighlightOutlined />
  },{
    key : 6,
    value : "like",
    icon : <LikeOutlined />
  },{
    key : 7,
    value : "dislike",
    icon : <DislikeOutlined />
  }])
  useEffect(()=>{
    if(!!USERMESSAGE){
       changeUid(USERMESSAGE.uid);
      getUserDetail({
        uid : USERMESSAGE.uid
      }).then(res => {
          if(res.code === 200){
            const {result} = res;
            changeUserMsg(result);
          }else{
            message.error("get user message error")
          }
      }).catch(err => {
         const res = {
           code : 200,
            result : {
              description : "jksdhfjkshfjkshfjkshfkjhsjkfhsjkhf shdfjkhsjkf sdhfsjk fhs" +
                "jkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjkshfkjhsjkfhsjkhf shdfj" +
                "khsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjkshfkjhsjk" +
                "fhsjkhf shdfjkhsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh jksdhfjkshfjkshfjks" +
                "hfkjhsjkfhsjkhf shdfjkhsjkf sdhfsjk fhsjkfhsjkhfsjkfhsjkfh ",
              email : "512170894@qq.com",
              username : "jiajie.chen"
            }
         }
         const {result} = res;
         changeUserMsg(result);
      })
    }else{
      delCookie('USER_MESSAGE');
      window.localStorage.removeItem("USER_MESSAGE_FOR_USER");
      window.location.href = "/movie/home";
    }
  },[]);
  function getTabDom(item) {
    switch (item.key) {
      case 1:
        return <WishListComponent uid={uid}/>;
      default:
        return <div>{item.key}</div>
    }
  }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{
        __html : userMsgStyle
      }}/>
      {
        !edit ?  <div className={"user-message-box"}>
          <div className="user-message-title">
            <div className="user-logo">
              <Avatar size={60}
                      icon={<UserOutlined />} />
            </div>
            <div className={"user-message"}>
              <h6 className="username">
                {userMsg.username}
              </h6>
              <h6>
                {userMsg.email}
              </h6>
              <h6>
                {userMsg.description}
              </h6>
              <div
                onClick={()=>{
                  changeEdit(true)
                }}
                className={"edit"}>
                EDIT PROFILE
              </div>
            </div>
          </div>
          <div className={"tab-pane-box"}>
            <Tabs
              activeKey={activeKey}
              size={"large"}
              style={{
                marginBottom: 32,
              }}
              onChange={(activeKey)=>{
                addHref("activeKey",activeKey);
                changeActiveKey(activeKey);
              }}
              destroyInactiveTabPane={true}
            >
              {
                tabList && tabList.map((item,index)=>{
                  return <TabPane
                    tab={<div className={`tab-list-pane ${index < tabList.length - 1 && "borderRight" || ""}`}>
                                          {item.icon}
                                          <span className={"tab-list-pane-value"}>{item.value}</span>
                                      </div>} key={item.key}>
                           {getTabDom(item)}
                        </TabPane>
                })
              }
            </Tabs>
          </div>
        </div> : <EditMsgComponent
          changeEdit={()=>{
            changeEdit(false)
          }}
          setUserMsg={(msg)=>{
            changeUserMsg(msg);
          }}
          uid={uid}
          userMsg={{
          ...{
            uid
          },
          ...userMsg
        }}/>
      }
    </PageBase>
  )
}
UserMsg.getInitialProps = async (status) => {

  const profile = status && status.query && status.query.profile;
  const activeKey = status && status.query && status.query.activeKey <= 7 &&
    status.query.activeKey|| 1;
  return {
    initQuery: {
      profile,
      activeKey,
    }
  }
}
export default UserMsg
