
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Modal, Avatar,Tooltip} from "antd";
import _ from 'lodash'
import {rateDistribution} from "../../pages/MockData";
import {UserOutlined} from "@ant-design/icons";
import FollowStyle from "../UserMsg/Follow.less";
const RatingPerson = ({ratingPersonRef,USERMESSAGE}) => {
    const [visible , changeVisible] = useState(false);
    const [list,changeList] = useState([])
    useImperativeHandle(ratingPersonRef, () => ({
      changeVisible: (vis,rating,mid) => {
          changeVisible(vis);
          changeList([])
          getFollowList(rating,mid)
      },
    }));
    function getFollowList(rating,mid){

        rateDistribution({
               mid,
               rating : rating + ""
           }).then(res => {
               if(res.code === 200){
                   const {result} = res;
                   if(result){
                      changeList(result.userList || []);
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
        title={ "Ratings"}
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
                                          goUserDetail(item.uid);
                                      }}
                                      size={30}  icon={<UserOutlined />} />
                                      <Tooltip title={item.username}>
                                          <span className={"name"}>{item.username}</span>
                                      </Tooltip>

                              </div>
                  })
              }

          </div>

      </Modal>
      </React.Fragment>
    )
}

export default RatingPerson
