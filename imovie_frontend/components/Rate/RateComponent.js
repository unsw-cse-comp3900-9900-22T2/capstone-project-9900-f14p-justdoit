
import React, { useState, useEffect,useRef ,createRef} from 'react'
import { Rate } from "antd";
import RateComponentStyle from "./RateComponent.less"
const RateComponent = ({style,defaultValue}) => {
  function setRating(rate) {
    const _rate = rate || 0;
    return Math.trunc(_rate*10 % 10 )
  }
  function setAvgRate(rate){
    let _rate = rate < 0 ? 0 : rate;
    const trunc = Math.trunc(_rate*10 % 10 );
    if(trunc < 5){
      _rate = _rate + 0.5;
    }
    return _rate;
  }
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: RateComponentStyle }} />
      <Rate
        style={style}
        className={`rating-box-title-rate-${setRating(defaultValue)} `}
            allowHalf disabled defaultValue={setAvgRate( defaultValue)}/>
     </React.Fragment>
    )
}

export default RateComponent
