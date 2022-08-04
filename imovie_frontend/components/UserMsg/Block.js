
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Modal, Avatar,Tooltip,Popconfirm,message} from "antd";
import _ from 'lodash'
import {getBlockers,blockOrNot} from "../../pages/MockData";
import {UserOutlined,DeleteOutlined,ExclamationCircleOutlined} from "@ant-design/icons";
import BlockStyle from "./Block.less";
const Block = ({uid,USERMESSAGE,initQuery,isMySelf}) => {
    const [visible , changeVisible] = useState(true);
    const [title , changeTitle] = useState("");
    const [list,changeList] = useState([])
    useEffect(()=>{
        // changeList([])
        getFollowList()
    },[])
    function getFollowList(){     
        getBlockers({
            uid : uid
        }).then(res => {
            if(res.code === 200){
                const {result} = res;
                if(result){
                    changeList(result.block_lst || []);
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
        <style>
            {`
                .ant-popover{
                    transform-origin:70% 100px!important
                }
                `}
        </style>
          <style dangerouslySetInnerHTML={{
              __html : BlockStyle
          }}/>
          <div className="BlockComponent">
              <div className={"title-box"}>
                  <p className="title">
                    You have blocked
                  </p>            
              </div>
              <div>
                <div className={"blockers-box"}>
                    { list && list.map((item,index)=>{
                        return <div className={"blockers-item"}>
                                    <div className={"blockers-icon"}>
                                    <UserOutlined 
                                        onClick={()=>{
                                            goUserDetail(item.user_id)
                                    }}/>
                                    </div>
                                    <div className={"blockers-detail-box"}>
                                        <div className={"blocker"}
                                                onClick={()=>{
                                                    goUserDetail(item.user_id)}}>
                                        <div
                                            className={"blockers-body"}
                                            >
                                            <Tooltip
                                            placement="top" title={item.user_name}>
                                                {item.user_name}
                                            </Tooltip>
                                        </div>
                                        </div>
                                    
                                        <div className={"blockers-active"}>
                                        <Popconfirm
                                            title="Are you sure to remove this user from blocklist?"
                                            okText="YES"
                                            cancelText="NO"
                                            onConfirm={()=>{
                                                blockOrNot({
                                                    b_uid : item.user_id,
                                                    o_uid : USERMESSAGE && USERMESSAGE.uid || null,
                                                    block_status : 0
                                                  }).then(res => {
                                                    if(res.code === 200){
                                                      message.success("remove successfully");
                                                      getFollowList();
                                                    }else{
                                                      message.error("fail to remove");
                                                    }
                                                  })}}
                                        >
                                        <DeleteOutlined              
                                            className={"del"}/>
                                        </Popconfirm>
                                        </div>
                                    </div>
                                </div>
                    }
                    )
                    }
                    {
                        list.length === 0 &&
                          <div className={"empty"}>
                              <img src={"/static/empty.png"}/>
                              <h5>
                                No block users yet
                              </h5>
                          </div>
                    }
                </div>
              </div>
        </div>
      </React.Fragment>
    )
}

export default Block
