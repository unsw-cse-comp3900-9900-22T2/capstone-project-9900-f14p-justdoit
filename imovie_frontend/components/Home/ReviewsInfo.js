
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {Modal, Input, message, Rate} from "antd";
import ReviewsInfoStyle from "./ReviewsInfo.less";
import {createReview, ratingMovie} from "../../pages/MockData";
import {CloseOutlined} from "@ant-design/icons";
const { TextArea } = Input;
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const ReviewsInfo = ({reviewsInfoRef,changeReview,changeRating}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [value,changeValue]=useState("");
   const [mid,changeMid] = useState("");
   const [uid,changeUid] = useState("");
    const [onHover,changeOnHover] = useState(false);
    const [hoverRate,changeHoverRate] = useState(0);
    const [rate,changeRate] = useState(0);
    const [initRate,changeInitRate] = useState(0);
    useImperativeHandle(reviewsInfoRef, () => ({
      changeVisible: (vis,movieName,_mid,_uid,rate) => {
        changeMovieName(movieName);
        changeVisible(vis);
        changeUid(_uid);
        changeMid(_mid);
        changeRate(rate < 0 ? 0 : rate);
        changeInitRate(rate < 0 ? 0 : rate);
      },
    }));
    function createReviewPro(value){
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
                changeReview && changeReview();
            }else{
                message.error("write comment failed");
            }
        })
    }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ReviewsInfoStyle }} />
      <Modal
        title={"Add review and rating"}
        centered
        visible={visible}
        okText="SUBMIT"
        cancelText={"CANCEL"}
        onOk={() =>{
          if(!value || !(value && value.trim())){
            message.warn("Please write you comment");
            return
          }
            if(rate !== initRate){
                ratingMovie({
                    mid,
                    uid,
                    rate
                }).then(res => {
                    if(res.code === 200){
                        changeRate(0);
                        changeRating && changeRating(mid,rate,res.result && res.result.avg_rate || 0);
                    }
                    createReviewPro(value);
                })
            }else{
                createReviewPro(value);
            }
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
            <h6>{onHover ? (hoverRate || 0): (rate || 0)}/5</h6>
            <div className={"rate-box"}>
                <Rate
                    style={{
                        fontSize: 36,
                    }}
                    allowHalf
                    onHoverChange={(number)=>{
                        changeOnHover(!!number);
                        changeHoverRate(number);
                    }}
                    tooltips={desc} onChange={changeRate} value={rate} defaultValue={rate} />
                {
                    !!rate && rate > 0 && <CloseOutlined
                        onClick={()=>{
                            changeOnHover(false);
                            changeHoverRate(0);
                            changeRate(0);
                        }}
                        className={"clear-rate"}/>
                }
            </div>
          <div className={"review-box"}>
                <TextArea
                  value={value}
                  onChange={(e)=>{
                    changeValue(e.target.value || '')
                  }}
                  placeholder="Add your review"
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
