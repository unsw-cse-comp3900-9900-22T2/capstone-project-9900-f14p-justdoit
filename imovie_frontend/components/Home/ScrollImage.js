
import React, { useState, useEffect, useRef } from 'react'
import SwiperImageComponent from "./SwiperImage"
import ScrollImageStyle from "./ScrollImage.less";
const ScrollImage = ({list,title,more,isLogin,uid,listCount}) => {
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ScrollImageStyle }} />
        {
          list && list.length > 0 &&
          <div className={"scroll-image-component"}>
            <div className={"scroll-image-component-title"}>
              <p>{title}</p>
              { !!listCount && listCount > 16 &&
                  <h6 onClick={()=>{
                      window.location.href = "/movie/homeMovieList?type=" + (title || "").replace(/\s*/g,"")
                  }}>More ></h6>}
            </div>
            <SwiperImageComponent uid={uid} isLogin={isLogin} list={list}/>
          </div>
        }
      </React.Fragment>
    )
}

export default ScrollImage
