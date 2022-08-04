
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Modal, Avatar,Tooltip} from "antd";
import _ from 'lodash'
import {getFollowers} from "../../pages/MockData";
import {UserOutlined} from "@ant-design/icons";
import FollowStyle from "./Follow.less";
const Follow = ({followRef,USERMESSAGE,initQuery,isMySelf}) => {
    const [visible , changeVisible] = useState(false);
    const [title , changeTitle] = useState("");
    const [list,changeList] = useState([])
    useImperativeHandle(followRef, () => ({
      changeVisible: (vis,t,type) => {
          changeVisible(vis);
          changeTitle(t);
          changeList([])
          getFollowList(type)
      },
    }));
    function getFollowList(type){
           getFollowers({
               uid : isMySelf ? (USERMESSAGE && USERMESSAGE.uid) : initQuery.uid,
               target : type
           }).then(res => {
               if(res.code === 200){
                   const {result} = res;
                   if(result){
                      changeList(result.follow_lst || []);
                   }else{
                       changeList([])
                   }
               }else{
                   changeList([])
               }
           })
    }
    function goUserDetail(uid){
        if(!USERMESSAGE || !(USERMESSAGE.uid)){
            return;
        }
        if(!uid){
            return null
        }
        window.location.href = "/movie/userMsg?uid=" + uid
    }
    return (
      <React.Fragment>
          <style dangerouslySetInnerHTML={{
              __html : FollowStyle
          }}/>
      <Modal
        visible={visible}
        title={title || "FOLLOWING"}
        onCancel={()=>{
            changeVisible(false);
            changeList([])
        }}
        destroyOnClose={true}
        footer={null}>
          <div className={"follow-component"}>
              {
                  list && list.map((item,index) => {
                      return <div className={"follow-item"} key={"follow-item-" + index}>
                                  <Avatar
                                      onClick={()=>{
                                          goUserDetail(item.user_id);
                                      }}
                                      size={30}  icon={<UserOutlined />} />
                                      <Tooltip title={item.user_name}>
                                          <span className={"name"}>{item.user_name}</span>
                                      </Tooltip>

                              </div>
                  })
              }

          </div>

      </Modal>
      </React.Fragment>
    )
}

export default Follow
