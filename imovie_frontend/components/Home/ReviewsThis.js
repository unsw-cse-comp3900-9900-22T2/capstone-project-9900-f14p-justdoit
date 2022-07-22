
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Modal, Input, message } from "antd";
import ReviewsInfoStyle from "./ReviewsInfo.less";
import {replyReview} from "../../pages/MockData";
const { TextArea } = Input;
const ReviewsThis = ({reviewsThisRef,changeReview}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [value,changeValue]=useState("");
   const [mrid,changeMrid] = useState("");
   const [uid,changeUid] = useState("");
    useImperativeHandle(reviewsThisRef, () => ({
      changeVisible: (vis,movieName,_mrid,_uid) => {
        changeMovieName(movieName);
        changeVisible(vis);
        changeUid(_uid);
        changeMrid(_mrid);
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ReviewsInfoStyle }} />
      <Modal
        title={"Review to " + movieName}
        centered
        visible={visible}
        okText="SUBMIT"
        cancelText={"CANCEL"}
        onOk={() =>{
          if(!value || !(value && value.trim())){
            message.warn("Please write you comment");
            return
          }
          replyReview({
            review : value && value.trim(),
            uid,
            mrid
          }).then(res => {
            if(res.code === 200){
              message.success("write comment success");
              changeVisible(false);
              changeValue("");
              changeMovieName("");
              changeReview && changeReview();
            }else{
              message.error("write comment failed");
            }
          })
        }}
        onCancel={() => {
          changeVisible(false);
          changeValue("");
          changeMovieName("");
        }}
        width={800}
      >
        <div className={"review-component"}>
          <div className={"review-box"}>
                <TextArea
                  value={value}
                  onChange={(e)=>{
                    changeValue(e.target.value || '')
                  }}
                  placeholder="Writing you comment"
                  maxLength={800}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
          </div>
          <div className={"valueLength"}>
            {value.length}/800
          </div>
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default ReviewsThis
