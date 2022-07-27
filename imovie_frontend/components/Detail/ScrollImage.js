
import React, { useState, useEffect, useRef } from 'react'
import SwiperImageComponent from "../Home/SwiperImage"
import ScrollImageStyle from "./ScrollImage.less";
const ScrollImage = ({list,title,more,isLogin,goHrefMore,uid,listCount}) => {
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ScrollImageStyle }} />
        <div className={`scroll-image-component ${(!list || list.length <=1 )&& "scroll-image-component-no-pre-next"}`}>
            <div className={"scroll-image-component-title"}>
              <p>{title}</p>
                { !!listCount && listCount > 16 &&
                    <h6 onClick={()=>{
                  goHrefMore && goHrefMore();
              }}>More ></h6>}
            </div>
            <SwiperImageComponent uid={uid}  isLogin={isLogin} list={list}/>
        </div>
      </React.Fragment>
    )
}

export default ScrollImage
