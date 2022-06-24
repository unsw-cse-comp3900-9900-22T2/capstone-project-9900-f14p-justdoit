
import React, { useState, useEffect, useRef ,useImperativeHandle} from 'react'
import { Select, Pagination, Modal } from "antd";
const {Option} = Select;
import WishListStyle from "./WishList.less"
import _ from "lodash"
import ImageDomComponent from "../Home/ImageDom"
const { confirm } = Modal;
import { ExclamationCircleOutlined } from "@ant-design/icons";
const WishListComponent = ({uid}) => {
    const ratingRef = useRef();
    const reviewsInfoRef = useRef();
    const [sortList] = useState([{
      key : 1,
      value : "When add"
    },{
      key : 2,
      value : "Film name"
    },{
      key : 3,
      value : "Released"
    },{
      key : 4,
      value : "Rating"
    }]);
    const [page,changePage] = useState({
       size : 8,
       number : 1,
       total : 100,
       sort : "",
    });
    const [imgList,changeImgList] = useState([{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    },{
      movieId :123323,
      image : "https://swiperjs.com/demos/images/nature-1.jpg",
      look :23000,
      like :24,
      isLike : false,
      isLook : false,
      isCollection : false,
      collection : 256,
      rate : 3,
      year : "2022",
      tags : [{
        value : "Renre",
        key : 1,
      },{
        value : "Renre1",
        key : 2,
      },{
        value : "Renre2",
        key : 3,
      }],
      movieName : "movie name",
      director : ["jerry jackson"],
      cast : ["Tom","Haidi"]
    }])
    function selectChange(value) {
      const _page = _.cloneDeep(page);
      _page.sort = value;
      changePage(_page);
      fetchData(_page);
    }
    function fetchData(page) {
      console.log(page)
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
      }
    });
  }
  function clearMovie(index) {
    const _imgList = _.cloneDeep(imgList);
    _imgList.splice(index,1);
    changeImgList(_imgList);
  }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: WishListStyle }} />
         <div className="wishListComponent">
              <div className={"title-box"}>
                  <p className="title">
                    You want to see
                  </p>
                  <div className={"operation"}>
                      <h6
                        onClick={()=>{
                          addWatchList();
                        }}
                        className={"operation-item"}>
                         add films to watch list
                      </h6>
                     <div className={"line"}/>
                      <h6
                        onClick={()=>{
                          clearWishList();
                        }}
                        className={"operation-item"}>
                        clear wish list
                      </h6>
                      <div className={"line"}/>
                      <Select
                        onChange={(value)=>{
                          selectChange(value);
                        }}
                        className={"select-operation"}
                        defaultValue={null}
                              placeholder={"sort by"}
                              style={{ width: 120 }} bordered={false}>
                        {
                          sortList && sortList.map((item,index)=>{
                            return  <Option value={item.key}>{item.value}</Option>
                          })
                        }
                      </Select>
                  </div>
              </div>
           <div>
             <div className={"imgBox"}>
               {imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
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
                                           />
               })}
             </div>
             <div className={"list-detail-pagination"}>
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
                   changePage(_page)
                 }}
               />
             </div>
           </div>
         </div>
      </React.Fragment>
    )
}

export default WishListComponent
