
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'

import {Modal,Input} from "antd"
import ReviewsInfoStyle from "./ReviewsInfo.less";
const { TextArea } = Input;
const ReviewsInfo = ({reviewsInfoRef}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [value,changeValue]=useState("");
    useImperativeHandle(reviewsInfoRef, () => ({
      changeVisible: (vis,movieName) => {
        changeMovieName(movieName);
        changeVisible(vis);
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ReviewsInfoStyle }} />
      <Modal
        title="Reviews and Info"
        centered
        visible={visible}
        okText="submit"
        onOk={() =>{
          console.log("value",value)
          changeVisible(false);
          changeValue("");
          changeMovieName("");
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
