import PageBase from '../basePage'
import OnlyshowMLStyle from "./onlyshowML.less";
import React, {useEffect, useState} from 'react'
import {Card, Input, message, Modal, Select} from "antd";
import {ExclamationCircleOutlined, UserOutlined} from "@ant-design/icons";
import {getMoviesInList, getWatchlist} from "../MockData";
import ImageDom from "../../components/Home/ImageDom";

const {confirm} = Modal;

const OnlyShowML = ({USERMESSAGE}) => {
    const uid = USERMESSAGE  && USERMESSAGE.uid || null;
    const [movieListDetail, setMovieListDetail] = useState([]);//影单详情列表
    const [creatorInfo, setCreatorInfo] = useState('');//影单创建者
    const [movieListTitle, setMovieListTitle] = useState('');//影单title
    const [movieListDesc, setMovieListDesc] = useState('');//影单描述
    const [molid, setMolid] = useState('');//影单id
    const [pages, setPages] = useState({pages_index: 0, pages_size: 20});//分页
    const [page, changePage] = useState({
        size: 12,
        number: 1,
        total: 0,
        sort: null,
    });

    useEffect(() => {
        const pathname = window.location;
        let molidParam = pathname.search.split('=')
        console.log(USERMESSAGE, molidParam[1])
        setMolid(molidParam[1])
        // fetchData();
        getMoviesListDetails(molidParam[1])
    }, [])

    //查询影单详情列表
    const getMoviesListDetails = (molid) => {
        getMoviesInList({
            page_index: pages.pages_index,
            page_size: pages.pages_size,
            uid: uid,
            molid: molid
        }).then(res => {
            console.log(res, '详情')
            if (res.code === 200) {
                console.log(res.creator)
                setCreatorInfo(res.creator)
                if (res.hasOwnProperty("result")) {
                    setMovieListTitle(res.result.title)
                    setMovieListDesc(res.result.description)
                    if (res.result.result_list) {
                        setMovieListDetail(res.result.result_list)
                    }
                }

            }
        })
    }

    function watchList(pageObj) {
        const _pageObj = pageObj || page;
        getWatchlist({
            sort_by: _pageObj.sort,
            page_index: _pageObj.number - 1 < 0 ? 0 : _pageObj.number - 1,
            page_size: _pageObj.size,
            uid,
        }).then(res => {
            if (res.code === 200) {
                const {result} = res;
                if (result) {
                    _pageObj.total = result.count;
                    changePage(_pageObj);
                    changeImgList([]);
                    setTimeout(() => {
                        changeImgList(result.list);
                    }, 0)
                } else {
                    _pageObj.total = 0;
                    changePage(_pageObj);
                    changeImgList([]);
                }
            }
        }).catch(err => {

        })
    }

    return <PageBase USERMESSAGE={USERMESSAGE} uid={USERMESSAGE.uid}>
        <style dangerouslySetInnerHTML={{__html: OnlyshowMLStyle}}/>
        {<div className='Center'>
            <div className="watchListComponent">
                <div className={"title-box"} style={{position: "relative", zIndex: 14}}>
                    <p className="title">
                        <span style={{display: 'inline-block', marginRight: 10, color: '#1890ff'}}>{movieListTitle}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{color: 'black'}}>Created by :&nbsp;&nbsp;<UserOutlined/>&nbsp;{creatorInfo.username}</span>
                        </span>
                    </p>

                </div>
                <div className='des-box'><span className='des'>{movieListDesc}</span></div>
                {/* <span>{movieListDesc}</span> */}
                <div className={"imgBox"} style={{position: "relative", top: 50}}>
                    {movieListDetail.map((item, index) => <React.Fragment>
                        <ImageDom
                            item={item}
                            isLogin={true}
                            index={index}
                            uid={uid}
                            // wishListDo={}
                            watchListDo={watchList}
                            // disLikeDo={}
                            // liKeDo={}
                            // showClear={isMySelf && true || false}
                            clearMovie={() => {
                                confirm({
                                    title: 'Are you sure you want to remove this movie from your movielist?',
                                    icon: <ExclamationCircleOutlined/>,
                                    okText: "YES",
                                    cancelText: "NO",
                                    onOk() {
                                        delMovieListDetails(molid, item.mid)
                                    }
                                });
                            }}

                            marginRight={{
                                marginRight: index % 4 === 3 ? "0%" : "2.666666666%"
                            }}
                        />

                    </React.Fragment>)}
                </div>
            </div>
        </div>
        }
    </PageBase>
}

export default OnlyShowML
