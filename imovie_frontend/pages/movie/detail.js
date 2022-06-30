import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import detailStyle from "./detail.less";
import { Avatar, Popover, Rate ,message,Tooltip} from "antd";
import _ from "lodash";
import RatingComponent from "../../components/Home/Rating"
import { UserOutlined } from "@ant-design/icons";
import ReviewsInfoComponent from "../../components/Home/ReviewsInfo";
import ScrollImageComponent from "../../components/Detail/ScrollImage";
import { wishlistAddOrDelete, getMovieDetail } from "../MockData";
import RateComponent from "../../components/Rate/RateComponent"
const Detail = ({USERMESSAGE,initQuery}) => {
  const [isLogin] = useState(!!USERMESSAGE);
  const [detailMsgLook,changeDetailMsgLook] = useState(false);
  const [movieDetail,changeMovieDetail]=useState(null);
  const [rateChange,changeRateChange] = useState(true)
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
    if(initQuery && initQuery.movieId){
      getMovieDetail({
        uid : USERMESSAGE && USERMESSAGE.uid || null,
        mid : initQuery.movieId
      }).then(res => {
        if(res.code === 200){
           const {result} = res;
          changeMovieDetail(result || null);
        }
      }).catch(err => {
        const result = {
          "avg_rate": null,
          "cast": null,
          "coverimage": "https://a.ltrbxd.com/resized/sm/upload/hf/o9/fn/p4/adogswill-ms-0-230-0-345-crop.jpg?k=c61671eb55",
          "crew": null,
          "description": "The (mis)adventures of João Grilo and Chicó in Brazil's Northeastern region. The four-chapter miniseries original version of O Auto da Compadecida.",
          "director": "Guel Arraes",
          "genre": [
            "comedy",
            "drama"
          ],
          "is_user_dislike": 0,
          "is_user_like": 0,
          "is_user_watch": 0,
          "is_user_wish": 0,
          "is_user_rate" : 2,
          "language": "Portuguese",
          "moviename": "A Dog's Will",
          "num_like": 0,
          "release_date": null,
          "watchlist_num": 0,
          "wishlist_num": 0,
          "duration": 123,
          "mid" : "adkjahdjkahdjkadsh"
        }
        changeMovieDetail(result)
      })
    }

  },[]);
  function setGeners(list) {
    if(!list){
      return null;
    }
    const name = [];
    for(let i = 0 ; i < list.length ; i++){
      if(!!list[i]){
        name.push(list[i]);
      }
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
    const _type = type === 0 ? "is_user_like" : type === 1 ?  "is_user_watch" : type === 2 ? "is_user_wish" : "is_user_dislike";
    const _movieDetail = _.cloneDeep(movieDetail);
    const is = _movieDetail[_type];
    _movieDetail[_type] = !is;
    if(type === 2){
        wishlistAddOrDelete({
          mid : movieDetail.mid,
          uid : USERMESSAGE && USERMESSAGE.uid,
            add_or_del : !is ? "add" : "delete",
        }).then(res => {
          if(res.code === 200){
            if(!is){
              message.success("add success");
              _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) + 1;
            }else{
              message.success("delete success");
              _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
            }
            changeMovieDetail(_movieDetail);
          }else{
            if(!is) {
              message.error("add fail")
            }else{
              message.error("delete fail")
            }
          }
        })
    }else{
      changeMovieDetail(_movieDetail);
    }
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
  function setYear(year) {
    if(!year){
      return null
    }
    return "(" + year + ")"
  }
  function setAvgRate(rate){
    return rate < 0 ? 0 : rate;
  }
  function setToolTitle(type,number){
    return type + " by " + (number || 0) +" " + (number && number > 1 && "members" || "member");
  }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: detailStyle }} />
      <div className={"movie-detail-box"}>
        {!!movieDetail &&
        <>
          <p className={"movie-name"}>{movieDetail.moviename}{setYear(movieDetail.year)}</p>
          <div className={"movie-msg-box"}>
            <div className={"movie-msg-box-left"}>
              <div
                style={{
                  backgroundImage: "url(" + movieDetail.coverimage + ")"
                }}
                className={"movie-logo"}/>
              <div className={"movie-message-show"}>
                <Tooltip title={setToolTitle("Watched",movieDetail.watchlist_num)}>
                  <div className={"image-message-show-icon"}>
                    <img src={"/static/lookTrue.png"}/>
                    &nbsp;
                    <span style={{ color: "#00e054" }}>{getMsg(movieDetail.watchlist_num)}</span>
                  </div>
                </Tooltip>
                <Tooltip title={setToolTitle("Liked",movieDetail.num_like)}>
                  <div className={"image-message-show-icon"}>
                    <img src={"/static/likeTrue.png"}/>
                    &nbsp;
                    <span style={{ color: "#40bcf4" }}>{getMsg(movieDetail.num_like)}</span>
                  </div>
                </Tooltip>
                <Tooltip title={setToolTitle("Wished",movieDetail.wishlist_num)}>
                  <div className={"image-message-show-icon"}>
                    <img src={"/static/collentTrue.png"}/>
                    &nbsp;
                    <span style={{ color: "#ff900f" }}>{getMsg(movieDetail.wishlist_num)}</span>
                  </div>
                </Tooltip>
              </div>
              <div className={"rating"}>
                <h6 className={"rating-title"}>Ratings:</h6>
                <div className={"rating-box"}>
                  <h5 className={"rating-box-title"}>{setAvgRate(movieDetail.avg_rate || 0)}</h5>
                  {rateChange && <RateComponent defaultValue={setAvgRate(movieDetail.avg_rate || 0)}/>}
                </div>
              </div>
            </div>
            <div className={"movie-msg-box-right"}>
              {!!movieDetail.director && <div className={"movie-message-body movie-message-body-flex"}>
                <p>DIRECTOR: </p>
                <h6>{movieDetail.director}</h6>
              </div>}
              {!!movieDetail.prodecers &&
              <div className={"movie-message-body"}>
                <p>PRODUCERS: </p>
                <h6>{movieDetail.prodecers}</h6>
              </div>}
              {!!movieDetail.writers &&
              <div className={"movie-message-body"}>
                <p>WRITERS: </p>
                <h6>{movieDetail.writers}</h6>
              </div>
              }
              {!!movieDetail.cast && <div className={"movie-message-body"}>
                <p>CAST: </p>
                <h6>{movieDetail.cast.join(",")}</h6>
              </div>}
              {!!movieDetail.description && <div className={"movie-message-body"}>
                <p>DETAILS: </p>
                <h6>{getDetailMsg(movieDetail.description)}</h6>
              </div>}
              {!!movieDetail.genre && !!setGeners(movieDetail.genre) &&
              <div className={"movie-message-body"}>
                <p>GENRES: </p>
                <h6>{setGeners(movieDetail.genre)}</h6>
              </div>}
              {!!movieDetail.country &&
              <div className={"movie-message-body movie-message-body-flex"}>
                <p>COUNTRY: </p>
                <h6>{movieDetail.country}</h6>
              </div>}
              {!!movieDetail.language &&
              <div className={"movie-message-body movie-message-body-flex"}>
                <p>LANGUAGE: </p>
                <h6>{movieDetail.language}</h6>
              </div>}
              {!!movieDetail.duration && <div className={"movie-message-body movie-message-body-flex"}>
                <p>LENGTH: </p>
                <h6>{movieDetail.duration}min</h6>
              </div>}
            </div>
            {
              !!isLogin && <div className={"operation"}>
                <div className={"operation-image"}>
                  <div
                    onClick={() => {
                      changeOperation(1)
                    }}
                    className={"image-box"}>{svgGet(1, movieDetail.is_user_watch)}</div>
                  <div className={"a-href"}>
                    Watchlist
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={() => {
                      changeOperation(2)
                    }}
                    className={"image-box"}> {svgGet(2, movieDetail.is_user_wish)}</div>
                  <div className={"a-href"}>
                    Wishlist
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={() => {
                      changeOperation(0)
                    }}
                    className={"image-box"}>{svgGet(0, movieDetail.is_user_like)}</div>
                  <div className={"a-href"}>
                    Like
                  </div>
                </div>
                <div className={"operation-image"}>
                  <div
                    onClick={() => {
                      changeOperation(3)
                    }}
                    className={"image-box"}>{svgGet(3, movieDetail.is_user_dislike)}</div>
                  <div className={"a-href"}>
                    Dislike
                  </div>
                </div>
                <div
                    onClick={() => {
                      const _year = movieDetail.year;
                      ratingRef && ratingRef.current && ratingRef.current.changeVisible
                      && ratingRef.current.changeVisible(true, movieDetail.moviename + (_year && ("(" + _year + ")") || ""),
                          movieDetail.mid,USERMESSAGE && USERMESSAGE.uid || null,movieDetail.is_user_rate || 0);
                    }}
                    className={"operation-image"}>
                  <div
                    className={"image-box"}>
                    {(movieDetail.is_user_rate === null || movieDetail.is_user_rate === undefined ||
                        movieDetail.is_user_rate <= 0
                    ) ? <img src={"/static/star.png"}/>:<img src={"/static/starChoose.png"}/>}
                  </div>
                  <div className={"a-href"}>
                    Rate
                  </div>
                </div>
              </div>
            }
          </div>
        </>
        }
          {/*<div className={"reviews-list"}>*/}
          {/*    <div className={"review-title"}>*/}
          {/*      <p>Related Reviews{!!isLogin && <span  onClick={()=>{*/}
          {/*                                    const _year = movieDetail.year;*/}
          {/*                                    reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible*/}
          {/*                                    && reviewsInfoRef.current.changeVisible(true,movieDetail.movieName + _year && ("(" + _year + ")") || "",*/}
          {/*                                      movieDetail.mid,USERMESSAGE && USERMESSAGE.uid || null);*/}
          {/*                                  }}*/}
          {/*      >add review</span>}</p>*/}
          {/*      <div className={"review-more"}>*/}
          {/*        More >*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*    <div className={"review-box"}>*/}
          {/*      {reviewsList && reviewsList.map((item,index)=>{*/}
          {/*        return <div className={`review-box-item ${index === reviewsList.length - 1 && "review-box-item-no-border" || ""}`}*/}
          {/*                    key={"review-box-item-" + index}>*/}
          {/*           <div className={"user-logo"}>*/}
          {/*             <Avatar size={40}  icon={<UserOutlined />} />*/}
          {/*           </div>*/}
          {/*           <div className={"review-body"}>*/}
          {/*              <div className={"user-name"}>*/}
          {/*                <span className={"userName"}>Review By:<span>{item.userName}</span></span>*/}
          {/*                  <div className={"rate"}>*/}
          {/*                     <RateComponent  style={{*/}
          {/*                        fontSize : "14px"*/}
          {/*                     }} defaultValue={item.rate || 1} />*/}
          {/*                      &nbsp;({item.rate || 1})*/}
          {/*                  </div>*/}
          {/*              </div>*/}
          {/*              <div className={`review-body-msg ${!isLogin && "review-body-msg-margin-bottom" || ""}`}>*/}
          {/*                {item.reviews}*/}
          {/*              </div>*/}
          {/*             {!!isLogin && <div className={"operation"}>*/}
          {/*               <div className={"operation-like"}>*/}
          {/*                 <div*/}
          {/*                   onClick={()=>{*/}
          {/*                     const _reviewsList = _.cloneDeep(reviewsList);*/}
          {/*                     const isLike = _reviewsList[index].userIsLike;*/}
          {/*                     _reviewsList[index].userIsLike = !isLike;*/}
          {/*                     changeReviewsList(_reviewsList);*/}
          {/*                   }}*/}
          {/*                   className={"image-box"}>{svgGet(0,item.userIsLike)}</div>*/}
          {/*                 <div className={"a-href"}>*/}
          {/*                   {item.userIsLike &&  "Like review"}*/}
          {/*                 </div>*/}
          {/*               </div>*/}
          {/*               <div className={"operation-like-number"}>*/}
          {/*                 {getMsg(item.likes)} Likes*/}
          {/*               </div>*/}
          {/*             </div>}*/}
          {/*           </div>*/}
          {/*        </div>*/}
          {/*      })}*/}
          {/*    </div>*/}
          {/*</div>*/}
      </div>
      {/*<ScrollImageComponent  uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
      {/*                       isLogin={isLogin} list={recommendList} title={"RECOMMEND"}/>*/}
      <RatingComponent
        changeRating={(mid,rate,avg_rate)=>{
          if(mid === movieDetail.mid){
            const _movieDatail = _.cloneDeep(movieDetail);
            _movieDatail.avg_rate = avg_rate;
            _movieDatail.is_user_rate = rate;
            const _is_user_watch = _movieDatail.is_user_watch;
            if(!_is_user_watch){
              _movieDatail.is_user_watch = true;
              _movieDatail.watchlist_num = (_movieDatail.watchlist_num || 0)+ 1;
            }

            changeMovieDetail(_movieDatail);
            changeRateChange(false);
            setTimeout(()=>{
              changeRateChange(true);
            },0)
          }
        }}
        ratingRef={ratingRef}/>
      <ReviewsInfoComponent reviewsInfoRef={reviewsInfoRef}/>
    </PageBase>
  )
}
Detail.getInitialProps = async (status) => {

  const movieId = status && status.query && status.query.movieId;
  return {
    initQuery: {
      movieId
    }
  }
}
export default Detail
