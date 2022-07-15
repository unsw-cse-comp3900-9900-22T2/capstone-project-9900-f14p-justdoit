import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import {  Pagination, Modal,message} from "antd";
import ReviewStyle from "./Review.less"
import _ from "lodash"
const { confirm } = Modal;
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {displayUsersMovieReview, deleteMovieReview} from "../../pages/MockData";
import RateComponent from "../Rate/RateComponent";
const WishListComponent = ({uid,isMySelf}) => {
    const [page,changePage] = useState({
       size : 10,
       number : 1,
       total : 0,
       sort : null,
    });
    const [imgList,changeImgList] = useState([]);
    useEffect(()=>{
      fetchData();
    },[])
    function fetchData(pageObj) {
      const _pageObj = pageObj || page;
      displayUsersMovieReview({
        page_index: _pageObj.number - 1 < 0 ? 0 : _pageObj.number - 1,
        page_size: _pageObj.size,
        uid,
      }).then(res => {
        if(res.code === 200){
          const {result} = res;
          if(result){
               _pageObj.total = result.movieReview_count;
               changePage(_pageObj);
              changeImgList([]);
              setTimeout(()=>{
                  changeImgList(result.movieReviews);
              },0)
          }else{
            _pageObj.total = 0;
            changePage(_pageObj);
            changeImgList([]);
          }
        }else{
            _pageObj.total = 0;
            changePage(_pageObj);
            changeImgList([]);
        }
      }).catch(err => {

      })
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
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: ReviewStyle }} />
         <div className="ReviewComponent">
              <div className={"title-box"}>
                  <p className="title">
                    Review
                  </p>
              </div>
           <div>
             <div className={"imgBox"}>
               {page.total > 0 && imgList && imgList.map((item,index)=>{
                  return <div className={"review-box"}>
                                <div className={"movie-box"}>
                                    <div
                                     className={"movie-logo"}
                                     style={{
                                         backgroundImage : "url(" + item.coverimage+")"
                                     }}
                                    />
                                </div>
                                <div className={"review-message"}>
                                    <p
                                        onClick={()=>{
                                            window.location.href =  "/movie/detail?movieId=" + item.mid;
                                        }}
                                        className={"movie-name"}>{item.moviename}</p>
                                    {(item.rate || 0) > 0 && <div className={"rate"}>
                                        <RateComponent  style={{
                                            fontSize : "17px"
                                        }} defaultValue={(item.rate || 0) <= 0 ? 0 : (item.rate)} />
                                        &nbsp;({(item.rate || 0) <= 0 ? 0 : (item.rate)})
                                    </div>}
                                    <div className={`review-body-msg`}>
                                        {item.review}
                                    </div>
                                    <div style={{
                                        fontSize : "12px",
                                        marginTop: "5px",
                                        color : "#999"
                                    }} className={"utime"}>&nbsp;{item.utime}</div>
                                    <div style={{
                                        marginBottom : "15px"
                                    }}
                                         className={"operation"}>
                                        <div className={"operation-like-number"}>
                                            {getMsg(item.like_count)} {(item.like_count || 0) >= 2 ? "Likes" : "Like"}
                                        </div>
                                    </div>
                                </div>
                                  {
                                      isMySelf &&
                                      <div
                                          onClick={()=>{
                                              confirm({
                                                  title: 'Are you sure you want to delete this review?',
                                                  icon: <ExclamationCircleOutlined/>,
                                                  okText: "YES",
                                                  cancelText: "NO",
                                                  onOk() {
                                                      deleteMovieReview({
                                                          mrid : item.mrid,
                                                          uid
                                                      }).then(res => {
                                                          if(res.code === 200){
                                                              message.success(res.msg);
                                                              fetchData();
                                                          }else{
                                                              message.error(res.msg);
                                                          }
                                                      })
                                                  }
                                              })
                                          }}
                                          className={"del"}>
                                          <DeleteOutlined className={"del-icon"}/>
                                      </div>
                                  }


                          </div>
               })}
               {
                 page.total === 0 &&
                   <div className={"empty"}>
                       <img src={"/static/empty.png"}/>
                       <h5>
                         No films yet
                       </h5>
                   </div>
               }
             </div>
             {
               page.total > 0 && <div className={"list-detail-pagination"}>
               <Pagination
               current={page.number}
               total={page.total}
               showQuickJumper
               simple
               pageSize={page.size}
               onChange={(pageIndex,pageSize)=>{
               const _page = _.cloneDeep(page);
               _page.number = pageIndex;
               _page.size = pageSize;
               changePage(_page);
               fetchData(_page);
             }}
               />
               </div>
             }

           </div>
         </div>
      </React.Fragment>
    )
}

export default WishListComponent
