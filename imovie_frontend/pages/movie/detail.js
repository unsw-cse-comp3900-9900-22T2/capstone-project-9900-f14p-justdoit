import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import detailStyle from "./detail.less";
import { Avatar, Popover, Rate ,message,Tooltip} from "antd";
import _ from "lodash";
import RatingComponent from "../../components/Home/Rating"
import { UserOutlined,MessageOutlined } from "@ant-design/icons";
import ReviewsInfoComponent from "../../components/Home/ReviewsInfo";
import ReviewsThisComponent from "../../components/Home/ReviewsThis";
import ScrollImageComponent from "../../components/Detail/ScrollImage";
import { wishlistAddOrDelete, watchlistAddOrDelete, getMovieDetail,historyAddOrDelete,movieSimilerRecommend
  ,displayMovieReview,likeReview} from "../MockData";
import { likeAddOrDelete,dislikeAddOrDelete } from "../MockData";
import RateComponent from "../../components/Rate/RateComponent"
const Detail = ({USERMESSAGE,initQuery}) => {
  const [isLogin] = useState(!!USERMESSAGE);
  const [detailMsgLook,changeDetailMsgLook] = useState(false);
  const [movieDetail,changeMovieDetail]=useState(null);
  const [rateChange,changeRateChange] = useState(true)
  const [reviewsList,changeReviewsList] = useState([])
  const [recommendList,changeRecommendList] = useState([])
  const ratingRef = useRef();
  const reviewsInfoRef = useRef();
  const reviewsThisRef = useRef();
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
      displayMovieReviewService();
      movieSimilerRecommend({
        uid : USERMESSAGE && USERMESSAGE.uid || null,
        mid : initQuery.movieId,
        page_index : 0,
        page_size : 16
      }).then(res => {
        if(res.code === 200){
          const {result} = res;
          const {mlist} = result;
          const _list = [];
          let  childList = [];
          for(let i = 0 ; i < mlist.length ; i++){
            childList.push(mlist[i]);
            if(i % 4 === 3){
              _list.push(childList);
              childList = _.cloneDeep(childList);
              childList = [];
            }
          }
          if(childList.length > 0){
            _list.push(childList);
          }
          changeRecommendList(_list)
        }
      })
      getMovieDetail({
        uid : USERMESSAGE && USERMESSAGE.uid || null,
        mid : initQuery.movieId
      }).then(res => {
        if(res.code === 200){
           const {result} = res;
          changeMovieDetail(result || null);
          // 改了这儿
          historyAddOrDelete({
            mid : initQuery.movieId,
            uid : USERMESSAGE && USERMESSAGE.uid || null,
            add_or_del : "add" 
          })
        }
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
    return name && name.map((item,index) => {
       return <>
             <span key={"href_broswe_by_gener_" + index}
                        onClick={()=>{
                          if(item){
                            window.location.href = "/movie/browseBy?queryForBrowseBy="
                              + encodeURIComponent(JSON.stringify({
                                size : 16,
                                number : 1,
                                total : 0,
                                area : null,
                                genre : item,
                                year : null,
                                sort : null,
                                rate : null,
                              }))
                          }
                        }}
                        className={"href_broswe_by"}>{item}</span>
             {
               index < name.length - 1 && " / " || ""
             }
         </>
    })
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
    if(type === 1){
      // 提取互斥项
      const iss = _movieDetail["is_user_wish"];
      watchlistAddOrDelete({
        mid : movieDetail.mid,
        uid : USERMESSAGE && USERMESSAGE.uid,
          add_or_del : !is ? "add" : "delete",
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Added successfully");
            _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) + 1;
            // 用于判断互斥项是否为true
            if(iss) {
              _movieDetail["is_user_wish"] = !iss;
              _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
            }
          }else{
            message.success("Deleted successfully");
            _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["watchlist_num"] || 0) - 1;
          }
          changeMovieDetail(_movieDetail);
        }else{
          if(!is) {
            message.error("Failed to add")
          }else{
            message.error("Failed to delete")
          }
        }
      })
    }
    else if(type === 2){
      const iss = _movieDetail["is_user_watch"];
        wishlistAddOrDelete({
          mid : movieDetail.mid,
          uid : USERMESSAGE && USERMESSAGE.uid,
            add_or_del : !is ? "add" : "delete",
        }).then(res => {
          if(res.code === 200){
            if(!is){
              message.success("Added successfully");
              _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) + 1;
              if(iss) {
                _movieDetail["is_user_watch"] = !iss;
                _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["watchlist_num"] || 0) - 1;
              }
            }else{
              message.success("Deleted successfully");
              _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
            }
            changeMovieDetail(_movieDetail);
          }else{
            if(!is) {
              message.error("Failed to add")
            }else{
              message.error("Failed to delete")
            }
          }
        })
    }
    // 加了这个else才能实时改变detail页面的数字
    else if(type === 0){
      const iss = _movieDetail["is_user_dislike"];
      likeAddOrDelete ({
        mid : movieDetail.mid,
        uid : USERMESSAGE && USERMESSAGE.uid,
        add_or_del : !is ? "add" : "delete",
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Liked successfully");
            _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) + 1;
            if(iss) {
              _movieDetail["is_user_dislike"] = !iss;
            }
          }else{
            message.success("Canceled the like successfully");
            _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) - 1 < 0 ? 0 : (_movieDetail["num_like"] || 0) - 1;
          }
          changeMovieDetail(_movieDetail);
        }else{
          if(!is) {
            message.error("Failed to like")
          }else{
            message.error("Failed to cancel the like")
          }
        }
      })
    }
    else if(type === 3){
      const iss = _movieDetail["is_user_like"];
      dislikeAddOrDelete ({
        mid : movieDetail.mid,
        uid : USERMESSAGE && USERMESSAGE.uid,
          add_or_del : !is ? "add" : "delete",
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Disliked successfully");
            // _movieDetail["num_dislike"] = (_movieDetail["num_dislike"] || 0) + 1;
            if(iss) {
              _movieDetail["is_user_like"] = !iss;
              _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) - 1 < 0 ? 0 : (_movieDetail["num_like"] || 0) - 1;
            }
          }else{
            message.success("Canceled the dislike successfully");
            // _movieDetail["num_dislike"] = (_movieDetail["num_dislike"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
          }
          changeMovieDetail(_movieDetail);
        }else{
          if(!is) {
            message.error("Failed to dislike")
          }else{
            message.error("Failed to cancel the dislike")
          }
        }
      })
    }
    else{
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
  function displayMovieReviewService(){
    displayMovieReview({
      mid : initQuery.movieId,
      uid : USERMESSAGE && USERMESSAGE.uid || null,
    }).then(res => {
      if(res.code === 200){
        changeReviewsList(res.result && res.result.movieReview || []);
      }else{
        changeReviewsList([])
      }
    })
  }
  function goUserDetail(uid){
    if(!USERMESSAGE || !(USERMESSAGE.uid)){
      return;
    }
    if(!uid){
       return null
    }
     window.location.href = "/movie/userMsg?uid=" + uid
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
                <h6
                  onClick={()=>{
                    if(movieDetail.director){
                      window.location.href = "/movie/searchMovie?keyword=" + movieDetail.director
                    }
                  }}
                  className={"href_broswe_by"}
                >{movieDetail.director}</h6>
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
                <h6>{movieDetail.cast && movieDetail.cast.map((item,index) => {
                return  <>
                         <span key={"href_broswe_by_cast_" + index}
                               onClick={()=>{
                                 if(item){
                                   window.location.href = "/movie/searchMovie?keyword=" + item
                                 }
                               }}
                               className={"href_broswe_by"}>{item}</span>
                          {
                            index < movieDetail.cast.length - 1 && "," || ""
                          }
                        </>
                })}</h6>
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
                <h6
                  onClick={()=>{
                    if(movieDetail.country){
                      window.location.href = "/movie/browseBy?queryForBrowseBy="
                        + encodeURIComponent(JSON.stringify({
                          size : 16,
                          number : 1,
                          total : 0,
                          area : movieDetail.country,
                          genre : null,
                          year : null,
                          sort : null,
                          rate : null,
                        }))
                    }
                  }}
                  className={"href_broswe_by"}>{movieDetail.country}</h6>
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
        {!!movieDetail && <div className={"reviews-list"}>
              <div className={"review-title"}>
                <p>Related Reviews{!!isLogin && <span  onClick={()=>{
                                              reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                                              && reviewsInfoRef.current.changeVisible(true,movieDetail.moviename + setYear(movieDetail.year),
                                                movieDetail.mid,USERMESSAGE && USERMESSAGE.uid || null);
                                            }}
                >add review</span>}</p>
                {reviewsList && reviewsList.length > 2 &&
                    <div
                        onClick={()=>{
                          window.location.href = "/movie/reviewList?movieName=" + movieDetail.moviename + setYear(movieDetail.year)
                              + "&movieId=" + initQuery.movieId
                        }}
                        className={"review-more"}>
                      More >
                    </div>
                }
              </div>
              <div className={"review-box"}>
                {reviewsList && reviewsList.map((item,index)=>{
                  if(index >= 2){
                    return null;
                  }
                  const userReview = item.userReview;
                  return <div className={`review-box-item ${(index === reviewsList.length - 1 || index === 1)
                  && "review-box-item-no-border" || ""}`}
                              key={"review-box-item-" + index}>
                     <div className={"user-logo"}>
                       <Avatar
                           onClick={()=>{
                             goUserDetail(item.uid);
                           }}
                           size={40}  icon={<UserOutlined />} />
                     </div>
                     <div className={"review-body"}>
                        <div className={"user-name"}>
                          <span className={"userName"}>Review By:<span>{item.username}</span></span>
                          {(item.rate || 0) > 0 && <div className={"rate"}>
                               <RateComponent  style={{
                                  fontSize : "14px"
                               }} defaultValue={(item.rate || 0) <= 0 ? 0 : (item.rate)} />
                                &nbsp;({(item.rate || 0) <= 0 ? 0 : (item.rate)})
                            </div>}
                        </div>
                        <div className={`review-body-msg ${!isLogin && "review-body-msg-margin-bottom" || ""}`}>
                          {item.review}
                        </div>
                       <div style={{
                           fontSize : "12px",
                         marginTop: "5px",
                         color : "#999"
                       }} className={"userName"}>&nbsp;{item.utime}</div>
                       {!!isLogin && <div style={{
                          marginBottom : "15px"
                       }} className={"operation"}>
                         <div className={"operation-like"}>
                           <div
                             onClick={()=>{
                               likeReview({
                                 add_or_del : !item.is_user_likeReview ? "add" : "del",
                                 uid : USERMESSAGE && USERMESSAGE.uid || null,
                                 mrid : item.mrid
                               }).then(res => {
                                  if(res.code === 200){
                                    const _reviewsList = _.cloneDeep(reviewsList);
                                    const isLike = _reviewsList[index].is_user_likeReview;
                                    const like_count = _reviewsList[index].like_count;
                                    _reviewsList[index].is_user_likeReview = !isLike;
                                    if(!item.is_user_likeReview ){
                                      _reviewsList[index].like_count = (like_count || 0) + 1;
                                    }else{
                                      _reviewsList[index].like_count = (like_count || 0)  - 1;
                                    }

                                    changeReviewsList(_reviewsList);
                                    message.success(res.msg);
                                  }else{
                                    message.error(res.msg);
                                  }
                               })

                             }}
                             className={"image-box"}>{svgGet(0,item.is_user_likeReview)}</div>
                           <div className={"a-href"}>
                             {!!item.is_user_likeReview &&  "Like review"}
                           </div>
                         </div>
                         <div className={"operation-like-number"}>
                           {getMsg(item.like_count)} {(item.like_count || 0) >= 2 ? "Likes" : "Like"}
                         </div>
                         <div
                             onClick={()=>{
                               reviewsThisRef && reviewsThisRef.current && reviewsThisRef.current.changeVisible
                               && reviewsThisRef.current.changeVisible(true,item.username,
                                   item.mrid,USERMESSAGE && USERMESSAGE.uid || null);
                             }}
                             className={"operation-review-this"}>
                           <MessageOutlined />
                           &nbsp;&nbsp;Review this
                         </div>
                       </div>}
                       {
                         userReview && userReview.map((item2,index2)=>{
                             if(index2 >= 2){
                               return null;
                             }
                             return <div
                                 style={{
                                   marginLeft : 0,
                                   width : "100%",
                                   marginTop : "10px",
                                   paddingBottom: "5px"
                                 }}
                                 className={`review-box-item ${(index2 === userReview.length - 1 || index2 === 1) && "review-box-item-no-border" || ""}`}
                                         key={"review-box-item-user-review-" + index2}>
                               <div className={"user-logo"}>
                                 <Avatar
                                     onClick={()=>{
                                       goUserDetail(item2.uid);
                                     }}
                                     size={40}  icon={<UserOutlined />} />
                               </div>
                               <div className={"review-body"}>
                                 <div className={"user-name"}>
                                   <span className={"userName"}>Review By:<span>{item2.username}</span></span>
                                 </div>
                                 <div
                                     style={{marginTop : "5px"}}
                                     className={`review-body-msg ${!isLogin && "review-body-msg-margin-bottom" || ""}`}>
                                   {item2.review}
                                 </div>
                                 <div style={{
                                   fontSize : "12px",
                                   marginTop: "5px",
                                   color : "#999"
                                 }} className={"userName"}>&nbsp;{item2.utime}</div>
                               </div>
                             </div>
                           })
                       }
                       <div style={{width :"100%",height : "15px"}}/>
                     </div>
                  </div>
                })}
                {(!reviewsList || reviewsList.length === 0)&&
                    <h6 className={"no-review-style"}>
                   There is no review
                </h6>}
              </div>
          </div>}
      </div>
      {recommendList && recommendList.length > 0 && <ScrollImageComponent
          goHrefMore={()=>{
            window.location.href = "/movie/similarMovie?movieId=" + initQuery.movieId
          }}
          uid={USERMESSAGE && USERMESSAGE.uid || null}
                             isLogin={isLogin} list={recommendList} title={isLogin ? "RECOMMEND FOR YOU SIMILAR" : "SIMILAR MOVIES"}/>}
      <RatingComponent
        changeRating={(mid,rate,avg_rate)=>{
          if(mid === movieDetail.mid){
            displayMovieReviewService();
            const _movieDetail = _.cloneDeep(movieDetail);
            _movieDetail.avg_rate = avg_rate;
            _movieDetail.is_user_rate = rate;
            _movieDetail.is_user_wish = false;
            _movieDetail.is_user_watch = false;
            _movieDetail.wishlist_num = (_movieDetail.wishlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
            _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
            const _is_user_watch = _movieDetail.is_user_watch;
            if(!_is_user_watch){
              _movieDetail.is_user_watch = true;
              _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0)+ 1;
            }

            changeMovieDetail(_movieDetail);
            changeRateChange(false);
            setTimeout(()=>{
              changeRateChange(true);
            },0)
          }
        }}
        ratingRef={ratingRef}/>
      <ReviewsInfoComponent
          changeReview={()=>{
            displayMovieReviewService();
          }}
          reviewsInfoRef={reviewsInfoRef}/>
      <ReviewsThisComponent
          changeReview={()=>{
            displayMovieReviewService();
          }}
          reviewsThisRef={reviewsThisRef}/>
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
