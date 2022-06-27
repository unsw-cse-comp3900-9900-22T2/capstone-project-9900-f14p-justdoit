
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
      value : "add time"
    },{
      key : 1,
      value : "highest rating"
    },{
      key : 2,
      value : "lowest rating"
    },{
      key : 3,
      value : "year"
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
      title: 'Are you sure you want to turn all the movies on wishList into watched?',
      icon: <ExclamationCircleOutlined />,
      okText : "Yes",
      cancelText : "No",
      onOk() {
        console.log('OK');
      }
    });
  }
  function clearWishList() {
    confirm({
      title: 'Are you sure you want to clear wishList?',
      icon: <ExclamationCircleOutlined />,
      okText : "Yes",
      cancelText : "No",
      onOk() {
        console.log('OK');
        clearWishlist({
           uid
        }).then(res => {
           if(res.code === 200){
              message.success("clear success");
              fetchData();
           }else{
             message.success("clear fail");
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
         message.success("delete success");
         fetchData();
       }else{
         message.error("delete failed");
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
                      add films to watch list
                    </h6>
                    <div className={"line"}/>
                    <h6
                      onClick={() => {
                        clearWishList();
                      }}
                      className={"operation-item"}>
                      clear wish list
                    </h6>
                    <div className={"line"}/>
                    <Select
                      onChange={(value) => {
                        selectChange(value);
                      }}
                      allowClear={true}
                      className={"select-operation"}
                      defaultValue={null}
                      placeholder={"sort by"}
                      style={{ width: 120 }} bordered={false}>
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
               {imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
                                             from ={"wishList"}
                                             wishListDo={()=>{
                                               fetchData();
                                             }}
                                             clearMovie={(index3)=>{
                                               confirm({
                                                 title: 'Are you sure you want to delete this movie in your wishList?',
                                                 icon: <ExclamationCircleOutlined />,
                                                 okText : "Yes",
                                                 cancelText : "No",
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
