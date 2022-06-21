
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
SwiperCore.use([Pagination, Autoplay, EffectCoverflow, EffectCube,EffectFade, Navigation]);
import {EyeOutlined,LikeOutlined,HeartOutlined,EllipsisOutlined} from '@ant-design/icons'
import { Rate,Popover ,Tooltip} from 'antd';
import _ from 'lodash'
import RatingComponent from "./Rating"
import ReviewsInfoComponent from "./ReviewsInfo"
const SwiperImage = ({list}) => {
    const [imgList,changeImgList] = useState(list);
    const [visibility,changeVisibility] = useState(false)
    const [mouseList,changeMouseList] = useState("");
    const ratingRef = useRef();
    const reviewsInfoRef = useRef();
    function getMsg(number){
      if (!number && number !== 0) return number;
      var str_num
      if (number >= 1000 && number < 10000) {
        str_num = (number / 1000).toFixed(2);
        return str_num + 'k'
      }else if (number >= 10000) {
        str_num = (number / 10000).toFixed(2);
        return str_num + 'k'
      } else {
        return number
      }
    }
    function goMovieDetail(id) {
      window.location.href = "/movie/detail?movieId=" + id;
    }
    function changeOperation(type,index,index2) {
      const _type = type === 0 ? "isLike" : type === 1 ?  "isLook" : type === 2 ? "isCollection" : "isDisLike";
      const _imgList = _.cloneDeep(imgList);
      const is = _imgList[index][index2][_type];
      _imgList[index][index2][_type] = !is;
      changeImgList(_imgList);
    }
    function svgGet(type ,isGet){
      if(type === 0){
        if(isGet){
          return <img src={"/static/likeTrue.png"}/>
        }else{
          return <img src={"/static/likeFalse.png"}/>
        }
      }else if(type === 1){
        if(isGet){
          return <img src={"/static/lookTrue.png"}/>
        }else{
          return <img src={"/static/lookFalse.png"}/>
        }
      }else if(type === 2){
        if(isGet){
          return <img src={"/static/collentTrue.png"}/>
        }else{
           return <img src={"/static/collentFalse.png"}/>
        }
      }
    }
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
                      const {director,cast,tags,rate,movieName,
                        isLike,isLook,isCollection,year,isDisLike,
                        look,like,collection,image} = item2;
                      const _nameList = [...(director || []),...(cast || [])];

                        return <div className={"swiper-image-list-item"}
                                    key={"swiper_child_" + index2}>
                                     <Tooltip
                                       mouseEnterDelay={0.2}
                                       placement={"rightTop"}
                                       trigger="hover"
                                       zIndex={12}
                                       title={ <div  className={"swiper-image-list-item-image-black"}>
                                           <h6
                                             onClick={()=>{
                                               goMovieDetail(item2.movieId);
                                             }}
                                           >{movieName}</h6>
                                           <div className={"rate_msg"}>
                                             <Rate disabled defaultValue={rate || 1} />
                                             <span className={"rate_msg_get"}>({rate || 1})</span>
                                           </div>
                                           {tags && tags.length > 0 &&<div className={"tags"}>
                                             {
                                               tags && tags.map((tagItem,tagIndex) => {
                                                 return <div className={"tags-item"} key={"tags-item-" + tagIndex}>
                                                   {tagItem.value}
                                                 </div>
                                               })
                                             }
                                           </div>}
                                           {
                                             _nameList && _nameList.length > 0 && <div className={"cast"}>
                                               {_nameList.join(",")}
                                             </div>
                                           }
                                           <div className={"operation"}>
                                             <div
                                               onClick={()=>{
                                                 changeOperation(1,index,index2)
                                               }}
                                               className={"operation-image"}>{
                                               svgGet(1,isLook)
                                             }</div>
                                             <div
                                               onClick={()=>{
                                                 changeOperation(0,index,index2)
                                               }}
                                               className={"operation-image"}>{
                                               svgGet(0,isLike)
                                             }</div>
                                             <div
                                               onClick={()=>{
                                                 changeOperation(2,index,index2)
                                               }}
                                               className={"operation-image"}>{
                                               svgGet(2,isCollection)
                                             }</div>
                                             <Popover
                                               zIndex={13}
                                               overlayClassName='popUpStatus'
                                               placement="rightTop" title={"More Operation"} content={()=>{
                                               return <div className={"swiper-component-operation"}>
                                                 <div
                                                   onClick={()=>{
                                                     const date = new Date();
                                                     const _year = year || date.getFullYear();
                                                     ratingRef && ratingRef.current && ratingRef.current.changeVisible
                                                     && ratingRef.current.changeVisible(true,movieName + "(" + _year+")");
                                                     changeMouseList("");
                                                   }}
                                                   className={"swiper-component-operation-item padding1"}>
                                                   Rating
                                                 </div>
                                                 <div
                                                   onClick={()=>{
                                                     const date = new Date();
                                                     const _year = year || date.getFullYear();
                                                     reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                                                     && reviewsInfoRef.current.changeVisible(true,movieName + "(" + _year+")");
                                                     changeMouseList("");
                                                   }}
                                                   className={"swiper-component-operation-item"}>
                                                   Reviews and info
                                                 </div>
                                                 <div
                                                   onClick={()=>{
                                                     changeOperation(3,index,index2)
                                                   }}
                                                   className={"swiper-component-operation-item border-no padding2"}>
                                                   {isDisLike ? "Cancel DisLike" : "DisLike"}
                                                 </div>
                                               </div>
                                             }}>
                                               <div
                                                 className={"operation-image"}>
                                                 <EllipsisOutlined  style={{
                                                   fontSize : "18px",
                                                   cursor : "pointer"
                                                 }}/>
                                               </div>
                                             </Popover>
                                           </div>
                                         </div>
                                       }
                                     >
                                        <div
                                          onClick={()=>{
                                            goMovieDetail(item2.movieId);
                                          }}
                                          style={{
                                              backgroundImage : "url(" +image +")"
                                          }}
                                          className={"swiper-image-list-item-image"}/>
                                     </Tooltip>
                                     <div className={"image-message"}>
                                         <h6 onClick={()=>{
                                           goMovieDetail(item2.movieId);
                                         }}>{movieName}</h6>
                                         <div className={"image-message-show"}>
                                              <div className={"image-message-show-icon"}>
                                                  <img src={"/static/lookTrue.png"}/>
                                                  &nbsp;
                                                <span style={{color :"#00e054" }}>{getMsg(look)}</span>
                                              </div>
                                             <div className={"image-message-show-icon"}>
                                               <img src={"/static/likeTrue.png"}/>
                                               &nbsp;
                                               <span style={{color :"#40bcf4" }}>{getMsg(like)}</span>
                                             </div>
                                             <div className={"image-message-show-icon"}>
                                               <img src={"/static/collentTrue.png"}/>
                                               &nbsp;
                                               <span style={{color :"#ff900f" }}>{getMsg(collection)}</span>
                                             </div>
                                         </div>
                                     </div>
                                </div>
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
