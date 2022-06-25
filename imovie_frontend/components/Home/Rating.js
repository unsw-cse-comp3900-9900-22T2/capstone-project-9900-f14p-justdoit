
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {Modal,Rate,message} from "antd"
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
        changeRate(rate)
      },
    }));
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: RatingStyle }} />
      <Modal
        title="Rating"
        centered
        visible={visible}
        okText="submit"
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
               message.success("rating movie success");
               changeVisible(false);
               changeRate(0);
               changeMovieName("");
               changeRating && changeRating(mid,rate,res.result && res.result.avg_rate || 0);
             }else{
               message.error("rating movie error");
             }
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
              tooltips={desc} onChange={changeRate}  defaultValue={rate} />
          </div>
        </div>
      </Modal>
      </React.Fragment>
    )
}

export default Rating
