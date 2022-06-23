
import React, { useState} from 'react'
import {EllipsisOutlined,DeleteOutlined} from '@ant-design/icons'
import { Rate,Popover ,Tooltip,message} from 'antd';
import ImageDomStyle from "./ImageDom.less"
import _ from "lodash";
import {addToWishlist} from "../../pages/MockData";
const ImageDom = ({item,index,isLogin,
                    ratingRefChangeVisible,reviewsInfoRefVisible,showClear,clearMovie,marginRight,uid}) => {
  const [thisItem,changeThisItem] = useState(item);
  const {director,cast,genre,avg_rate,moviename,
    is_user_like,is_user_watch,is_user_wish,release_date,is_user_dislike,
    watchlist_num,num_like,wishlist_num,coverimage,mid} = thisItem;
  const _nameList = [...[director || ""],...(cast || [])];
  function goMovieDetail(id) {
    window.location.href = "/movie/detail?movieId=" + id;
  }
  function changeOperation(type) {
    const _type = type === 0 ? "is_user_like" : type === 1 ?  "is_user_watch" : type === 2 ? "is_user_wish" : "is_user_dislike";
    const _thisItem = _.cloneDeep(thisItem);
    const is = _thisItem[_type];
    _thisItem[_type] = !is;
    if(type === 2){
      if(!is){
        addToWishlist({
          mid,
          uid
        }).then(res => {
          if(res.code === 200){
            message.success("add success");
            changeThisItem(_thisItem);
          }else{
            message.error("add fail")
          }
        })
      }
    }else{
      changeThisItem(_thisItem);
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
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: ImageDomStyle }} />
      <div className={"swiper-image-list-item"}
           style={marginRight}
                key={"swiper_child_" + index}>
      <Tooltip
        mouseEnterDelay={0.2}
        placement={left ? "rightTop" : "leftTop"}
        trigger="hover"
        zIndex={12}
        {...showClear &&{
          visible : false
        }}
        title={
          <div  className={"swiper-image-list-item-image-black"}>
            <h6
              onClick={()=>{
                goMovieDetail(mid);
              }}
            >{moviename}</h6>
            <div className={"rate_msg"}>
              <Rate allowHalf disabled defaultValue={avg_rate || 0} />
              <span className={"rate_msg_get"}>({avg_rate || 0})</span>
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
              {_nameList.join(",")}
            </div>
          }
          {
            isLogin && <div className={"operation"}>
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
                placement="rightTop" title={"More Operation"} content={()=>{
                return <div className={"swiper-component-operation"}>
                  <div
                    onClick={()=>{
                      ratingRefChangeVisible && ratingRefChangeVisible(moviename,release_date);
                    }}
                    className={"swiper-component-operation-item padding1"}>
                    Rating
                  </div>
                  <div
                    onClick={()=>{
                      reviewsInfoRefVisible && reviewsInfoRefVisible(moviename,release_date);
                    }}
                    className={"swiper-component-operation-item"}>
                    Reviews and info
                  </div>
                  <div
                    onClick={()=>{
                      changeOperation(3,index)
                    }}
                    className={"swiper-component-operation-item border-no padding2"}>
                    {is_user_dislike ? "Cancel DisLike" : "DisLike"}
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
        }}>{moviename}</h6>
        <div className={"image-message-show"}>
          <div className={"image-message-show-icon"}>
            <img src={"/static/lookTrue.png"}/>
            &nbsp;
            <span style={{color :"#00e054" }}>{getMsg(watchlist_num)}</span>
          </div>
          <div className={"image-message-show-icon"}>
            <img src={"/static/likeTrue.png"}/>
            &nbsp;
            <span style={{color :"#40bcf4" }}>{getMsg(num_like)}</span>
          </div>
          <div className={"image-message-show-icon"}>
            <img src={"/static/collentTrue.png"}/>
            &nbsp;
            <span style={{color :"#ff900f" }}>{getMsg(wishlist_num)}</span>
          </div>
        </div>
      </div>
    </div>
    </React.Fragment>
    )
}

export default ImageDom
