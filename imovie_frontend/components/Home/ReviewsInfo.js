
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Modal, Input, message } from "antd";
import ReviewsInfoStyle from "./ReviewsInfo.less";
import { createReview } from "../../pages/MockData";
const { TextArea } = Input;
const ReviewsInfo = ({reviewsInfoRef}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [value,changeValue]=useState("");
   const [mid,changeMid] = useState("");
   const [uid,changeUid] = useState("");
    useImperativeHandle(reviewsInfoRef, () => ({
      changeVisible: (vis,movieName,_mid,_uid) => {
        changeMovieName(movieName);
        changeVisible(vis);
        changeUid(_uid);
        changeMid(_mid);
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ReviewsInfoStyle }} />
      <Modal
        title="Reviews and Info"
        centered
        visible={visible}
        okText="SUBMIT"
        cancelText={"CANCEL"}
        onOk={() =>{
          if(!value || !(value && value.trim())){
            message.warn("Please write you comment");
            return
          }
          createReview({
            review : value && value.trim(),
            uid,
            mid
          }).then(res => {
            if(res.code === 200){
              message.success("write comment success");
              changeVisible(false);
              changeValue("");
              changeMovieName("");
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
          <p>{movieName}</p>
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

export default ReviewsInfo
