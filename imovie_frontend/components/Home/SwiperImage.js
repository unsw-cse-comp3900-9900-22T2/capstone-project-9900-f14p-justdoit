
import React, { useState, useEffect,useRef ,createRef} from 'react'
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
import { getMovieDetail } from "../../pages/MockData";
const SwiperImage = ({list,isLogin,uid}) => {
    const [imgList,changeImgList] = useState(list);
    console.log("list".list)
    const [visibility,changeVisibility] = useState(false)
  useEffect(()=>{
    setTimeout(()=>{
      changeVisibility(true)
    },0)
  },[])
  const refList = [];
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
                    let beforeListLength = 0;
                    for(let i = 0 ; i < index ; i++){
                      beforeListLength += imgList[i].length
                    }
                    const length = item.length;
                    for(let x = 0 ; x < (4-length) ; x++){
                        item.push(null)
                    }
                    const imgDom = item && item.map((item2,index2) => {
                        const newRef = useRef();
                        refList.push(newRef);
                        if(!item2){
                            return <div className={"empty_box_for_image"}/>
                        }
                        return <ImageDomComponent
                                                  imageDomRef={newRef}
                                                  uid={uid}
                                                  item={item2}
                                                  index={index2}
                                                  isLogin={isLogin}
                                                 />
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
     </React.Fragment>
    )
}

export default SwiperImage
