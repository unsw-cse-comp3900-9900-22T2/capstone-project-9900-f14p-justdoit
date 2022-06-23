
import React, { useState, useEffect,useRef } from 'react'
import SwiperCore, {
    Pagination,
    Scrollbar,
    A11y,
    EffectCoverflow,
    EffectCube,
    Autoplay,EffectFade, Navigation,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/swiper.less';
import 'swiper/components/pagination/pagination.less';
import SwiperImageStyle from "./SwiperImage.less"
import ImageDomComponent from "./ImageDom"
SwiperCore.use([Pagination, Autoplay, EffectCoverflow, EffectCube,EffectFade, Navigation]);
import _ from 'lodash'
import RatingComponent from "./Rating"
import ReviewsInfoComponent from "./ReviewsInfo"
const SwiperImage = ({list,isLogin}) => {
    const [imgList] = useState(list);
    const [visibility,changeVisibility] = useState(false)
    const ratingRef = useRef();
    const reviewsInfoRef = useRef();
  useEffect(()=>{
    setTimeout(()=>{
      changeVisibility(true)
    },0)
  },[])
    return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: SwiperImageStyle }} />
       <div style={{
         visibility : !visibility ? "hidden" : "initial"
       }}>
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          navigation
          pagination
          modules={[EffectFade, Navigation, Pagination]}
          className="home-swiper-list"
        >
            {
                imgList && imgList.map((item,index) => {
                    const imgDom = item && item.map((item2,index2) => {
                        return <ImageDomComponent item={item2}
                                                  index={index2}
                                                  isLogin={isLogin}
                                                  ratingRefChangeVisible={(movieName,year)=>{
                                                    const date = new Date();
                                                    const _year = year || date.getFullYear();
                                                    ratingRef && ratingRef.current && ratingRef.current.changeVisible
                                                    && ratingRef.current.changeVisible(true,movieName + "(" + _year+")");
                                                  }}
                                                  reviewsInfoRefVisible={(movieName,year)=>{
                                                    const date = new Date();
                                                    const _year = year || date.getFullYear();
                                                    reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                                                    && reviewsInfoRef.current.changeVisible(true,movieName + "(" + _year+")");
                                                  }}/>
                    })
                    return <SwiperSlide key={"swiper_" + index}>
                             <div className={"swiper-image-list-box"}>
                                    {imgDom}
                             </div>
                            </SwiperSlide>
                })
            }
        </Swiper>
       </div>
       <RatingComponent ratingRef={ratingRef}/>
       <ReviewsInfoComponent reviewsInfoRef={reviewsInfoRef}/>
     </React.Fragment>
    )
}

export default SwiperImage
