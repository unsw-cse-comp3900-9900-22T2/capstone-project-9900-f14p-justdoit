import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import detailStyle from "./detail.less";
import {getMsg} from "../../util/common";
import { Avatar, Popover, Rate } from "antd";
import _ from "lodash";
import RatingComponent from "../../components/Home/Rating"
import { UserOutlined } from "@ant-design/icons";
import ReviewsInfoComponent from "../../components/Home/ReviewsInfo";
import ScrollImageComponent from "../../components/Detail/ScrollImage";
const Detail = ({USERMESSAGE}) => {
  const [isLogin] = useState(!!USERMESSAGE);
  const [detailMsgLook,changeDetailMsgLook] = useState(false);
  const [movieDetail,changeMovieDetail]=useState({
    movieId :123323,
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :23000,
    like :24,
    isLike : false,
    isLook : false,
    isCollection : false,
    isDisLike : false,
    collection : 256,
    rate : 3.5,
    year : "2022",
    geners : [{
      value : "Renre",
      key : 1,
    },{
      value : "Renre1",
      key : 2,
    },{
      value : "Renre2",
      key : 3,
    }],
    movieName : "movie name",
    director : ["jerry jackson"],
    castList : ["Tom","Haidi"],
    prodecers : "Steven Spielberg Frank Marshall Patrick Crowley Alexandra Ferguson Colin Trevorrow",
    writers : "Colin Trevorrow Derek Connolly Emily Carmichael",
    cast : "Chris Pratt Bryce Dallas Howard Lauro Dern Jeff Goldblum Sam Neill DeWanda Wise Mamoudou Athic " +
      "Campbell Scott BD Wong Omar Sy Justice Smith Daniella Pineda Scott Haze Dichen Lochman Caleb I" +
      "Poloha Freya Parker Alexander Owen Joel Elferink Elva Trill Lillia Langley" ,
    detail : "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancemen\n" +
      "ground him, Pete \"Moverick\" Mitchell finds himself training a detachment of TOP GUN graduates for a\n" +
      "the likes of which no living pilot has ever seen After more than thirty years of service as one of the Navy's top aviators, and dodging the advancemen\n" +
      "ground him, Pete \"Moverick\" Mitchell finds himself training a detachment of TOP GUN graduates for a\n" +
      "the likes of which no living pilot has ever seen",
    length : "146"
  });
  const [reviewsList,changeReviewsList] = useState([{
     userName : "amber",
     rate: 3.6,
     reviews : "kjshfjksdhajksdhahdjah ashdjahsjdkha ashdjkahsjkdqiuwyuqiwyruiwr ashdhajksdhajkd hquwyruqiwyruiw wiquyruiwqyr we",
     likes : 2000,
     userIsLike : false
  },{
    userName : "jerry",
    rate: 3.6,
    reviews : "kjshfjksdhajksdhahdjah ashdjahsjdkha ashdjkahsjkdqiuwyuqiwyruiwr ashdhajksdhajkd hquwyruqiwyruiw wiquyruiwqyr we",
    likes : 1000,
    userIsLike : true
  }])
  const [recommendList,changeRecommendList] = useState([ [{
    movieId :123323,
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :23000,
    like :24,
    isLike : false,
    isLook : false,
    isCollection : false,
    collection : 256,
    rate : 3,
    year : "2022",
    tags : [{
      value : "Renre",
      key : 1,
    },{
      value : "Renre1",
      key : 2,
    },{
      value : "Renre2",
      key : 3,
    }],
    movieName : "movie name",
    director : ["jerry jackson"],
    cast : ["Tom","Haidi"]
  },{
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :24,
    like :24,
    collection : 256,
    movieName : "movie name"
  },{
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :25,
    like :24,
    collection : 256,
    movieName : "movie name"
  },{
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :26,
    like :24,
    collection : 256,
    movieName : "movie name"
  }]])
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
  useEffect(()=>{
  },[]);
  function setGeners(list) {
    if(!list){
      return null;
    }
    const name = [];
    for(let i = 0 ; i < list.length ; i++){
      name.push(list[i].value);
    }
    return name.join(" / ")
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
    }else if(type === 3){
      if(isGet){
        return <img src={"/static/dislikeTrue.png"}/>
      }else{
        return <img src={"/static/dislikeFalse.png"}/>
      }
    }
  }
  function changeOperation(type) {
    const _type = type === 0 ? "isLike" : type === 1 ?  "isLook" : type === 2 ? "isCollection" : "isDisLike";
    const _movieDetail = _.cloneDeep(movieDetail);
    const is = _movieDetail[_type];
    _movieDetail[_type] = !is;
    changeMovieDetail(_movieDetail);
  }
  function getDetailMsg(msg) {
      if(!msg){
        return null
      }
     const length = msg.length;
      if(length >= 400 && !detailMsgLook){
        const beforeMsg = msg.slice(0, 400);
        return <>
            {beforeMsg}
            <span
              onClick={()=>{
                changeDetailMsgLook(true)
              }}
              className={"lookMore"}>LOOK MORE</span>
          </>
      }else{
        return msg;
      }
  }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: detailStyle }} />
      <div className={"movie-detail-box"}>
          <p className={"movie-name"}>{movieDetail.movieName}({movieDetail.year})</p>
          <div className={"movie-msg-box"}>
            <div className={"movie-msg-box-left"}>
              <div
                style={{
                  backgroundImage : "url(" +movieDetail.image +")"
                }}
                className={"movie-logo"}/>
              <div className={"movie-message-show"}>
                <div className={"image-message-show-icon"}>
                  <img src={"/static/lookTrue.png"}/>
                  &nbsp;
                  <span style={{color :"#00e054" }}>{getMsg(movieDetail.look)}</span>
                </div>
                <div className={"image-message-show-icon"}>
                  <img src={"/static/likeTrue.png"}/>
                  &nbsp;
                  <span style={{color :"#40bcf4" }}>{getMsg(movieDetail.like)}</span>
                </div>
                <div className={"image-message-show-icon"}>
                  <img src={"/static/collentTrue.png"}/>
                  &nbsp;
                  <span style={{color :"#ff900f" }}>{getMsg(movieDetail.collection)}</span>
                </div>
              </div>
              <div className={"rating"}>
                <h6 className={"rating-title"}>Ratings:</h6>
                <div className={"rating-box"}>
                  <h5 className={"rating-box-title"}>{movieDetail.rate}</h5>
                  <Rate allowHalf disabled defaultValue={movieDetail.rate || 1} />
                </div>
              </div>
            </div>
            <div className={"movie-msg-box-right"}>
                <div className={"movie-message-body movie-message-body-flex"}>
                  <p>DIRECTOR: </p>
                  <h6>{movieDetail.director}</h6>
                </div>
              <div className={"movie-message-body"}>
                <p>PRODUCERS: </p>
                <h6>{movieDetail.prodecers}</h6>
              </div>
              <div className={"movie-message-body"}>
                <p>WRITERS: </p>
                <h6>{movieDetail.writers}</h6>
              </div>
              <div className={"movie-message-body"}>
                <p>CAST: </p>
                <h6>{movieDetail.cast}</h6>
              </div>
              <div className={"movie-message-body"}>
                <p>DETAILS: </p>
                <h6>{getDetailMsg(movieDetail.detail)}</h6>
              </div>
              <div className={"movie-message-body"}>
                <p>GENRES: </p>
                <h6>{setGeners(movieDetail.geners)}</h6>
              </div>
              <div className={"movie-message-body movie-message-body-flex"}>
                <p>LENGTH: </p>
                <h6>{movieDetail.length}min</h6>
              </div>
            </div>
            {
              !!isLogin && <div className={"operation"}>
                <div className={"operation-image"}>
                  <div
                    onClick={()=>{
                      changeOperation(1)
                    }}
                    className={"image-box"}>{svgGet(1,movieDetail.isLook)}</div>
                  <div className={"a-href"}>
                    watch
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={()=>{
                      changeOperation(2)
                    }}
                    className={"image-box"}> {svgGet(2,movieDetail.isCollection)}</div>
                  <div className={"a-href"}>
                    wishLists
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={()=>{
                      changeOperation(0)
                    }}
                    className={"image-box"}>{svgGet(0,movieDetail.isLike)}</div>
                  <div className={"a-href"}>
                    like
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={()=>{
                      changeOperation(3)
                    }}
                    className={"image-box"}>{svgGet(3,movieDetail.isDisLike)}</div>
                  <div className={"a-href"}>
                    disLike
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={()=>{
                      const date = new Date();
                      const _year = movieDetail.year || date.getFullYear();
                      ratingRef && ratingRef.current && ratingRef.current.changeVisible
                      && ratingRef.current.changeVisible(true,movieDetail.movieName + "(" + _year+")");
                    }}
                    className={"image-box"}>
                    <img src={"/static/star.png"}/>
                  </div>
                  <div className={"a-href a-href-no"}>
                    rating
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={"reviews-list"}>
              <div className={"review-title"}>
                <p>Related Reviews{!!isLogin && <span  onClick={()=>{
                                              const date = new Date();
                                              const _year = movieDetail.year || date.getFullYear();
                                              reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                                              && reviewsInfoRef.current.changeVisible(true,movieDetail.movieName + "(" + _year+")");
                                            }}
                >add review</span>}</p>
                <div className={"review-more"}>
                  More >
                </div>
              </div>
              <div className={"review-box"}>
                {reviewsList && reviewsList.map((item,index)=>{
                  return <div className={`review-box-item ${index === reviewsList.length - 1 && "review-box-item-no-border" || ""}`}
                              key={"review-box-item-" + index}>
                     <div className={"user-logo"}>
                       <Avatar size={40}  icon={<UserOutlined />} />
                     </div>
                     <div className={"review-body"}>
                        <div className={"user-name"}>
                          <span className={"userName"}>Review By:<span>{item.userName}</span></span>
                            <div className={"rate"}>
                               <Rate  style={{
                                  fontSize : "14px"
                               }} allowHalf disabled defaultValue={item.rate || 1} />
                                &nbsp;({item.rate || 1})
                            </div>
                        </div>
                        <div className={`review-body-msg ${!isLogin && "review-body-msg-margin-bottom" || ""}`}>
                          {item.reviews}
                        </div>
                       {!!isLogin && <div className={"operation"}>
                         <div className={"operation-like"}>
                           <div
                             onClick={()=>{
                               const _reviewsList = _.cloneDeep(reviewsList);
                               const isLike = _reviewsList[index].userIsLike;
                               _reviewsList[index].userIsLike = !isLike;
                               changeReviewsList(_reviewsList);
                             }}
                             className={"image-box"}>{svgGet(0,item.userIsLike)}</div>
                           <div className={"a-href"}>
                             {item.userIsLike &&  "Like review"}
                           </div>
                         </div>
                         <div className={"operation-like-number"}>
                           {getMsg(item.likes)} Likes
                         </div>
                       </div>}
                     </div>
                  </div>
                })}
              </div>
          </div>
      </div>
      <ScrollImageComponent isLogin={isLogin} list={recommendList} title={"RECOMMEND"}/>
      <RatingComponent  ratingRef={ratingRef}/>
      <ReviewsInfoComponent reviewsInfoRef={reviewsInfoRef}/>
    </PageBase>
  )
}

export default Detail
