import React, {useEffect, useState} from 'react'
import {Button, Card, Input, message, Modal, Select} from "antd";
import MovieListStyle from "./MovieList.less"
import {DeleteTwoTone, ExclamationCircleOutlined} from "@ant-design/icons";
import {
    addMoviesList,
    addMovieToList,
    delMovieFromList,
    delMoviesList,
    editMoviesList,
    getMoviesInList,
    getMoviesList,
    getWatchlist
} from "../../pages/MockData";
import ImageDom from "../Home/ImageDom";

const {Meta} = Card;
const {TextArea} = Input;
const {Option} = Select;
const {confirm} = Modal;
const MovieListComponent = ({uid, isMySelf, loginUid}) => {

    const [showModel, setShowModel] = useState(false);//添加movieList的弹窗
    const [changeList, setChangeList] = useState(false);//切换movieList和详情列表
    const [movieList, setMovieList] = useState([]);//影单列表
    const [movieListDetail, setMovieListDetail] = useState([]);//影单详情列表

    const [listName, setListName] = useState("");//影单title
    const [listDescription, setListDescription] = useState("");//影单描述
    const [listNameFlag, setListNameFlag] = useState(true);//影单title的编辑切换
    const [listDescriptionFlag, setListDescriptionFlag] = useState(true);//影单描述的编辑切换

    const [molid, setMolid] = useState(-1);//影单id
    const [pages, setPages] = useState({pages_index: 0, pages_size: 20});//分页
    const [page, changePage] = useState({
        size: 12,
        number: 1,
        total: 0,
        sort: null,
    });

    useEffect(() => {
        fetchData();
    }, [])


    /**影单列表的增删改查*/

    //查询movieList列表
    function fetchData() {
        getMoviesList({uid}).then(res => {
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

    //添加一个moveList
    const addMovieList = () => {
        addMoviesList({
            "uid": uid, "title": listName, "mid": '', "description": listDescription
        }).then(res => {
            if (res.code === 200) {
                message.success(res.message);
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            fetchData();
            setShowModel(false)
        })
    }

    //编辑movieList 需要传movieList的id
    const editMovieList = (molid) => {
        editMoviesList({
            uid: uid, molid, title: listName, description: listDescription
        }).then(res => {
            if (res.code === 200) {
                fetchData()
                getMoviesListDetails(molid)
            }
        })
    }

    //删除movieList,需要传movieList的id
    const deleteMovieList = (molid) => {
        confirm({
            title: 'Are you sure you want to clear this movielist?',
            icon: <ExclamationCircleOutlined/>,
            okText: "YES",
            cancelText: "NO",
            onOk() {
                delMoviesList({uid, molid,}).then(res => {
                    if (res.code === 200) {
                        message.success("Clear successfully");
                        fetchData();
                    } else {
                        message.error("Clear failed");
                    }
                }).finally(() => setChangeList(true))
            }
        });
    }


    /*影单详情列表的增删改查*/

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
                if (res.hasOwnProperty("result")) {
                    if (res.result.result_list) {
                        setMovieListDetail(res.result.result_list)
                    }
                }

            }
        })
    }

    //添加电影到指定的影单
    const addMovieListDetails = () => {
        addMovieToList({
            uid: "kw3XEFnafb1659247126",
            molid: "4Yf3hBLD6u1659274149",
            mid: '9TLUu2hBks1659247259'
        }).then(res => {
            console.log(res, '添加心愿列表')
        })
    }

    //从影单删除一个电影
    const delMovieListDetails = (molid, mid) => {
        delMovieFromList({
            uid,
            molid,
            mid
        }).then(res => {
            console.log(res)
        }).finally(() => {
            fetchData()
            setMovieListDetail([])
            getMoviesListDetails(molid)
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

    return (<React.Fragment>
        <style dangerouslySetInnerHTML={{__html: MovieListStyle}}/>
        {
            <div className="movieListComponentComponent">
                <div className={"title-box"}>
                    <p className="title">
                        {movieList.map((item, index) => {
                            if (item.molid === molid) {
                                return <>
                                    <div>
                                        {listNameFlag ?
                                            <a style={{marginRight: 10}}
                                               onClick={() => setListNameFlag(false)}>{item.title}</a>
                                            : <span style={{display: 'inline-block', marginRight: 10}}>
                                                <Input allowClear style={{display: 'flex', width: 200}} type="text"
                                                       value={listName} placeholder={item.title}
                                                       onKeyUp={e => {
                                                           if (e.key === 'Enter') {
                                                               editMovieList(item.molid)
                                                               setListNameFlag(true)
                                                           }
                                                       }}
                                                       onChange={e => setListName(e.target.value)}/>
                                            </span>}
                                        <Button onClick={() => {setChangeList(true); fetchData()}}>Back to movielist</Button>
                                        <DeleteTwoTone style={{marginLeft: 50}}
                                                       onClick={() => deleteMovieList(item.molid)}/>
                                    </div>
                                    {listDescriptionFlag ? <div style={{cursor: 'pointer'}}
                                                                onClick={() => setListDescriptionFlag(false)}>{item.description}</div> :
                                        <TextArea autoSize={{maxRows:2}}
                                                //   width={400}
                                                  style={{width:400}}
                                                  allowClear value={listDescription}
                                                  onChange={e => setListDescription(e.target.value)}
                                                  placeholder={item.description}
                                                  onKeyDown={e => {
                                                      if (e.key === 'Enter') {
                                                          editMovieList(item.molid)
                                                          setListDescriptionFlag(true)
                                                      }
                                                  }}
                                        />}
                                </>
                            }
                        })}
                    </p>
                </div>
                <div className={"imgBox"}>
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
                            showClear={isMySelf && true || false}
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
                        {/*<Card*/}
                        {/*    hoverable*/}
                        {/*    style={{margin: '20px'}}*/}
                        {/*    cover={<div>*/}
                        {/*        <span style={{position: 'absolute', right: 10}}>*/}
                        {/*            <DeleteTwoTone onClick={() => {delMovieListDetails(molid, item.mid)}}/>*/}
                        {/*        </span>*/}
                        {/*        <img alt="example" src={item.coverimage}/></div>}*/}
                        {/*    // onClick={() => delMovieFromList(molid,item.mid)}*/}
                        {/*>*/}
                        {/*    {item.moviename}*/}
                        {/*</Card>*/}
                    </React.Fragment>)}
                </div>
            </div>
        }


        {/*添加和编辑的弹窗*/}
        <Modal visible={showModel} onCancel={() => setShowModel(false)} onOk={() => addMovieList()}>
            <label>List Name</label>
            <Input type="text" value={listName} onChange={e => setListName(e.target.value)}/>
            <label>List Description</label>
            <TextArea maxLength={250} showCount={true} autoSize={{minRows: 4, maxRows: 6}} allowClear value={listDescription} onChange={e => setListDescription(e.target.value)}/>
        </Modal>
    </React.Fragment>)
}

export default MovieListComponent
