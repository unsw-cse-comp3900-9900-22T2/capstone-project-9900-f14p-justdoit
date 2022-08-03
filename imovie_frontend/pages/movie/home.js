import PageBase from '../basePage'
import React, {useEffect, useState} from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import homeStyle from "./home.less";
import {getMovies, getMoviesListInHome, movieRecommendUser,getRecentMovies} from "../MockData";
import {isVisitor} from "../../util/common";
import {Card} from "antd";

const Home = ({USERMESSAGE}) => {
    const [list, changeList] = useState([])
    const [recommendList, changeRecommendList] = useState([])
    const [recommendListCount, changeRecommendListCount] = useState(0)
    const [movieList, setMovieList] = useState([]);//影单列表
    const [recentMoviesList,changeRecentMoviesList] = useState([])
    const [recentMoviesListCount,changeRecentMoviesListCount] = useState(0)
    useEffect(() => {
        getMovies({
            uid: USERMESSAGE && USERMESSAGE.uid || null
        }).then(res => {
            if (res.code === 200) {
                const {result} = res;
                const {mlist} = result;
                const _list = [];
                let childList = [];
                if(mlist) {
                    for (let i = 0; i < mlist.length; i++) {
                        childList.push(mlist[i]);
                        if (i % 4 === 3) {
                            _list.push(childList);
                            childList = _.cloneDeep(childList);
                            childList = [];
                        }
                    }
                }
                if (childList.length > 0) {
                    _list.push(childList);
                }
                changeList(_list)
            }
        })
        getRecentMovies({
            uid: USERMESSAGE && USERMESSAGE.uid || null
        }).then(res => {
            if(res.code === 200){
                const {result} = res;
                const {mlist} = result;
                const _list = [];
                let  childList = [];
                if(mlist){
                    changeRecentMoviesListCount(result.count);
                    for(let i = 0 ; i < mlist.length ; i++){
                        childList.push(mlist[i]);
                        if(i % 4 === 3){
                            _list.push(childList);
                            childList = _.cloneDeep(childList);
                            childList = [];
                        }
                    }
                }

                if(childList.length > 0){
                    _list.push(childList);
                }
                changeRecentMoviesList(_list)
            }
        })
        if (USERMESSAGE && USERMESSAGE.uid && !isVisitor(USERMESSAGE)) {
            movieRecommendUser({
                uid: USERMESSAGE && USERMESSAGE.uid || null, page_index: 0, page_size: 16
            }).then(res => {
                if (res.code === 200) {
                    const {result} = res;
                    const {mlist} = result;
                    const _list = [];
                    let childList = [];
                    if(mlist) {
                        changeRecommendListCount(result.count);
                        for (let i = 0; i < mlist.length; i++) {
                            childList.push(mlist[i]);
                            if (i % 4 === 3) {
                                _list.push(childList);
                                childList = _.cloneDeep(childList);
                                childList = [];
                            }
                        }
                    }
                    if (childList.length > 0) {
                        _list.push(childList);
                    }
                    changeRecommendList(_list)
                }
            })
            // 主页影单推荐
            getMoviesListInHome({
                uid: USERMESSAGE && USERMESSAGE.uid || null
            }).then(res => {
                if (res.code === 200) {
                    const {result} = res;
                    if (result) {
                        console.log(result, '影单列表');
                        const length = (result.result_list || []).length;
                        if(length > 0){
                            for(let i = 0 ; i < (4-length) ; i++){
                                result.result_list.push({})
                            }
                            setMovieList(result.result_list)
                        }
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        }

    }, []);
    return (<PageBase USERMESSAGE={USERMESSAGE}>
        <style dangerouslySetInnerHTML={{__html: homeStyle}}/>
        <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                              listCount={16}
                              isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                              list={list} title={"RECENT POPULAR FILMS"}/>
        {recentMoviesList && recentMoviesList.length >0 &&
            <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                                  listCount={recentMoviesListCount}
                                  isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                                  list={recentMoviesList} title={"RECENT RELEASE MOVIES"}/>}
        {recommendList && recommendList.length > 0 && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                                                                            listCount={recommendListCount}
                                                                            isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                                                                            list={recommendList}
                                                                            title={"RECOMMENDATION FOR YOU"}/>}
        {/*{!!USERMESSAGE && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
        {/*                                        isLogin={!!USERMESSAGE} list={list} title={"GUESS LIKE"}/>}*/}
        {/* 主页推荐影单 */}
        <div
            className={"movieList-box"}>
        {movieList.length != 0 &&<h4>RECOMMEND MOVIE LIST</h4>}
        <div className={"imgBox-home"}>
            {movieList.map((item, index) =>{
                if(!item.title && !item.cover_image){
                    return <div className="empty_box_for_image"/>
                }
                return <div
                    onClick={()=>{
                        window.location.href = `/movie/onlyshowML?molid=${item.molid}`
                    }}
                    className={"img-background-box"}>
                    <div
                        style={{
                            backgroundImage:"url(" + (item.cover_image === null ? "/static/emptyLogo.png" : item.cover_image)+ ")"
                        }}
                        className={"img-background"}/>
                    <h6>{item.title}</h6>
                </div>
            })}
        </div>
        </div>
    </PageBase>)
}

export default Home
