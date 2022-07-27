import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import homeStyle from "./searchMovie.less";
import {  searchResult } from "../MockData";
import ImageDomComponent from "../../components/Home/ImageDom";
import { message, Pagination } from "antd";
import _ from "lodash";
import {isVisitor, tableGetValue, tableSet} from "../../util/common";
import {LoadingOutlined} from "@ant-design/icons";
const SearchMovie = ({USERMESSAGE,keywordForSearch,queryForBrowseBy}) => {
  const [imgList,changeImgList] = useState([]);
  const [keyword] = useState(keywordForSearch);
  const [page,changePage] = useState({
    size : 16,
    number : 1,
    total : 0,
  });
  const [loading,changeLoading] = useState(false);
  const [initLoading,changeInitLoading] = useState(true);
  useEffect(()=>{
    let _query = queryForBrowseBy;
    const _page = {
      size : _query ? tableGetValue(_query.size) || 16: 16,
      number : _query ? tableGetValue(_query.number) || 1: 1,
      total : 0,
    }
    if(!!_query){
      setTimeout(()=>{
        searchList(_page);
      },0)

    }
  },[]);
  function searchList(pageObj,callBack) {
    if(loading){
      message.warning("Searching, please wait");
      return;
    }
    const _pageObj = pageObj || page;
    changeLoading(true);
    searchResult({
      page_index : _pageObj.number - 1,
      page_size : _pageObj.size,
      uid : USERMESSAGE && USERMESSAGE.uid || null,
      keyword
    }).then(res => {
      if(res.code === 200){
        const {result} = res;
        if(result){
          _pageObj.total = result.count;
          changePage(_pageObj);
          changeImgList([]);
          setTimeout(()=>{
            changeImgList(result.movies);
            tableSet("queryForBrowseBy",{
              ..._pageObj
            });
          },0)
        }else{
          _pageObj.total = 0;
          changePage(_pageObj);
          changeImgList([]);
        }
      }
      changeLoading(false);
      changeInitLoading(false);
      setTimeout(()=>{
        callBack && callBack();
      },0)
    }).catch(err => {
      changeLoading(false);
      changeInitLoading(false);
    })
  }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      <div className={"search-movie-page-box"}>
        {
          initLoading ?
          <div
            style={{
              textAlign:"center"
            }}
            className={"empty"}>
            <LoadingOutlined
              style={{
                fontSize : 120,
                color : "#999",
                margin: "35px 0"
              }}
            />
            <h5>
              Data loading...
            </h5>
          </div> : <>
              {page.total > 0 &&< div className={"total-title"}>
                There are {page.total} {page.total > 1 ? "films" : "film"}
              </div>
              }
              <div className={"imgBox"}>
                {page.total > 0 && imgList && imgList.map((item,index)=>{
                  return <ImageDomComponent
                    item={item}
                    index={index}
                    isLogin={!!USERMESSAGE && !!USERMESSAGE.uid && !isVisitor(USERMESSAGE)}
                    marginRight={{
                      marginRight : index % 4 === 3 ? "0%" : "2.666666666%"
                    }}
                    uid={USERMESSAGE && USERMESSAGE.uid || null}
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

    </PageBase>
  )
}
SearchMovie.getInitialProps = async (status) => {

  let keywordForSearch = status && status.query && status.query.keyword;
  let queryForBrowseBy = status && status.query && status.query.queryForBrowseBy;
  try {
    queryForBrowseBy = decodeURIComponent(queryForBrowseBy);
  }catch (err){
    queryForBrowseBy = null;
  }
  return {
    keywordForSearch,
    queryForBrowseBy
  }
}
export default SearchMovie
