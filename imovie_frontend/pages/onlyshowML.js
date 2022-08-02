import PageBase from './basePage'
import OnlyshowMLStyle from "./onlyshowML.less";
import React, {useEffect, useState} from 'react'
import {Button, Card, Input, List, message, Modal, Select} from "antd";
import {DeleteTwoTone, ExclamationCircleOutlined, SearchOutlined,UserOutlined} from "@ant-design/icons";
import {
    addMoviesList,
    addMovieToList,
    delMovieFromList,
    delMoviesList,
    editMoviesList,
    getMoviesInList,
    getMoviesList,
    getWatchlist, searchBy,
    searchResult
} from "./MockData";
import ImageDom from "../components/Home/ImageDom";
import DocunceSelectComponent from "../components/DounceSelect";

const {Meta} = Card;
const {TextArea, Search} = Input;
const {Option} = Select;
const {confirm} = Modal;


const OnlyShowML = ({USERMESSAGE,initQuery}) => {
    const {uid} = USERMESSAGE
    const [setTimeOutFun,changeSetTimeOut] = useState(null);
    const [showModel, setShowModel] = useState(false);//添加movieList的弹窗
    const [changeList, setChangeList] = useState(false);//切换movieList和详情列表
    const [movieList, setMovieList] = useState([]);//影单列表
    const [movieListDetail, setMovieListDetail] = useState([]);//影单详情列表

    const [listName, setListName] = useState("");//影单title
    const [listDescription, setListDescription] = useState("");//影单描述
    const [listNameFlag, setListNameFlag] = useState(true);//影单title的编辑切换
    const [flag, setFlag] = useState(false);//是否显示电影的搜索列表
    const [listDescriptionFlag, setListDescriptionFlag] = useState(true);//影单描述的编辑切换

    // const [molid, setMolid] = useState(-1);//影单id
    const [molid, setMolid] = useState('0pIPkd5WqX1659422904');//影单id
    const [pages, setPages] = useState({pages_index: 0, pages_size: 20});//分页
    const [page, changePage] = useState({
        size: 12,
        number: 1,
        total: 0,
        sort: null,
    });
    const [searchMovie, setSearchMovie] = useState([]);//
    const [searchKeyWord, setSearchKeyWord] = useState('');//

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
    const addMovieListDetails = (mid) => {
        addMovieToList({
            uid,
            molid,
            mid,
        }).then(res => {
            if (res.code === 200) {
                setFlag(false)
                getMoviesListDetails(molid)
                message.success('add success')
            } else if (res.code === 400) {
                message.error('add failed')
            }
        }).catch(err => {
            console.log(err)
            throw err
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

    //查询电影
    const searchMovieList = (keyword) => {
        searchResult({
            page_index: page.number - 1,
            page_size: page.size,
            uid,
            keyword
        }).then(res => {
            console.log(res)
            if (res.code === 200) {
                const {result} = res;
                if (result) {
                    setSearchMovie(result.movies)
                }
            }
        })
    }

    {console.log(initQuery,USERMESSAGE)}
    return <PageBase USERMESSAGE={USERMESSAGE} uid={USERMESSAGE.uid}>
                
        <style dangerouslySetInnerHTML={{__html: OnlyshowMLStyle}}/>
        {
            <div className="watchListComponent">
                <div className={"title-box"} style={{position : "relative",zIndex:14}}>
                    <p className="title">
                        {movieList.map((item, index) => {
                            if (item.molid === molid) {
                                return <>
                                    <div>
                                        {<span style={{display: 'inline-block', marginRight: 10, color:'#1890ff'}}>
                                            {item.title}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:'black'}}>Created by :&nbsp;&nbsp;<UserOutlined/> NAME </span>    
                                        </span>}
                                        {/* <Button 
                                        // onClick={() => {
                                        //     setChangeList(true);
                                        //     fetchData()}}
                                        >From user: </Button> */}
                                        {/* <DeleteTwoTone style={{marginLeft: 50}}
                                                       onClick={() => deleteMovieList(item.molid)}/> */}
                                    </div>
                                    {listDescriptionFlag ? <div style={{cursor: 'pointer'}}
                                                                onClick={() => setListDescriptionFlag(false)}>{item.description}</div> :
                                        <TextArea autoSize={{maxRows: 2}}
                                            //   width={400}
                                                  style={{width: 400}}
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
                    {/* <div className={"search-movie"}>
                        <div className={"tag-search-logo"}>
                            <SearchOutlined/>
                        </div>
                        <DocunceSelectComponent
                            value={searchKeyWord || undefined}
                            allowClear
                            placeholder="Search Movie"
                            size={'middle'}
                            fetchOptions={async (keyword)=>{
                                setSearchKeyWord(keyword);
                                return searchBy({
                                    uid : USERMESSAGE && USERMESSAGE.uid || null,
                                    keyword
                                }).then(res => {
                                    if(res.code === 200){
                                        const {result} = res;
                                        if(result){
                                            const {movies,count} = result;
                                            const _length = count > 50? 50 : count;
                                            const data = [];
                                            for(let i = 0 ; i < _length ; i++){
                                                data.push(movies[i]);
                                            }
                                            return {
                                                list : data,
                                                value : keyword
                                            }
                                        }else{
                                            return {
                                                list : [],
                                                value : keyword
                                            }
                                        }
                                    }else{
                                        return {
                                            list : [],
                                            value : keyword
                                        }
                                    }
                                }).catch(err => {
                                    message.error("search error");
                                    return {
                                        list : [],
                                        value : keyword
                                    }
                                })
                            }}
                            onChange={(newValue) => {
                                setSearchKeyWord(newValue);
                            }}
                            style={{
                                width: '90%',
                            }}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            bordered={false}
                            nodeDom={(options,inputValue)=>{
                                return options &&
                                    options.map((item) => {
                                        if(!item){
                                            return;
                                        }
                                        return (
                                            <Option key={'labelData_' + item.mid + "_mid"} value={item.mid}>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        wordWrap: 'break-word',
                                                        wordBreak: 'break-all',
                                                        whiteSpace: 'normal',
                                                    }}
                                                    className={"label_data_user_movie_list_mid_search"}
                                                    onClick={()=>{
                                                        addMovieListDetails(item.mid)
                                                        // window.location.href = "/movie/detail?movieId=" + item.mid;
                                                    }}
                                                >
                                                    <h5>{item.moviename}{!!item.year && ("(" + item.year +")")}</h5>
                                                </div>
                                            </Option>
                                        );
                                    })
                            }}
                            showSearch />
                    </div> */}

                </div>
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
                    
                    </React.Fragment>)}
                </div>
            </div>
        }

        
        </PageBase>
}

export default OnlyShowML