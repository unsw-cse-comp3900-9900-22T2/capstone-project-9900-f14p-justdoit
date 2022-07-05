import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Select, Pagination, Modal,message} from "antd";
const {Option} = Select;
import WatchListStyle from "./WatchList.less"
import _ from "lodash"
import ImageDomComponent from "../Home/ImageDom"
const { confirm } = Modal;
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {getWatchlist,watchlistAddOrDelete,clearWatchlist} from "../../pages/MockData";
const WatchListComponent = ({uid}) => {
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
      getWatchlist({
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
//   function addWatchList() {
//     confirm({
//       title: 'Are you sure you want to turn all the movies of Wishlist into Watchlist?',
//       icon: <ExclamationCircleOutlined />,
//       okText : "YES",
//       cancelText : "NO",
//       onOk() {
//         console.log('OK');
//       }
//     });
//   }
  function clearWatchList() {
    confirm({
      title: 'Are you sure you want to clear Watchlist?',
      icon: <ExclamationCircleOutlined />,
      okText : "YES",
      cancelText : "NO",
      onOk() {
        clearWatchlist({
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
    watchlistAddOrDelete({
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
        <style dangerouslySetInnerHTML={{ __html: WatchListStyle }} />
         <div className="watchListComponent">
              <div className={"title-box"}>
                  <p className="title">
                    You have seen
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
                        clearWatchList();
                      }}
                      className={"operation-item"}>
                      clear watchlist
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
                                             from ={"watchList"}
                                             watchListDo={()=>{
                                               fetchData();
                                             }}
                                             clearMovie={(index3)=>{
                                               confirm({
                                                 title: 'Are you sure you want to remove this movie from your watchlist?',
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

export default WatchListComponent
