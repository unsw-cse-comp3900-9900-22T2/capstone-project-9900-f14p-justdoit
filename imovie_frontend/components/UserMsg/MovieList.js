import React, {useEffect, useState} from 'react'
import {Button, Card, Input, List, message, Modal, Select} from "antd";
import MovieListStyle from "./MovieList.less"
import {DeleteTwoTone, ExclamationCircleOutlined, SearchOutlined} from "@ant-design/icons";
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
} from "../../pages/MockData";
import ImageDom from "../Home/ImageDom";
import DocunceSelectComponent from "../DounceSelect";

const {Meta} = Card;
const {TextArea, Search} = Input;
const {Option} = Select;
const {confirm} = Modal;
const MovieListComponent = ({uid, isMySelf, loginUid, USERMESSAGE}) => {
    const [setTimeOutFun,changeSetTimeOut] = useState(null);
    const [showModel, setShowModel] = useState(false);//添加movieList的弹窗
    const [changeList, setChangeList] = useState(true);//切换movieList和详情列表
    const [movieList, setMovieList] = useState([]);//影单列表
    const [movieListDetail, setMovieListDetail] = useState([]);//影单详情列表

    const [listName, setListName] = useState("");//影单title
    const [listDescription, setListDescription] = useState("");//影单描述
    const [listNameFlag, setListNameFlag] = useState(true);//影单title的编辑切换
    const [flag, setFlag] = useState(false);//是否显示电影的搜索列表
    const [listDescriptionFlag, setListDescriptionFlag] = useState(true);//影单描述的编辑切换

    const [molid, setMolid] = useState(-1);//影单id
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
            setListName('')
            setListDescription('')
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
                }).finally(() => {
                    setMovieList([])
                    fetchData();
                    setChangeList(true)
                })
            }
        });
    }


    /*影单详情列表的增删改查*/

    //查询影单详情列表
    const getMoviesListDetails = (molid) => {
        setMovieListDetail([]);
        setListDescription("");
        setListDescriptionFlag(true);
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
                        setMovieListDetail(res.result.result_list);
                        setListDescription(res.result.description || null)

                    }else{
                        setMovieListDetail([]);
                        setListDescription(null)
                    }
                }else{
                    setMovieListDetail([]);
                    setListDescription(null)
                }

            }else{
                setMovieListDetail([]);
                setListDescription(null)
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
            message.success('delete successfully')
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


    return (<React.Fragment>
        <style dangerouslySetInnerHTML={{__html: MovieListStyle}}/>
        {changeList
            ?
            <div className="watchListComponent">
                <div className={"title-box"}>
                    <p className="title">Movie List&nbsp;&nbsp;&nbsp;<Button onClick={() =>{
                        setShowModel(true);
                        setListDescription("");
                        setListName("");
                    }}>+
                        Create</Button></p>
                </div>
                <div className={"imgBox"}>
                    {movieList.length!==0?
                        movieList.map((item, index) => <React.Fragment>
                        <Card
                            // width={267}
                            // height={400}
                            hoverable
                            style={{width: 350, height: 522, marginRight: '25px', marginBottom: '70px'}}
                            cover={item.cover_image === null ?
                                <img alt="example" src={"/static/emptyLogo.png"}/> :
                                <img alt="example" src={item.cover_image}/>}
                            onClick={() => {
                                setMolid(item.molid)
                                getMoviesListDetails(item.molid)
                                setChangeList(false)
                            }}
                        >
                            {/*<Meta title={item.title} description={item.description} />*/}
                            <h6>{item.title}</h6>
                        </Card>
                    </React.Fragment>):<div className={"empty"}>
                            <img src={"/static/empty.png"}/>
                            <h5>
                                No movielist yet
                            </h5>
                        </div>
                        }
                </div>
            </div>
            :
            <div className="watchListComponent">
                <div className={"title-box"} style={{position : "relative",zIndex:14}}>
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
                                        <Button onClick={() => {
                                            setChangeList(true);
                                            fetchData()
                                        }}>Back to movielist</Button>
                                        <DeleteTwoTone style={{marginLeft: 50}}
                                                       onClick={() => {
                                                           deleteMovieList(item.molid)

                                                       }}/>
                                    </div>
                                    {listDescriptionFlag && (!!listDescription || listDescription === "") ? <div style={{cursor: 'pointer',
                                            lineHeight: "initial",
                                            wordBreak: "break-word",
                                            marginTop: "20px"}}
                                                                onClick={() => setListDescriptionFlag(false)}>{item.description}</div> :
                                        <TextArea autoSize={{maxRows: 2}}
                                            //   width={400}

                                                  maxLength={250} showCount={true}
                                                  style={{width: 400}}
                                                  allowClear value={listDescription}
                                                  onChange={e => setListDescription(e.target.value)}
                                                  placeholder={item.description || "Please enter this movie list description"}
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
                    <div className={"search-movie"}>
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
                                if(!!newValue){
                                    addMovieListDetails(newValue);
                                }
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
                                                >
                                                    <h5>{item.moviename}{!!item.year && ("(" + item.year +")")}</h5>
                                                </div>
                                            </Option>
                                        );
                                    })
                            }}
                            showSearch />
                    </div>

                    {/*<Search enterButton={false}*/}
                    {/*        onFocus={() => setFlag(true)}*/}
                    {/*        placeholder="input search text"*/}
                    {/*        // onBlur={() => setFlag(false)}*/}
                    {/*        onScroll={(event)=>{*/}
                    {/*            event.stopPropagation();*/}
                    {/*        }}*/}
                    {/*        onChange={e => {*/}
                    {/*            const _value = e.target.value;*/}
                    {/*            setSearchKeyWord(_value)*/}
                    {/*            if(setTimeOutFun){*/}
                    {/*                clearTimeout(setTimeOutFun);*/}
                    {/*                changeSetTimeOut(null);*/}
                    {/*            }*/}
                    {/*            const _setTimeOut = setTimeout(()=>{*/}
                    {/*                setSearchMovie([])*/}
                    {/*                searchMovieList(_value);*/}
                    {/*                clearTimeout(setTimeOutFun);*/}
                    {/*                changeSetTimeOut(null);*/}
                    {/*            },300)*/}
                    {/*            changeSetTimeOut(_setTimeOut)*/}

                    {/*        }} onSearch={(e) => {*/}
                    {/*}} style={{width: 200}}/>*/}
                    {/*<List*/}
                    {/*    bordered*/}
                    {/*    style={{*/}
                    {/*        width: 200,*/}
                    {/*        height: 400,*/}
                    {/*        overflow: 'auto',*/}
                    {/*        display: flag ? 'inline' : 'none',*/}
                    {/*        position: 'absolute',*/}
                    {/*        right: '0px',*/}
                    {/*        top: '60px',*/}
                    {/*        // top: '245px',*/}

                    {/*        borderRadius: '5px',*/}
                    {/*        backgroundColor: 'white',*/}
                    {/*        zIndex: '27'*/}
                    {/*    }}*/}
                    {/*    itemLayout="horizontal"*/}
                    {/*    dataSource={searchMovie}*/}
                    {/*    onScroll={(event)=>{*/}
                    {/*        event.stopPropagation();*/}
                    {/*    }}*/}
                    {/*    renderItem={(item) => {*/}
                    {/*        return (*/}
                    {/*            <List.Item*/}
                    {/*                style={{cursor: 'pointer'}}*/}
                    {/*                onFocus={() => setFlag(true)}*/}
                    {/*                onBlur={() => setFlag(false)}*/}
                    {/*                onClick={() => {*/}
                    {/*                    setFlag(true)*/}
                    {/*                    addMovieListDetails(item.mid)*/}
                    {/*                }}>*/}
                    {/*                <span onFocus={() => setFlag(true)}>{item.moviename}</span>*/}
                    {/*            </List.Item>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    }*/}
                    {/*/>*/}
                </div>
                <div className={"imgBox"} style={{position: "relative", top: 50}}>
                    {
                        movieListDetail.length !==0?
                        movieListDetail.map((item, index) => <React.Fragment>
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
                    </React.Fragment>)
                    :<div className={"empty"}>
                                <img src={"/static/empty.png"}/>
                                <h5>
                                    No films yet
                                </h5>
                            </div>
                    }
                </div>
            </div>
        }


        {/*添加和编辑的弹窗*/}
        <Modal visible={showModel} onCancel={() => setShowModel(false)} onOk={() => addMovieList()}>
            <label>List Name</label>
            <Input type="text" value={listName} onChange={e => setListName(e.target.value)}/>
            <label>List Description</label>
            <TextArea maxLength={250} showCount={true} autoSize={{minRows: 4, maxRows: 6}} allowClear
                      value={listDescription} onChange={e => setListDescription(e.target.value)}/>
        </Modal>
    </React.Fragment>)
}

export default MovieListComponent
