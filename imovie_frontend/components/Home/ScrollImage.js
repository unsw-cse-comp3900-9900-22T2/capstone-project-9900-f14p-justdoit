
import React, { useState, useEffect, useRef } from 'react'
import SwiperImageComponent from "./SwiperImage"
import "./ScrollImage.less"
const ScrollImage = ({list,title,more}) => {
    return (
      <div className={"scroll-image-component"}>
          <div className={"scroll-image-component-title"}>
            <p>{title}</p>
          </div>
          <SwiperImageComponent list={list}/>
      </div>
    )
}

export default ScrollImage
