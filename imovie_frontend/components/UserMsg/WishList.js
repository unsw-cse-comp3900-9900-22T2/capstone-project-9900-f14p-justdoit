
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Select, Pagination, Modal,message} from "antd";
const {Option} = Select;
import WishListStyle from "./WishList.less"
import _ from "lodash"
import ImageDomComponent from "../Home/ImageDom"
const { confirm } = Modal;
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {getWishlist,wishlistAddOrDelete,clearWishlist} from "../../pages/MockData";
const WishListComponent = ({uid}) => {
    const [sortList] = useState([{
      key : 0,
      value : "Add Time"
    },{
      key : 1,
      value : "Highest Rating"
    },{
      key : 2,
      value : "Lowest Rating"
    },{
      key : 3,
      value : "Year"
    }]);
    const [page,changePage] = useState({
       size : 12,
       number : 1,
       total : 0,
       sort : null,
    });
    const [imgList,changeImgList] = useState([]);
    useEffect(()=>{
      fetchData();
    },[])
    function selectChange(value) {
      const _page = _.cloneDeep(page);
      _page.sort = value === undefined || value === null ? null : value;
      _page.number = 1;
      changePage(_page);
      fetchData(_page);
    }
    function fetchData(pageObj) {
      const _pageObj = pageObj || page;
      getWishlist({
        sort_by: _pageObj.sort,
        page_index: _pageObj.number - 1 < 0 ? 0 : _pageObj.number - 1,
        page_size: _pageObj.size,
        uid,
      }).then(res => {
        if(res.code === 200){
          const {result} = res;
          if(result){
            _pageObj.total = result.count;
            changePage(_pageObj);
              changeImgList([]);
              setTimeout(()=>{
                  changeImgList(result.list);
              },0)
          }else{
            _pageObj.total = 0;
            changePage(_pageObj);
            changeImgList([]);
          }
        }
      }).catch(err => {

      })
    }
  function addWatchList() {
    confirm({
      title: 'Are you sure you want to turn all the movies on Wishlist into watched?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk() {
        console.log('OK');
      }
    });
  }
  function clearWishList() {
    confirm({
      title: 'Are you sure you want to clear Wishlist?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk() {
        clearWishlist({
           uid
        }).then(res => {
           if(res.code === 200){
              message.success("Clear successfully");
              fetchData();
           }else{
             message.error("Clear failed");
           }
        })
      }
    });
  }
  function clearMovie(index) {
    const _mid = imgList[index].mid;
    wishlistAddOrDelete({
      mid : _mid,
      uid,
      add_or_del : "delete"
    }).then(res => {
       if(res.code === 200){
         message.success("Deleted successfully");
         fetchData();
       }else{
         message.error("Failed to delete");
       }
    })
  }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: WishListStyle }} />
         <div className="wishListComponent">
              <div className={"title-box"}>
                  <p className="title">
                    You want to see
                  </p>
                {
                  page.total > 0 &&
                  <div className={"operation"}>
                    <h6
                      onClick={() => {
                        addWatchList();
                      }}
                      className={"operation-item"}>
                      add films to watchlist
                    </h6>
                    <div className={"line"}/>
                    <h6
                      onClick={() => {
                        clearWishList();
                      }}
                      className={"operation-item"}>
                      clear wishlist
                    </h6>
                    <div className={"line"}/>
                    <Select
                      onChange={(value) => {
                        selectChange(value);
                      }}
                      allowClear={true}
                      className={"select-operation"}
                      defaultValue={null}
                      placeholder={"SORT BY"}
                      style={{ width: 150, textAlign : "center" }} bordered={false}>
                      {
                        sortList && sortList.map((item, index) => {
                          return <Option value={item.key}>{item.value}</Option>
                        })
                      }
                    </Select>
                  </div>
                }
              </div>
           <div>
             <div className={"imgBox"}>
               {page.total > 0 && imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
                                             from ={"wishList"}
                                             wishListDo={()=>{
                                               fetchData();
                                             }}
                                             clearMovie={(index3)=>{
                                               confirm({
                                                 title: 'Are you sure you want to delete this movie in your wishlist?',
                                                 icon: <ExclamationCircleOutlined />,
                                                 okText : "YES",
                                                 cancelText : "NO",
                                                 onOk() {
                                                   clearMovie(index3);
                                                 }
                                               });
                                             }}
                                             marginRight={{
                                               marginRight : index % 4 === 3 ? "0%" : "2.666666666%"
                                             }}
                                            showClear={true}
                                            item={item}
                                            index={index}
                                            isLogin={true}
                                            uid={uid}
                                           />
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
