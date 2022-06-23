
import React, { } from 'react'
import {EllipsisOutlined,DeleteOutlined} from '@ant-design/icons'
import { Rate,Popover ,Tooltip} from 'antd';
import ImageDomStyle from "./ImageDom.less"
const ImageDom = ({item,index,isLogin,changeOperation,
                    ratingRefChangeVisible,reviewsInfoRefVisible,showClear,clearMovie,marginRight}) => {
  const {director,cast,tags,rate,movieName,
    isLike,isLook,isCollection,year,isDisLike,
    look,like,collection,image} = item;
  const _nameList = [...(director || []),...(cast || [])];
  function goMovieDetail(id) {
    window.location.href = "/movie/detail?movieId=" + id;
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
                goMovieDetail(item.movieId);
              }}
            >{movieName}</h6>
            <div className={"rate_msg"}>
              <Rate allowHalf disabled defaultValue={rate || 1} />
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
          {
            isLogin && <div className={"operation"}>
              <div
                onClick={()=>{
                  changeOperation(1,index)
                }}
                className={"operation-image"}>{
                svgGet(1,isLook)
              }</div>
              <div
                onClick={()=>{
                  changeOperation(0,index)
                }}
                className={"operation-image"}>{
                svgGet(0,isLike)
              }</div>
              <div
                onClick={()=>{
                  changeOperation(2,index)
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
                      ratingRefChangeVisible && ratingRefChangeVisible(movieName,year);
                    }}
                    className={"swiper-component-operation-item padding1"}>
                    Rating
                  </div>
                  <div
                    onClick={()=>{
                      reviewsInfoRefVisible && reviewsInfoRefVisible(movieName,year);
                    }}
                    className={"swiper-component-operation-item"}>
                    Reviews and info
                  </div>
                  <div
                    onClick={()=>{
                      changeOperation(3,index)
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
          }

        </div>
        }
      >
        <div
          onClick={()=>{
            goMovieDetail(item.movieId);
          }}
          style={{
            backgroundImage : "url(" +image +")"
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
          goMovieDetail(item.movieId);
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
    </React.Fragment>
    )
}

export default ImageDom
