import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import HomeSearchComponent from "../../components/Home/HomeSearch"
import homeStyle from "./home.less";
import {getQueryString} from "../../util/common";
import {getMovies} from "../MockData";
const Home = ({USERMESSAGE}) => {
  const [list,changeList] = useState([])
  const [browseBy,changeBrowseBy] = useState(false);
  useEffect(()=>{
    const _browseBy = getQueryString("browseBy") === "1";
    changeBrowseBy(_browseBy)
    console.log("USERMESSAGE",USERMESSAGE)
    getMovies({
      uid : USERMESSAGE && USERMESSAGE.uid || null
    }).then(res => {
       if(res.code === 200){
          const {result} = res;
          const {mlist} = result;
          const _list = [];
          let  childList = [];
          for(let i = 0 ; i < mlist.length ; i++){
               childList.push(mlist[i]);
               if(i % 4 === 3){
                 _list.push(childList);
                 childList = _.cloneDeep(childList);
                 childList = [];
               }
          }
         changeList(_list)
       }
    })

  },[]);
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      {
        browseBy && <HomeSearchComponent/>
      }
      <ScrollImageComponent isLogin={!!USERMESSAGE} list={list} title={"RECENT POPULAR FILMS"}/>
      <ScrollImageComponent isLogin={!!USERMESSAGE} list={list} title={"RECENT RELESE"}/>
      {!!USERMESSAGE && <ScrollImageComponent isLogin={!!USERMESSAGE} list={list} title={"GUESS LIKE"}/>}
    </PageBase>
  )
}

export default Home
