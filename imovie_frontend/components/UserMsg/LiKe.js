import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Select, Pagination, Modal,message} from "antd";
const {Option} = Select;
import LiKeStyle from "./LiKe.less"
import _ from "lodash"
import ImageDomComponent from "../Home/ImageDom"
const { confirm } = Modal;
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {getLike,likeAddOrDelete} from "../../pages/MockData";
const LiKeComponent = ({uid,isMySelf}) => {
    // const [sortList] = useState([{
    //   key : 0,
    //   value : "Add Time"
    // },{
    //   key : 1,
    //   value : "Highest Rating"
    // },{
    //   key : 2,
    //   value : "Lowest Rating"
    // },{
    //   key : 3,
    //   value : "Year"
    // }]);
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
      getLike({
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
  // function clearDisLike() {
  //   confirm({
  //     title: 'Are you sure you want to clear list of dislikes?',
  //     icon: <ExclamationCircleOutlined />,
  //     okText : "YES",
  //     cancelText : "NO",
  //     onOk() {
  //       clearDislike({uid}).then(res => {
  //          if(res.code === 200){
  //             message.success("Clear successfully");
  //             fetchData();
  //          }else{
  //            message.error("Clear failed");
  //          }
  //       })
  //     }
  //   });
  // }
  function clearMovie(index) {
    const _mid = imgList[index].mid;
    likeAddOrDelete({
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
        {/* 样式表 */}
        <style dangerouslySetInnerHTML={{ __html: LiKeStyle }} />
        {/* 整个组件 */}
         <div className="liKeComponent">
              {/* 操作框 */}
              <div className={"title-box"}>
                  <p className="title">
                    You liked
                  </p>
                {
                  // 条件判断
                  page.total > 0 &&
                  <div className={"operation"}>
                    {/* <h6
                      onClick={() => {
                        clearDisLike();
                      }}
                      className={"operation-item"}>
                      clear list of dislikes
                    </h6> */}
                    {/* <div className={"line"}/> */}
                    {/* 下拉框 */}
                    {/* <Select
                    // 干嘛用的没看懂？？？？？？？？？？？？？？？？？？
                      onChange={(value) => {
                        selectChange(value);
                      }}
                      allowClear={true}
                      className={"select-operation"}
                      defaultValue={null}
                      placeholder={"SORT BY"}
                      style={{ width: 150, textAlign : "center" }} bordered={false}>
                      {
                        // 添加下拉框选项
                        sortList && sortList.map((item, index) => {
                          return <Option value={item.key}>{item.value}</Option>
                        })
                      }
                    </Select> */}
                  </div>
                }
              </div>
           <div>
             <div className={"imgBox"}>
               {page.total > 0 && imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
                                             from ={"liKe"}
                                             liKeDo={()=>{
                                               fetchData();
                                             }}
                                             isNotMyself={!isMySelf}
                                             clearMovie={(index3)=>{
                                              // 这个index3是什么时候得到值的？？？？？？？？和下面那个index={index}不是一个？
                                               console.log(index3)
                                               confirm({
                                                 title: 'Are you sure you want to remove this movie from your list of likes?',
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
                                            showClear={isMySelf && true || false}
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

export default LiKeComponent
