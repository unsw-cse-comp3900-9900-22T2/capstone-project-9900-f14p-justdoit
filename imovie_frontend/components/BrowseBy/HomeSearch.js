
import React, { useState, useEffect, useRef } from 'react'
import HomeSearchStyle from "./HomeSearch.less";
import { Button, Pagination ,message} from "antd";
import _ from "lodash"
import ImageDomComponent from "../Home/ImageDom";
import {browseBy} from "../../pages/MockData";
const HomeSearch = ({changeIsSearch,uid}) => {
  const [isSearch,changeSearchIsSearch] = useState(false);
    const [selectOption,changeSelectOption] = useState({
      area : null,
      genre : null,
      year : null,
      sort : null,
      rate : null,
    });
    const [showDom,changeShowDom] = useState(false);
    const [heightOut ,changeHeightOut]= useState([{
       key : "area",
       out : false
    },{
      key : "genre",
      out : false
    },{
      key : "year",
      out : false
    },{
      key : "sort",
      out : false
    },{
      key : "rate",
      out : false
    }]);
    const [loading , changeLoading] = useState(false);
    const [areaList] = useState([{
      key : "USA",
      value : "USA"
    },{
      key : "UK",
      value : "UK"
    },{
      key : "Australia",
      value : "Australia"
    },{
      key : "France",
      value : "France"
    },{
      key : "Germany",
      value : "Germany"
    },{
      key : "Italy",
      value : "Italy"
    },{
      key : "India",
      value : "India"
    },{
      key : "China",
      value : "China"
    },{
      key : "Korea",
      value : "Korea"
    },{
      key : "Japan",
      value : "Japan"
    },{
      key : "Thailand",
      value : "Thailand"
    },{
      key : "Others",
      value : "Others"
    }])
    const [genreList] = useState([{
      key : "Action",
      value : "Action"
    },{
      key : "Adventure",
      value : "Adventure"
    },{
      key : "Animation",
      value : "Animation"
    },{
      key : "Comedy",
      value : "Comedy"
    },{
      key : "Crime",
      value : "Crime"
    },{
      key : "Documentary",
      value : "Documentary"
    },{
      key : "Drama",
      value : "Drama"
    },{
      key : "Family",
      value : "Family"
    },{
      key : "Fantasy",
      value : "Fantasy"
    },{
      key : "History",
      value : "History"
    },{
      key : "Horror",
      value : "Horror"
    },{
      key : "Music",
      value : "Music"
    },{
      key : "Mystery",
      value : "Mystery"
    },{
      key : "Romance",
      value : "Romance"
    },{
      key : "Science Fiction",
      value : "Science Fiction"
    },{
      key : "Thriller",
      value : "Thriller"
    },{
      key : "TV Movie",
      value : "TV Movie"
    },{
      key : "War",
      value : "War"
    },{
      key : "Western",
      value : "Western"
    },{
      key : "Others",
      value : "Others"
    }]);
   const [yearList,changeYearList] = useState([]);
   const [rateList] = useState([{
     key : 0,
     value : "Highest First"
   },{
     key : 1,
     value : "Lowest First"
   }]);
   const [sortList] = useState([{
      key : 1,
      value : "Most Popular"
   },{
     key : 3,
     value : "Most Reviews"
   },{
     key : 4,
     value : "The Newest"
   }]);
  const [page,changePage] = useState({
    size : 16,
    number : 1,
    total : 0,
  });
  const [imgList,changeImgList] = useState([]);
    useEffect(()=>{
      setYear();
      setTimeout(()=>{
        const _heightOut = _.cloneDeep(heightOut);
        for(let i in selectOption){
          const idDom = document.
          getElementById("home-search-component-" + i);
          if(idDom){
            const height = idDom.clientHeight;
            const indexFilter = _heightOut && _heightOut.findIndex((item)=>{
               return item.key === i;
            })
            if(indexFilter >= 0){
              _heightOut[indexFilter].out = height >= 40;
            }
          }
        }
        changeHeightOut(_heightOut);
        changeShowDom(true);
      },0)

    },[])
    function setYear() {
    const noYear = new Date().getFullYear();
    const _yearList = [];
    let fiveYear = 0;
    for(let i = 0 ; i < 5 ; i++){
      _yearList.push({
        key: (noYear - i) + "-" + (noYear - i),
        value : noYear - i
      })
      if(i === 4){
        fiveYear = noYear - i;
      }
    }
    const sixObj = {
      key: (fiveYear - 5) + "-" + (fiveYear - 1),
      value : (fiveYear - 5) + "-" + (fiveYear - 1),
    }
    _yearList.push(sixObj);
    const sevenObj = {
      key: (fiveYear - 10) + "-" + (fiveYear - 6),
      value : (fiveYear - 10) + "-" + (fiveYear - 6),
    }
    _yearList.push(sevenObj);
    const eightObj = {
      key: (fiveYear - 20) + "-" + (fiveYear - 11),
      value : (fiveYear - 20) + "-" + (fiveYear - 11),
    }
    _yearList.push(eightObj);
    const nineObj = {
      key: "-" + (fiveYear - 21),
      value : "before",
    }
    _yearList.push(nineObj);
    changeYearList(_yearList);
  }
    function itemClick(value,type) {
      const _selectOption = _.cloneDeep(selectOption);
      const _value =  _selectOption[type];
      if(_value === value){
        _selectOption[type] = null;
      }else{
        _selectOption[type] = value;
      }
      changeSelectOption(_selectOption);
    }
    function returnListDom(title,value,list) {
       const heightOutObj = heightOut && heightOut.filter((item)=>{
         return item.key === value;
       })
      let _out = false;
       if(heightOutObj && heightOutObj.length >= 0){
         _out = heightOutObj[0].out
       }
       return <div
         id={"home-search-component-" + value}
         className={"home-search-component-item"}>
         <h6>
           {title}
         </h6>
         <div className={`home-search-component-item-select ${_out && "home-search-component-item-select-out" || ""}`}>
           {
             list && list.map((item,index) => {
               return <div
                 key={value + "list" + index}
                 onClick={()=>{
                   itemClick(item.key,value);
                 }}
                 className={`select-item ${item.key === selectOption[value] && "select-item-choose" || ""}`}>
                 {item.value}
               </div>
             })
           }
           {_out && <span
             onClick={()=>{
               const _heightOut = _.cloneDeep(heightOut);
               const indexFilter = _heightOut && _heightOut.findIndex((item)=>{
                 return item.key === value;
               })
               if(indexFilter >= 0){
                 _heightOut[indexFilter].out = false
               }
               changeHeightOut(_heightOut);
             }}
             className={"lookMore"}>Look More</span>}
         </div>
       </div>
    }
    function searchList(pageObj) {
      if(loading){
         message.warning("Searching, please wait");
         return;
      }
      const { area , genre, year, sort ,rate} = selectOption;
      const _pageObj = pageObj || page;
      changeLoading(true);
      browseBy({
        page_index : _pageObj.number - 1,
        page_size : _pageObj.size,
        rating : rate,
        uid
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
        changeIsSearch && changeIsSearch(true);
        changeSearchIsSearch(true);
        changeLoading(false);
      }).catch(err => {
        const res = {
          "code": 200,
          "result": {
            "count": 2,
            "list": [
              {
                "avg_rate": 5.0,
                "cast": null,
                "country": "Brazil",
                "coverimage": "https://a.ltrbxd.com/resized/sm/upload/hf/o9/fn/p4/adogswill-ms-0-230-0-345-crop.jpg?k=c61671eb55",
                "crew": null,
                "description": "The (mis)adventures of João Grilo and Chicó in Brazil's Northeastern region. The four-chapter miniseries original version of O Auto da Compadecida.",
                "director": "Guel Arraes",
                "duration": 174,
                "genre": [
                  "comedy",
                  "drama"
                ],
                "is_user_dislike": 0,
                "is_user_like": 0,
                "is_user_rate": -1,
                "is_user_watch": 0,
                "is_user_wish": 1,
                "language": "Portuguese",
                "mid": "PtXiSvs7VZ1655993156",
                "moviename": "A Dog's Will",
                "num_like": 0,
                "release_date": null,
                "watchlist_num": 0,
                "wishlist_num": 4,
                "year": null
              },
              {
                "avg_rate": 2.5,
                "cast": null,
                "country": "UK",
                "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/1/9/8/6198-radiohead-in-rainbows-from-the-basement-0-230-0-345-crop.jpg?k=2cf1b66170",
                "crew": null,
                "description": "A live performance by Radiohead of their 2007 album In Rainbows. This was their first of two full-episode performances, filmed at Maida Vale Studios in London, as part of the ‘From the Basement’ television series produced by Nigel Godrich, Dilly Gent, James Chads and John Woollcombe.",
                "director": "David Barnard",
                "duration": 54,
                "genre": [
                  "music",
                  "documentary"
                ],
                "is_user_dislike": 0,
                "is_user_like": 0,
                "is_user_rate": -1,
                "is_user_watch": 0,
                "is_user_wish": 1,
                "language": "English",
                "mid": "gtwXejS2qW1655993156",
                "moviename": "Radiohead: In Rainbows – From the Basement",
                "num_like": 0,
                "release_date": null,
                "watchlist_num": 0,
                "wishlist_num": 4,
                "year": null
              }
            ]
          }
        };
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
        changeIsSearch && changeIsSearch(true);
        changeSearchIsSearch(true);
        changeLoading(false);
      })
    }
    return (
      <React.Fragment>
        <style dangerouslySetInnerHTML={{ __html: HomeSearchStyle }} />
        <div className={"home-search-component-box"}>
        <div
          style={{
            visibility : !showDom ? "hidden" : "initial"
          }}
          className={`home-search-component ${ isSearch && "home-search-component-is-search" || ""}`}>
          {returnListDom("AREA","area",areaList)}
          {returnListDom("GENRE","genre",genreList)}
          {returnListDom("YEARS","year",yearList)}
          {returnListDom("RATING","rate",rateList)}
          {returnListDom("SORT","sort",sortList)}
          <div className={"operation"}>
            <Button
              onClick={()=>{
                changeSelectOption({
                  area : null,
                  genre : null,
                  year : null,
                  rate : null,
                  sort : null
                });
              }}
              className="clear">clear</Button>
            <Button type="primary"
                    onClick={()=>{
                      const _page = _.cloneDeep(page);
                      _page.number = 1;
                      changePage(_page);
                       searchList(_page);
                    }}
                    disabled={loading}
                    className="search">{loading ? "search Loading" : "search"}</Button>
          </div>
          <div className={"clearBoth"}/>
        </div>
          {
            isSearch && <>
              {page.total > 0 &&< div className={"total-title"}>
                     There are {page.total} {page.total > 1 ? "films" : "film"}
                </div>
              }
              <div className={"imgBox"}>
                {page.total > 0 && imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
                    item={item}
                    index={index}
                    isLogin={true}
                    marginRight={{
                      marginRight : index % 4 === 3 ? "0%" : "2.666666666%"
                    }}
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
                      if(loading){
                        message.warning("Searching, please wait");
                        return;
                      }
                      const _page = _.cloneDeep(page);
                      _page.number = pageIndex <= 0 ? 1 : pageIndex;
                      _page.size = pageSize;
                      changePage(_page);
                      searchList(_page);
                    }}
                  />
                </div>
              }
            </>
          }
        </div>
      </React.Fragment>
    )
}

export default HomeSearch