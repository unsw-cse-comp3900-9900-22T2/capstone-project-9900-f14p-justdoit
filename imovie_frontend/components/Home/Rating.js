
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {Modal,Rate,message} from "antd"
import {CloseOutlined} from "@ant-design/icons";
import RatingStyle from "./Rating.less";
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
import {ratingMovie} from "../../pages/MockData";
const Rating = ({ratingRef,changeRating}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [mid,changeMid] = useState(null);
  const [uid,changeUid] = useState(null);
  const [onHover,changeOnHover] = useState(false);
  const [hoverRate,changeHoverRate] = useState(0);
   const [rate,changeRate] = useState(0);
    useImperativeHandle(ratingRef, () => ({
      changeVisible: (vis,movieName,mid,uid,rate) => {
        changeMovieName(movieName);
        changeVisible(vis);
        changeMid(mid);
        changeUid(uid);
        changeRate(rate < 0 ? 0 : rate)
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: RatingStyle }} />
      <Modal
        title="RATE THIS"
        centered
        visible={visible}
        okText="SUBMIT"
        cancelText={"CANCEL"}
        destroyOnClose={true}
        onOk={() =>{
          if(!mid){
            message.warn("no mid");
            return
          }
          if(!uid){
            message.warn("no uid");
            return
          }

          ratingMovie({
            mid,
            uid,
            rate
          }).then(res => {
             if(res.code === 200){
               if(!!rate){
                 message.success("Rated movie successfully");
               }

               changeVisible(false);
               changeRate(0);
               changeMovieName("");
               changeRating && changeRating(mid,rate,res.result && res.result.avg_rate || 0);
             }else{
               message.error("Rated movie failed");
             }
          }).catch(err =>{
            message.error("Rated movie failed");
            changeVisible(false);
            changeRate(0);
            changeMovieName("");
            changeRating && changeRating(mid,rate,rate);
          })
        }}
        onCancel={() => {
          changeVisible(false);
          changeRate(0);
          changeMovieName("");
        }}
        width={400}
      >
        <div className={"rating-component"}>
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
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default Rating
