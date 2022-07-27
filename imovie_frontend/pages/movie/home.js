import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import homeStyle from "./home.less";
import {getMovies,movieRecommendUser} from "../MockData";
import {isVisitor} from "../../util/common";
const Home = ({USERMESSAGE}) => {
  const [list,changeList] = useState([])
  const [recommendList,changeRecommendList] = useState([])
  const [recommendListCount,changeRecommendListCount] = useState(0)
  useEffect(()=>{
    getMovies({
      uid : USERMESSAGE && USERMESSAGE.uid || null
    }).then(res => {
       if(res.code === 200){
          const {result} = res;
          const {mlist} = result;
          const _list = [];
          let  childList = [];
           changeRecommendListCount(result.count);
          for(let i = 0 ; i < mlist.length ; i++){
               childList.push(mlist[i]);
               if(i % 4 === 3){
                 _list.push(childList);
                 childList = _.cloneDeep(childList);
                 childList = [];
               }
          }
           if(childList.length > 0){
               _list.push(childList);
           }
         changeList(_list)
       }
    })
      if(USERMESSAGE && USERMESSAGE.uid && !isVisitor(USERMESSAGE)){
          movieRecommendUser({
              uid : USERMESSAGE && USERMESSAGE.uid || null,
              page_index : 0,
              page_size : 16
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
                  if(childList.length > 0){
                      _list.push(childList);
                  }
                  changeRecommendList(_list)
              }
          })
      }

  },[]);
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                            listCount={200}
                            isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                            list={list} title={"RECENT POPULAR FILMS"}/>
        {recommendList && recommendList.length > 0 &&
            <ScrollImageComponent  uid={USERMESSAGE && USERMESSAGE.uid || null}
                                   listCount={recommendListCount}
                                   isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                                   list={recommendList} title={"RECOMMENDATION FOR YOU"}/>}
      {/*{!!USERMESSAGE && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
      {/*                                        isLogin={!!USERMESSAGE} list={list} title={"GUESS LIKE"}/>}*/}
    </PageBase>
  )
}

export default Home
