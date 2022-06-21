
import React, { useState, useEffect, useRef } from 'react'
import SwiperImageComponent from "./SwiperImage"
import ScrollImageStyle from "./ScrollImage.less";
const ScrollImage = ({list,title,more,isLogin}) => {
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ScrollImageStyle }} />
        <div className={"scroll-image-component"}>
            <div className={"scroll-image-component-title"}>
              <p>{title}</p>
              <h6>More</h6>
            </div>
            <SwiperImageComponent isLogin={isLogin} list={list}/>
        </div>
      </React.Fragment>
    )
}

export default ScrollImage
