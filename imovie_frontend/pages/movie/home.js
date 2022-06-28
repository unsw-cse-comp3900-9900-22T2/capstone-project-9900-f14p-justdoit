import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import homeStyle from "./home.less";
import {getMovies} from "../MockData";
const Home = ({USERMESSAGE}) => {
  const [list,changeList] = useState([])
  useEffect(()=>{
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
    }).catch(err => {
    })
  },[]);
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                            isLogin={!!USERMESSAGE} list={list} title={"RECENT POPULAR FILMS"}/>
      {/*<ScrollImageComponent  uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
      {/*                       isLogin={!!USERMESSAGE} list={list} title={"RECENT RELESE"}/>*/}
      {/*{!!USERMESSAGE && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
      {/*                                        isLogin={!!USERMESSAGE} list={list} title={"GUESS LIKE"}/>}*/}
    </PageBase>
  )
}

export default Home
