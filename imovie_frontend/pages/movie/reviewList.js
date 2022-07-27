import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import {displayMovieReview, likeReview} from "../MockData"
import {Avatar, message} from "antd";
import {MessageOutlined, UserOutlined} from "@ant-design/icons";
import RateComponent from "../../components/Rate/RateComponent";
import _ from "lodash";
import ReviewsThisComponent from "../../components/Home/ReviewsThis";
import reviewListStyle from "./reviewList.less"
import {isVisitor} from "../../util/common";
const ReviewList = ({USERMESSAGE,initQuery}) => {
    const [reviewsList,changeReviewsList] = useState([]);
    const reviewsThisRef = useRef();
    const [isLogin] = useState(!!USERMESSAGE);
      useEffect(()=>{
          if(initQuery && initQuery.movieId) {
              displayMovieReviewService();
          }
      },[]);
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
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
        <style dangerouslySetInnerHTML={{
            __html : reviewListStyle
        }}/>
        <div className={"review-box-page-box"}>
            <p className={"review-title-page-movie-name"}>{initQuery.movieName}</p>
            <div className={"review-title-page"}>
                <p>Related Reviews</p>
            </div>
            <div className={"review-box-page"}>
                {reviewsList && reviewsList.map((item,index)=>{
                    const userReview = item.userReview;
                    return <div className={`review-box-item ${(index === reviewsList.length - 1)
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
                            {!!isLogin && !isVisitor(USERMESSAGE) && <div style={{
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
                                    return <div
                                        style={{
                                            marginLeft : 0,
                                            width : "100%",
                                            marginTop : "10px",
                                            paddingBottom: "5px"
                                        }}
                                        className={`review-box-item ${(index2 === userReview.length - 1) && "review-box-item-no-border" || ""}`}
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
        </div>

        <ReviewsThisComponent
            changeReview={()=>{
                displayMovieReviewService();
            }}
            reviewsThisRef={reviewsThisRef}/>
    </PageBase>
  )
}
ReviewList.getInitialProps = async (status) => {

    const movieId = status && status.query && status.query.movieId;
    const movieName = status && status.query && status.query.movieName;
    return {
        initQuery: {
            movieId,
            movieName
        }
    }
}
export default ReviewList
