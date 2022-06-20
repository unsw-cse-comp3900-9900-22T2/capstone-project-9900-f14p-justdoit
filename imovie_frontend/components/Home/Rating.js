
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import "./Rating.less"
import {Modal,Rate} from "antd"
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
const Rating = ({ratingRef}) => {
   const [visible ,changeVisible] = useState(false);
   const [movieName , changeMovieName] = useState("");
   const [rate,changeRate] = useState(0);
    useImperativeHandle(ratingRef, () => ({
      changeVisible: (vis,movieName) => {
        changeMovieName(movieName);
        changeVisible(vis);
      },
    }));
    return (
      <Modal
        title="Rating"
        centered
        visible={visible}
        okText="submit"
        onOk={() =>{
          changeVisible(false);
          changeRate(0);
          changeMovieName("");
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
          <h6>{rate}/5</h6>
          <div className={"rate-box"}>
            <Rate
              style={{
                fontSize: 36,
              }}
              tooltips={desc} onChange={changeRate} value={rate} />
          </div>
        </div>
      </Modal>
    )
}

export default Rating
