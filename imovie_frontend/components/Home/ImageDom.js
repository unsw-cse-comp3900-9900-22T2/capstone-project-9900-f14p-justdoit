
import React, { useImperativeHandle, useRef, useState } from "react";
import {EllipsisOutlined,DeleteOutlined} from '@ant-design/icons'
import { Rate,Popover ,Tooltip,message} from 'antd';
import ImageDomStyle from "./ImageDom.less"
import _ from "lodash";
import {wishlistAddOrDelete,watchlistAddOrDelete} from "../../pages/MockData";
import {dislikeAddOrDelete,likeAddOrDelete} from "../../pages/MockData";
import RatingComponent from "./Rating"
import ReviewsInfoComponent from "./ReviewsInfo"
import RateComponent from "../Rate/RateComponent"
// 下面这个watch是新加的
const ImageDom = ({imageDomRef,item,index,isLogin,from,wishListDo,watchListDo,disLikeDo,liKeDo,
                    ratingRefChangeVisible,reviewsInfoRefVisible,showClear,clearMovie,marginRight,uid,isNotMyself}) => {
  const [thisItem,changeThisItem] = useState(item);
  const ratingRef = useRef();
  const reviewsInfoRef = useRef();
  const [rateChange,changeRateChange]= useState(true);
  const {director,cast,genre,avg_rate,moviename,
    is_user_like,is_user_watch,is_user_wish,release_date,is_user_dislike,year,
    watchlist_num,num_like,wishlist_num,coverimage,mid,is_user_rate} = thisItem;
  const _nameList = [...[director || ""]];
  const _cast = [];
  if(cast && cast.length > 0){
    for(let castI = 0 ; castI < 3 ; castI ++){
        if(!cast[castI]){
          break;
        }
      _cast.push(cast[castI]);
    }
  }

  function goMovieDetail(id) {
    window.location.href = "/movie/detail?movieId=" + id;
  }
  useImperativeHandle(imageDomRef, () => ({
    changeItem: (changeitem) => {
      changeThisItem(changeitem);
    },
  }));
  function changeOperation(type) {
    const _type = type === 0 ? "is_user_like" : type === 1 ?  "is_user_watch" : type === 2 ? "is_user_wish" : "is_user_dislike";
    const _thisItem = _.cloneDeep(thisItem);
    const is = _thisItem[_type];
    _thisItem[_type] = !is;
    if(type === 1){
      // 提取互斥项
      const iss = _thisItem["is_user_wish"];
      watchlistAddOrDelete({
        mid,
        uid,
        add_or_del : !is ? "add" : "delete"
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Added successfully");
            _thisItem["watchlist_num"] = (_thisItem["watchlist_num"] || 0) + 1;
            // 用于判断互斥项是否为true
            if(iss) {
              _thisItem["is_user_wish"] = !iss;
              wishListDo && wishListDo();
              _thisItem["wishlist_num"] = (_thisItem["wishlist_num"] || 0) - 1 < 0 ? 0 : (_thisItem["wishlist_num"] || 0) - 1;
            }
          }else{
            message.success("Deleted successfully");
            watchListDo && watchListDo();
            _thisItem["watchlist_num"] = (_thisItem["watchlist_num"] || 0) - 1 < 0 ? 0 : (_thisItem["watchlist_num"] || 0) - 1;
          }
          changeThisItem(_thisItem);
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
      const iss = _thisItem["is_user_watch"];
        wishlistAddOrDelete({
          mid,
          uid,
          add_or_del : !is ? "add" : "delete"
        }).then(res => {
          if(res.code === 200){
            if(!is){
              message.success("Added successfully");
              _thisItem["wishlist_num"] = (_thisItem["wishlist_num"] || 0) + 1;
              if(iss) {
                _thisItem["is_user_watch"] = !iss;
                watchListDo && watchListDo();
                _thisItem["watchlist_num"] = (_thisItem["watchlist_num"] || 0) - 1 < 0 ? 0 : (_thisItem["watchlist_num"] || 0) - 1;
              }
            }else{
              message.success("Deleted successfully");
              wishListDo && wishListDo();
              _thisItem["wishlist_num"] = (_thisItem["wishlist_num"] || 0) - 1 < 0 ? 0 : (_thisItem["wishlist_num"] || 0) - 1;
            }
            changeThisItem(_thisItem);
          }else{
            if(!is) {
              message.error("Failed to add")
            }else{
              message.error("Failed to delete")
            }
          }
        })
    }
    // 加了这个else才能实时改变数字
    else if(type === 0){
      const iss = _thisItem["is_user_dislike"];
      likeAddOrDelete({
        mid,
        uid,
        add_or_del : !is ? "add" : "delete"
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Liked successfully");
            _thisItem["num_like"] = (_thisItem["num_like"] || 0) + 1;
            if(iss) {
              _thisItem["is_user_dislike"] = !iss;
              disLikeDo && disLikeDo();
              // _thisItem["num_dislike"] = (_thisItem["num_dislike"] || 0) - 1 < 0 ? 0 : (_thisItem["num_dislike"] || 0) - 1;
            }
          }else{
            message.success("Canceled the like successfully");
            liKeDo && liKeDo();
            _thisItem["num_like"] = (_thisItem["num_like"] || 0) - 1 < 0 ? 0 : (_thisItem["num_like"] || 0) - 1;
          }
          changeThisItem(_thisItem);
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
      const iss = _thisItem["is_user_like"];
      dislikeAddOrDelete({
        mid,
        uid,
        add_or_del : !is ? "add" : "delete"
      }).then(res => {
        if(res.code === 200){
          if(!is){
            message.success("Disliked successfully");
            // _thisItem["num_dislike"] = (_thisItem["num_dislike"] || 0) + 1;
            if(iss) {
              _thisItem["is_user_like"] = !iss;
              liKeDo && liKeDo();
              _thisItem["num_like"] = (_thisItem["num_like"] || 0) - 1 < 0 ? 0 : (_thisItem["num_like"] || 0) - 1;
            }
          }else{
            message.success("Canceled the dislike successfully");
            disLikeDo && disLikeDo();
            // _thisItem["num_dislike"] = (_thisItem["num_dislike"] || 0) - 1 < 0 ? 0 : (_thisItem["num_dislike"] || 0) - 1;
          }
          changeThisItem(_thisItem);
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
      changeThisItem(_thisItem)
    }
  }
  function svgGet(type ,isGet){
    if(type === 0){
      if(isGet){
        return <img src={"/static/likeTrue.png"}/>
      }else{
        return <img src={"/static/likeFalse2.png"}/>
      }
    }else if(type === 1){
      if(isGet){
        return <img src={"/static/lookTrue.png"}/>
      }else{
        return <img src={"/static/lookFalse2.png"}/>
      }
    }else if(type === 2){
      if(isGet){
        return <img src={"/static/collentTrue.png"}/>
      }else{
        return <img src={"/static/collentFalse2.png"}/>
      }
    }
  }
  function getMsg(number){
    if (!number && number !== 0) return number;
    let str_num
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
  const _index = index % 4;
  const left = _index === 0 || _index === 1;
  function setAvgRate(rate){
    return rate < 0 ? 0 : rate;
  }
  function setToolTitle(type,number){
    return type + " by " + (number || 0) +" " + (number && number > 1 && "members" || "member");
  }
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: ImageDomStyle }} />
      <div className={"swiper-image-list-item"}
           style={marginRight}
                key={"swiper_child_" + index}>
      <Tooltip
        destroyTooltipOnHide={true}
        mouseEnterDelay={0.2}
        placement={left ? "rightTop" : "leftTop"}
        trigger="hover"
        zIndex={12}
        title={
          <div  className={"swiper-image-list-item-image-black"}>
            <h6
              onClick={()=>{
                goMovieDetail(mid);
              }}
            >{moviename}{year && ("(" + year + ")")}</h6>
            <div className={"rate_msg"}>
              {rateChange && <RateComponent defaultValue={setAvgRate(avg_rate || 0)} />}
              <span className={"rate_msg_get"}>({setAvgRate(avg_rate || 0)})</span>
            </div>
          {genre && genre.length > 0 &&<div className={"tags"}>
            {
              genre && genre.map((genreItem,tagIndex) => {
                if(!genreItem){
                  return null;
                }
                return <div className={"tags-item"} key={"tags-item-" + tagIndex}>
                  {genreItem}
                </div>
              })
            }
          </div>}
          {
            _nameList && _nameList.length > 0 && <div className={"cast"}>
                DIRECTOR: {_nameList.join(",")}
            </div>
          }
            {
                _cast && _cast.length > 0 && <div className={"cast"}>
                    CAST: {_cast.join(",")}
                </div>
            }
          {
            isLogin && !isNotMyself && <div className={"operation"}>
              <div
                onClick={()=>{
                  changeOperation(1)
                }}
                className={"operation-image"}>{
                svgGet(1,is_user_watch)
              }</div>
              <div
                onClick={()=>{
                  changeOperation(0)
                }}
                className={"operation-image"}>{
                svgGet(0,is_user_like)
              }</div>
              <div
                onClick={()=>{
                  changeOperation(2)
                }}
                className={"operation-image"}>{
                svgGet(2,is_user_wish)
              }</div>
              <Popover
                zIndex={13}
                overlayClassName='popUpStatus'
                placement="rightTop" title={"More Operations"} content={()=>{
                return <div className={"swiper-component-operation"}>
                  <div
                    onClick={()=>{
                      ratingRef && ratingRef.current && ratingRef.current.changeVisible
                      && ratingRef.current.changeVisible(true,moviename  + (year && ("(" + year + ")") || ""),
                        mid,uid,is_user_rate);
                    }}
                    className={"swiper-component-operation-item padding1"}>
                    Rate
                  </div>
                  <div
                    onClick={()=>{
                      reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                      && reviewsInfoRef.current.changeVisible(true,moviename +  (year && ("(" + year + ")") || ""),
                        mid,uid);
                    }}
                    className={"swiper-component-operation-item"}>
                    Reviews and info
                  </div>
                  <div
                    onClick={()=>{
                      changeOperation(3,index)
                    }}
                    className={"swiper-component-operation-item border-no padding2"}>
                    {is_user_dislike ? "Cancel Dislike" : "Dislike"}
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
          }

        </div>
        }
      >
        <div
          onClick={()=>{
            goMovieDetail(mid);
          }}
          style={{
            backgroundImage : "url(" +coverimage +")"
          }}
          className={"swiper-image-list-item-image"}/>
      </Tooltip>
        {
          showClear && <div
            onClick={()=>{
              clearMovie && clearMovie(index);
            }}
            className={"image-delete-box"}>
            <DeleteOutlined className={"image-delete"}/>
          </div>
        }
      <div className={"image-message"}>
        <h6 onClick={()=>{
          goMovieDetail(mid);
        }}>{moviename}{year && ("(" + year + ")")}</h6>
        <div className={"image-message-show"}>
          <Tooltip title={setToolTitle("Watched",watchlist_num)}>
            <div className={"image-message-show-icon"}>
              <img src={"/static/lookTrue.png"}/>
              &nbsp;
              <span style={{color :"#00e054" }}>{getMsg(watchlist_num)}</span>
            </div>
          </Tooltip>
          <Tooltip title={setToolTitle("Liked",num_like)}>
            <div className={"image-message-show-icon"}>
              <img src={"/static/likeTrue.png"}/>
              &nbsp;
              <span style={{color :"#40bcf4" }}>{getMsg(num_like)}</span>
            </div>
          </Tooltip>
          <Tooltip title={setToolTitle("Wished",wishlist_num)}>
            <div className={"image-message-show-icon"}>
              <img src={"/static/collentTrue.png"}/>
              &nbsp;
              <span style={{color :"#ff900f" }}>{getMsg(wishlist_num)}</span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
      <RatingComponent
        changeRating={(mid,rate,avg_rate)=>{
          if(mid === thisItem.mid){
            const _thisItem = _.cloneDeep(thisItem);
            _thisItem.avg_rate = avg_rate;
            _thisItem.is_user_rate = rate;
            _thisItem.is_user_wish = false;
            _thisItem.is_user_watch = false;
            _thisItem.wishlist_num = (_thisItem.wishlist_num || 0) - 1 < 0 ? 0 : ((_thisItem.wishlist_num || 0) - 1);
            _thisItem.watchlist_num = (_thisItem.watchlist_num || 0) - 1 < 0 ? 0 : ((_thisItem.watchlist_num || 0) - 1);
            const _is_user_watch = _thisItem.is_user_watch;
            if(!_is_user_watch){
              _thisItem.is_user_watch = true;
              _thisItem.watchlist_num = (_thisItem.watchlist_num || 0)+ 1;
            }
            changeThisItem(_thisItem);
            changeRateChange(false);
            setTimeout(()=>{
              changeRateChange(true);
            },0)
            if(from === "wishList"){
              wishListDo && wishListDo();
            }
            if(from === "watchList"){
              watchListDo && watchListDo();
            }
            if(from === "disLike"){
              disLikeDo && disLikeDo();
            }
            if(from === "liKe"){
              liKeDo && liKeDo();
            }
          }
        }}
        ratingRef={ratingRef}/>
      <ReviewsInfoComponent reviewsInfoRef={reviewsInfoRef}/>
    </React.Fragment>
    )
}

export default ImageDom
