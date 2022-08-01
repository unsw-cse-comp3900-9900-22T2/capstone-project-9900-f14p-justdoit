import PageBase from '../basePage'
import React, {useEffect, useState} from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import homeStyle from "./home.less";
import {getMovies, getMoviesListInHome, movieRecommendUser} from "../MockData";
import {isVisitor} from "../../util/common";
import {Card} from "antd";

const Home = ({USERMESSAGE}) => {
    const [list, changeList] = useState([])
    const [recommendList, changeRecommendList] = useState([])
    const [recommendListCount, changeRecommendListCount] = useState(0)
    const [movieList, setMovieList] = useState([]);//影单列表

    useEffect(() => {
        getMovies({
            uid: USERMESSAGE && USERMESSAGE.uid || null
        }).then(res => {
            if (res.code === 200) {
                const {result} = res;
                const {mlist} = result;
                const _list = [];
                let childList = [];
                changeRecommendListCount(result.count);
                for (let i = 0; i < mlist.length; i++) {
                    childList.push(mlist[i]);
                    if (i % 4 === 3) {
                        _list.push(childList);
                        childList = _.cloneDeep(childList);
                        childList = [];
                    }
                }
                if (childList.length > 0) {
                    _list.push(childList);
                }
                changeList(_list)
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
                    for (let i = 0; i < mlist.length; i++) {
                        childList.push(mlist[i]);
                        if (i % 4 === 3) {
                            _list.push(childList);
                            childList = _.cloneDeep(childList);
                            childList = [];
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
                        setMovieList(result.result_list)
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
                              listCount={200}
                              isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                              list={list} title={"RECENT POPULAR FILMS"}/>
        {recommendList && recommendList.length > 0 && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}
                                                                            listCount={recommendListCount}
                                                                            isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
                                                                            list={recommendList}
                                                                            title={"RECOMMENDATION FOR YOU"}/>}
        {/*{!!USERMESSAGE && <ScrollImageComponent uid={USERMESSAGE && USERMESSAGE.uid || null}*/}
        {/*                                        isLogin={!!USERMESSAGE} list={list} title={"GUESS LIKE"}/>}*/}
        {/* 主页推荐影单 */}
        <h4 style={{marginLeft:125}}>RECOMMEND MOVIE LIST</h4>
        <div className={"imgBox"} style={{display: 'flex'}}>
            {movieList.map((item, index) => <React.Fragment>
                <div className='card' style={{display: 'flex',marginLeft:125,marginRight:'-43px'}}>
                    <Card
                        // width={267}
                        // height={400}

                        hoverable
                        style={{width: 277, height: 416,marginRight:'-50px' }}
                        cover={item.cover_image === "./iMovie_backend/coverimage.jpg" ?
                            <img alt="example" src={"/static/emptyMovieList.png"}/> :
                            <img alt="example" src={item.cover_image}/>}
                        onClick={() => {
                            // setMolid(item.molid)
                            // getMoviesListDetails(item.molid)
                            // setChangeList(false)

                            window.location.href = `/movie/userMsg?uid=${USERMESSAGE&&USERMESSAGE.uid}&activeKey=3?activeKey=3`
                        }}
                    >
                        {/*<Meta title={item.title} description={item.description} />*/}
                        <h6>{item.title}</h6>
                    </Card>
                </div>
            </React.Fragment>)}
        </div>
    </PageBase>)
}

export default Home
