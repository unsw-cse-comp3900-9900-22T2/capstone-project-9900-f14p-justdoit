import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import { Tabs, message, Avatar } from "antd";
const {TabPane} = Tabs;
import {getUserDetail,followOrNot,checkFollow,checkBlock,blockOrNot} from "../MockData";
import userMsgStyle from "./userMsg.less";
import { UserOutlined ,LikeOutlined ,DislikeOutlined,
  HistoryOutlined,EyeOutlined,PlaySquareOutlined,HeartOutlined,HighlightOutlined,FrownOutlined} from "@ant-design/icons";
import {delCookie, isVisitor} from "../../util/common";
import EditMsgComponent from "../../components/UserMsg/EditMsg"
import WishListComponent from "../../components/UserMsg/WishList"
import ReviewsComponent from "../../components/UserMsg/Review"
import WatchListComponent from "../../components/UserMsg/WatchList"
// 改了这
import HisToryComponent from "../../components/UserMsg/HisTory"
import MovieListComponent from "../../components/UserMsg/MovieList"
import DisLikeComponent from "../../components/UserMsg/DisLike"
import LiKeComponent from "../../components/UserMsg/LiKe"
import FollowComponent from "../../components/UserMsg/Follow"
import BlockComponent from "../../components/UserMsg/Block"
import {addHref} from "../../util/common";
import { Base64 } from "js-base64";
const UserMsg = ({USERMESSAGE,initQuery}) => {
  const [isMySelf] = useState(initQuery.uid ? initQuery.uid === (USERMESSAGE && USERMESSAGE.uid) : true);
  const [uid,changeUid] = useState(null);
  const [edit,changeEdit] = useState(initQuery.profile);
  const [activeKey,changeActiveKey] = useState(initQuery.activeKey)
  const [userMsg, changeUserMsg] = useState({
    description : "",
    email : "",
    username : ""
  });
  const [showDom,changeShowDom] = useState(false);
  const [isFollow,changeIsFollow] = useState(false);
  const [isBlock,changeIsBlock] = useState(false);
  const followerRef = useRef();
  const [tabList] = useState([{
     key : 1,
     value : "Wishlist",
    icon : <HeartOutlined />
  },
    {
    key : 2,
    value : "Watchlist",
    icon : <EyeOutlined />
  },

  {
    key : 4,
    value : "History",
    icon : <HistoryOutlined />
  },
  {
    key : 3,
    value : "Movielist",
    icon : <PlaySquareOutlined />
  },
  {
    key : 5,
    value : "Review",
    icon :<HighlightOutlined />
  },
  {
    key : 6,
    value : "Like",
    icon : <LikeOutlined />
  },
  {
    key : 7,
    value : "Dislike",
    icon : <DislikeOutlined />
  },
  {
    key : 8,
    value : "Block",
    icon : <FrownOutlined />
  }
  ])
  useEffect(()=>{
    if(!!USERMESSAGE || initQuery.uid){
      if(USERMESSAGE){
        changeUid(USERMESSAGE.uid);
      }
      if(isMySelf){
        addHref("uid","");
        if(!USERMESSAGE || isVisitor(USERMESSAGE)){
           window.location.href = "/movie/home"
        }
      }else{
        if(!isVisitor(USERMESSAGE)){
          checkFollow({
              o_uid :initQuery.uid,
              f_uid : (USERMESSAGE && USERMESSAGE.uid) || null
          }).then(res => {
            if(res.code === 200){
              changeIsFollow(!!res.result);
            }
          })
          checkBlock({
            buid :initQuery.uid,
            uid : (USERMESSAGE && USERMESSAGE.uid) || null
        }).then(res => {
          if(res.code === 200){
            changeIsBlock(!!res.result);
          }
        })
        }
      }
      getUserDetail({
        uid : isMySelf ? (USERMESSAGE && USERMESSAGE.uid) : initQuery.uid
      }).then(res => {
          if(res.code === 200){
            const {result} = res;
            changeUserMsg(result);
            changeShowDom(true);
            if(isMySelf){
              const {username,email} = result;
              window.localStorage.setItem("USER_MESSAGE_FOR_USER",Base64.encode(JSON.stringify({
                email,username
              })));
            }
          }else{
            message.error("get user message error")
          }
      }).catch(err =>{
        changeShowDom(true);
      })
    }else{
      delCookie('USER_MESSAGE');
      window.localStorage.removeItem("USER_MESSAGE_FOR_USER");
      window.location.href = "/movie/home";
    }
  },[]);
  function getTabDom(item) {
    const _uid = isMySelf ? USERMESSAGE.uid : initQuery.uid;
    switch (item.key) {
      case 1:
        return <WishListComponent uid={_uid} isMySelf={isMySelf}/>;
      case 2:
        return <WatchListComponent uid={_uid} isMySelf={isMySelf}/>;
      case 3:
        return <MovieListComponent uid={_uid} isMySelf={isMySelf} USERMESSAGE={USERMESSAGE}/>;
      case 4:
        return <HisToryComponent uid={_uid} isMySelf={isMySelf}/>;
      case 5:
        return <ReviewsComponent uid={_uid} isMySelf={isMySelf}/>;
      case 6:
        return <LiKeComponent uid={_uid} isMySelf={isMySelf}/>;
      case 7:
        return <DisLikeComponent uid={_uid} isMySelf={isMySelf}/>;
      case 8:
        return <BlockComponent uid={_uid} isMySelf={isMySelf} USERMESSAGE={USERMESSAGE} initQuery={initQuery}/>;  
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
        !showDom ? null :
          (
            !edit ?  <div className={"user-message-box"}>
              {!initQuery.nouser &&
                  <div className={"following-box"}>
                 <div className={"following"}>
                    <h6>{userMsg.followers_count || 0}</h6>
                    <h5
                        onClick={()=>{
                          if((userMsg.followers_count || 0) === 0){
                            return;
                          }
                          followerRef && followerRef.current && followerRef.current.changeVisible &&
                          followerRef.current.changeVisible(true,"FOLLOWING",0);
                        }}
                        className={"border-none"}>FOLLOWING</h5>
                 </div>
                  <div className={"following"}>
                    <h6>{userMsg.following_count || 0}</h6>
                    <h5
                        onClick={()=>{
                          if((userMsg.following_count || 0) === 0){
                            return;
                          }
                          followerRef && followerRef.current && followerRef.current.changeVisible &&
                          followerRef.current.changeVisible(true,"FOLLOWERS",1);
                        }}
                    >FOLLOWERS</h5>
                  </div>
              </div>}
              {!initQuery.nouser && <div className="user-message-title">
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
                  {isMySelf && USERMESSAGE.role !== 1 &&
                  <div
                    onClick={()=>{
                      changeEdit(true)
                    }}
                    className={"edit"}>
                    EDIT PROFILE
                  </div>}
                  {
                    !isMySelf && !isVisitor(USERMESSAGE) &&
                      <div
                          onClick={()=>{
                            followOrNot({
                              o_uid : initQuery.uid,
                              f_uid : USERMESSAGE && USERMESSAGE.uid || null,
                              follow_status : !isFollow ? 1 : 0
                            }).then(res => {
                              if(res.code === 200){
                                message.success((!isFollow ? "follow" : "cancel")
                                    +" successfully")
                                const _userMsg = _.cloneDeep(userMsg);
                                if(!isFollow){
                                  _userMsg.following_count =(_userMsg.following_count || 0) + 1;
                                }else{
                                  _userMsg.following_count =(_userMsg.following_count || 0) - 1;
                                  _userMsg.following_count = _userMsg.following_count < 0 ? 0 : _userMsg.following_count;
                                }
                                changeUserMsg(_userMsg);
                                changeIsFollow(!isFollow);
                              }else{
                                message.error((!isFollow ? "follow" : "cancel")
                                    +" failed")
                              }
                            })
                          }}
                          className={!isFollow ? "follow-button" : "follow-button-cancel"}>{!isFollow ? "FOLLOW" : "CANCEL FOLLOW"}</div>
                  }
                  &nbsp;&nbsp;
                  {
                    !isMySelf && !isVisitor(USERMESSAGE) &&
                      <div
                          onClick={()=>{
                            blockOrNot({
                              b_uid : initQuery.uid,
                              o_uid : USERMESSAGE && USERMESSAGE.uid || null,
                              block_status : !isBlock ? 1 : 0
                            }).then(res => {
                              if(res.code === 200){
                                message.success((!isBlock ? "block" : "cancel")
                                    +" successfully")
                                changeIsBlock(!isBlock);
                              }else{
                                message.error((!isBlock ? "block" : "cancel")
                                    +" failed")
                              }
                            })
                          }}
                          className={!isBlock ? "follow-button" : "follow-button-cancel"}>{!isBlock ? "BLOCK" : "CANCEL BLOCK"}</div>
                  }  
                </div>
              </div>}
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
          )
      }
      <FollowComponent followRef={followerRef}
                       isMySelf={isMySelf}
                       USERMESSAGE={USERMESSAGE} initQuery={initQuery}/>

    </PageBase>
  )
}
UserMsg.getInitialProps = async (status) => {

  const profile = status && status.query && status.query.profile;
  const activeKey = status && status.query && status.query.activeKey <= 8 &&
    status.query.activeKey || "1";
  const nouser = status && status.query && status.query.nouser || null
  const uid = status && status.query && status.query.uid || null
  return {
    initQuery: {
      profile,
      activeKey,
      nouser,
      uid
    }
  }
}
export default UserMsg
