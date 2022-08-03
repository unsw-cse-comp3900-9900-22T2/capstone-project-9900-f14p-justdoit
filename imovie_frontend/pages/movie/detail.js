import PageBase from '../basePage'
import React, {useEffect, useRef, useState} from 'react'
import detailStyle from "./detail.less";
import {Avatar, Card, Input, message, Modal, Select, Tooltip} from "antd";
import _ from "lodash";
import RatingComponent from "../../components/Home/Rating"
import {ExclamationCircleOutlined, MessageOutlined, PlusOutlined,UserOutlined} from "@ant-design/icons";
import ReviewsInfoComponent from "../../components/Home/ReviewsInfo";
import ReviewsThisComponent from "../../components/Home/ReviewsThis";
import ScrollImageComponent from "../../components/Detail/ScrollImage";
import {
    addMoviesList,
    addMovieToList,
    delMovieFromList,
    dislikeAddOrDelete,
    displayMovieReview,
    getMovieDetail,
    getMoviesInList,
    getMoviesList,
    getMoviesListInDetail,
    historyAddOrDelete,
    likeAddOrDelete,
    likeReview,
    movieSimilerRecommend,
    rateDisplay,
    watchlistAddOrDelete,
    wishlistAddOrDelete
} from "../MockData";
import RateComponent from "../../components/Rate/RateComponent"
import {isVisitor} from "../../util/common";
import RatingPersonComponent from "../../components/Detail/ratingPerson"


const {Option} = Select;
const {TextArea} = Input;

const Detail = ({USERMESSAGE, initQuery}) => {
    const uid = USERMESSAGE  && USERMESSAGE.uid || null;
    const [isLogin] = useState(!!USERMESSAGE);
    const [detailMsgLook, changeDetailMsgLook] = useState(false);
    const [movieDetail, changeMovieDetail] = useState(null);
    const [rateChange, changeRateChange] = useState(true)
    const [reviewsList, changeReviewsList] = useState([])
    const [recommendList, changeRecommendList] = useState([])
    const [recommendListCount, changeRecommendListCount] = useState(0)
    const ratingRef = useRef();
    const reviewsInfoRef = useRef();
    const reviewsThisRef = useRef();
    const ratingPersonRef = useRef();
    const [movieList, setMovieList] = useState([]);//影单列表
    const [showModel, setShowModel] = useState(false);//选择movieList的弹窗
    const [showAddMoviesListModel, setShowAddMoviesListModel] = useState(false);//添加movieList的弹窗
    const [listName, setListName] = useState("");//影单title
    const [listDescription, setListDescription] = useState("");//影单描述
    const [molid, setMolid] = useState(-1);//影单id
    const [recommendedMovieList, setRecommendedMovieList] = useState([]);//推荐列表
    const [mid, setMid] = useState(initQuery.movieId);
    const [rateObj, changeRateObj] = useState(null);

    function getMsg(number) {
        if (!number && number !== 0) return number;
        var str_num
        if (number >= 1000 && number < 10000) {
            str_num = (number / 1000).toFixed(2);
            return str_num + 'k'
        } else if (number >= 10000) {
            str_num = (number / 10000).toFixed(2);
            return str_num + 'k'
        } else {
            return number
        }
    }

    useEffect(() => {
        if (initQuery && initQuery.movieId) {
            setMid(initQuery.movieId)
            displayMovieReviewService();
            movieSimilerRecommend({
                uid: USERMESSAGE && USERMESSAGE.uid || null,
                mid: initQuery.movieId,
                page_index: 0,
                page_size: 16
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
                    changeRecommendList(_list)
                }
            })
            getRateDisPlay();
            getMovieDetail({
                uid: USERMESSAGE && USERMESSAGE.uid || null,
                mid: initQuery.movieId
            }).then(res => {
                if (res.code === 200) {
                    const {result} = res;
                    changeMovieDetail(result || null);
                    // 改了这儿

                    console.log(result.mid, '电影id')
                    historyAddOrDelete({
                        mid: initQuery.movieId,
                        uid: USERMESSAGE && USERMESSAGE.uid || null,
                        add_or_del: "add"
                    })
                }
            })
        }
        queryRecommendedList()
    }, []);


    function getRateDisPlay() {
        rateDisplay({
            mid: initQuery.movieId,
        }).then(res => {
            if (res.code === 200 && res.result) {
                let sumValue = 0;
                for (let i in res.result) {
                    sumValue += res.result[i];
                }
                if (sumValue > 0) {
                    changeRateObj(res.result || null);
                } else {
                    changeRateObj(null);
                }
            } else {
                changeRateObj(null);
            }
        })
    }

    function setGeners(list) {
        if (!list) {
            return null;
        }
        const name = [];
        for (let i = 0; i < list.length; i++) {
            if (!!list[i]) {
                name.push(list[i]);
            }
        }
        return name && name.map((item, index) => {
            return <>
             <span key={"href_broswe_by_gener_" + index}
                   onClick={() => {
                       if (item) {
                           window.location.href = "/movie/browseBy?queryForBrowseBy="
                               + encodeURIComponent(JSON.stringify({
                                   size: 16,
                                   number: 1,
                                   total: 0,
                                   area: null,
                                   genre: item,
                                   year: null,
                                   sort: null,
                                   rate: null,
                               }))
                       }
                   }}
                   className={"href_broswe_by"}>{item}</span>
                {
                    index < name.length - 1 && " / " || ""
                }
            </>
        })
    }

    function svgGet(type, isGet) {

        if (type === 0) {
            if (isGet) {
                return <img src={"/static/likeTrue.png"}/>
            } else {
                return <img src={"/static/likeFalse.png"}/>
            }
        } else if (type === 1) {
            if (isGet) {
                return <img src={"/static/lookTrue.png"}/>
            } else {
                return <img src={"/static/lookFalse.png"}/>
            }
        } else if (type === 2) {
            if (isGet) {
                return <img src={"/static/collentTrue.png"}/>
            } else {
                return <img src={"/static/collentFalse.png"}/>
            }
        } else if (type === 3) {
            if (isGet) {
                return <img src={"/static/dislikeTrue.png"}/>
            } else {
                return <img src={"/static/dislikeFalse.png"}/>
            }
        }
    }

    function changeOperation(type) {
        const _type = type === 0 ? "is_user_like" : type === 1 ? "is_user_watch" : type === 2 ? "is_user_wish" : "is_user_dislike";
        const _movieDetail = _.cloneDeep(movieDetail);
        const is = _movieDetail[_type];
        _movieDetail[_type] = !is;
        if (type === 1) {
            // 提取互斥项
            const iss = _movieDetail["is_user_wish"];
            watchlistAddOrDelete({
                mid: movieDetail.mid,
                uid: USERMESSAGE && USERMESSAGE.uid,
                add_or_del: !is ? "add" : "delete",
            }).then(res => {
                if (res.code === 200) {
                    if (!is) {
                        message.success("Added successfully");
                        _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) + 1;
                        // 用于判断互斥项是否为true
                        if (iss) {
                            _movieDetail["is_user_wish"] = !iss;
                            _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
                        }
                    } else {
                        message.success("Deleted successfully");
                        _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["watchlist_num"] || 0) - 1;
                    }
                    changeMovieDetail(_movieDetail);
                } else {
                    if (!is) {
                        message.error("Failed to add")
                    } else {
                        message.error("Failed to delete")
                    }
                }
            })
        } else if (type === 2) {
            const iss = _movieDetail["is_user_watch"];
            wishlistAddOrDelete({
                mid: movieDetail.mid,
                uid: USERMESSAGE && USERMESSAGE.uid,
                add_or_del: !is ? "add" : "delete",
            }).then(res => {
                if (res.code === 200) {
                    if (!is) {
                        message.success("Added successfully");
                        _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) + 1;
                        if (iss) {
                            _movieDetail["is_user_watch"] = !iss;
                            _movieDetail["watchlist_num"] = (_movieDetail["watchlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["watchlist_num"] || 0) - 1;
                        }
                    } else {
                        message.success("Deleted successfully");
                        _movieDetail["wishlist_num"] = (_movieDetail["wishlist_num"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
                    }
                    changeMovieDetail(_movieDetail);
                } else {
                    if (!is) {
                        message.error("Failed to add")
                    } else {
                        message.error("Failed to delete")
                    }
                }
            })
        }
        // 加了这个else才能实时改变detail页面的数字
        else if (type === 0) {
            const iss = _movieDetail["is_user_dislike"];
            likeAddOrDelete({
                mid: movieDetail.mid,
                uid: USERMESSAGE && USERMESSAGE.uid,
                add_or_del: !is ? "add" : "delete",
            }).then(res => {
                if (res.code === 200) {
                    if (!is) {
                        message.success("Liked successfully");
                        _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) + 1;
                        if (iss) {
                            _movieDetail["is_user_dislike"] = !iss;
                        }
                    } else {
                        message.success("Canceled the like successfully");
                        _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) - 1 < 0 ? 0 : (_movieDetail["num_like"] || 0) - 1;
                    }
                    changeMovieDetail(_movieDetail);
                } else {
                    if (!is) {
                        message.error("Failed to like")
                    } else {
                        message.error("Failed to cancel the like")
                    }
                }
            })
        } else if (type === 3) {
            const iss = _movieDetail["is_user_like"];
            dislikeAddOrDelete({
                mid: movieDetail.mid,
                uid: USERMESSAGE && USERMESSAGE.uid,
                add_or_del: !is ? "add" : "delete",
            }).then(res => {
                if (res.code === 200) {
                    if (!is) {
                        message.success("Disliked successfully");
                        // _movieDetail["num_dislike"] = (_movieDetail["num_dislike"] || 0) + 1;
                        if (iss) {
                            _movieDetail["is_user_like"] = !iss;
                            _movieDetail["num_like"] = (_movieDetail["num_like"] || 0) - 1 < 0 ? 0 : (_movieDetail["num_like"] || 0) - 1;
                        }
                    } else {
                        message.success("Canceled the dislike successfully");
                        // _movieDetail["num_dislike"] = (_movieDetail["num_dislike"] || 0) - 1 < 0 ? 0 : (_movieDetail["wishlist_num"] || 0) - 1;
                    }
                    changeMovieDetail(_movieDetail);
                } else {
                    if (!is) {
                        message.error("Failed to dislike")
                    } else {
                        message.error("Failed to cancel the dislike")
                    }
                }
            })
        } else {
            changeMovieDetail(_movieDetail);
        }
    }

    function getDetailMsg(msg) {
        if (!msg) {
            return null
        }
        const length = msg.length;
        if (length >= 400 && !detailMsgLook) {
            const beforeMsg = msg.slice(0, 400);
            return <>
                {beforeMsg}
                <span
                    onClick={() => {
                        changeDetailMsgLook(true)
                    }}
                    className={"lookMore"}>LOOK MORE</span>
            </>
        } else {
            return msg;
        }
    }

    function setYear(year) {
        if (!year) {
            return null
        }
        return "(" + year + ")"
    }

    function setAvgRate(rate) {
        return rate < 0 ? 0 : rate;
    }

    function setToolTitle(type, number) {
        return type + " by " + (number || 0) + " " + (number && number > 1 && "members" || "member");
    }

    function getRateMsg(rateNumber, sumRateNumber, type) {
        let name = "";
        switch (type) {
            case "0.5":
            case 0.5:
                name = "½";
                break;
            case "1":
            case 1:
                name = "★";
                break;
            case "1.5":
            case 1.5:
                name = "★½";
                break;
            case "2":
            case 2:
                name = "★★";
                break;
            case "2.5":
            case 2.5:
                name = "★★½";
            case "3":
            case 3:
                name = "★★★";
                break;
            case "3.5":
            case 3.5:
                name = "★★★½";
                break;
            case "4":
            case 4:
                name = "★★★★";
                break;
            case "4.5":
            case 4.5:
                name = "★★★★½";
                break;
            case "5":
            case 5:
                name = "★★★★★";
                break;
            default:
                name = ""
        }
        let _avg = sumRateNumber && ((rateNumber / sumRateNumber) * 100) || 0;
        const _avg_str_list = (_avg + "").split(".");
        if(_avg_str_list.length > 1 && _avg_str_list[1].length > 2){
            const _avg_str_list_right = _avg_str_list[1].split("");
            const _avg_ = ((_avg_str_list_right[0] + _avg_str_list_right[1] + _avg_str_list_right[2]) / 1000).toFixed(2);
            _avg = _avg_str_list[0] * 1 + _avg_ * 1;
        }
        if (rateNumber === 0 || rateNumber === 1) {
            return rateNumber + " " + name + " rating (" + _avg + "%)"
        }
        return rateNumber + " " + name + " ratings (" + _avg + "%)"
    }

    function setRateObj() {
        let dataList = [];
        if (rateObj) {
            let maxValue = 0;
            let sumValue = 0;
            for (let i in rateObj) {
                dataList.push(i);
                sumValue += rateObj[i];
                if (rateObj[i] > maxValue) {
                    maxValue = rateObj[i];
                }
            }
            dataList.sort();
            if (!sumValue) {
                return null;
            }
            return dataList && dataList.map((item, index) => {
                const _rate = rateObj[item];
                let _height = 0;
                if (maxValue === 0) {
                    _height = 0;
                } else {
                    _height = _rate === 0 ? 0 : (_rate / maxValue) * 100;
                }
                return <Tooltip placement="top" title={getRateMsg(_rate, sumValue, item)}>
                    <div
                        style={{
                            width: 100 / dataList.length - 1 + "%",
                            marginRight: "1%"
                        }}
                        className={"rate-list-dom"}>
                        <div
                            style={{
                                height: _height + "px",
                            }}
                            onClick={() => {
                                ratingPersonRef && ratingPersonRef.current &&
                                ratingPersonRef.current.changeVisible &&
                                ratingPersonRef.current.changeVisible(true, item, initQuery.movieId);
                            }}
                            className={"rate-list-size"}/>
                        <h4>{item}</h4>
                    </div>
                </Tooltip>
            })
        }
        return null
    }

    function displayMovieReviewService() {
        changeReviewsList([]);
        displayMovieReview({
            mid: initQuery.movieId,
            uid: USERMESSAGE && USERMESSAGE.uid || null,
        }).then(res => {
            if (res.code === 200) {
                changeReviewsList(res.result && res.result.movieReview || []);
            } else {
                changeReviewsList([])
            }
        })
    }

    function goUserDetail(uid) {
        if (!USERMESSAGE || !(USERMESSAGE.uid)) {
            return;
        }
        if (!uid) {
            return null
        }
        window.location.href = "/movie/userMsg?uid=" + uid
    }

    //查询影单列表
    const queryMoviesList = () => {
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
    //添加电影到影单
    const addToMovieList = (molid, mid) => {
        addMovieToList({
            uid,
            molid,
            mid
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg)
                setShowModel(false)
            }
            console.log(res, '添加心愿列表')
        })
    }

    //创建影单一个moveList影单
    const createMovieList = () => {
        addMoviesList({
            "uid": USERMESSAGE&&USERMESSAGE.uid, "title": listName, "mid": mid, "description": listDescription
        }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            queryMoviesList();
            setShowAddMoviesListModel(false)
        })
    }

    //查询推荐列表
    const queryRecommendedList = () => {
        if (initQuery && initQuery.movieId) {
            getMoviesListInDetail({
                uid: USERMESSAGE && USERMESSAGE.uid,
                mid: initQuery.movieId,
            }).then(res => {
                if (res.code === 200) {
                    if (res.hasOwnProperty("result")) {
                        if (res.result && res.result.result_list
                            && res.result.result_list.length > 0) {
                            const length = (res.result.result_list || []).length;
                            for(let i = 0 ; i < (4-length) ; i++){
                                res.result.result_list.push({})
                            }
                            setRecommendedMovieList(res.result.result_list)
                        }
                    }
                }
            })
        }
    }

    return (
        <PageBase USERMESSAGE={USERMESSAGE}>
            <style dangerouslySetInnerHTML={{__html: detailStyle}}/>
            <div className={"movie-detail-box"}>
                {!!movieDetail &&
                    <>
                        <p className={"movie-name"}>{movieDetail.moviename}{setYear(movieDetail.year)}</p>
                        <div className={"movie-msg-box"}>
                            <div className={"movie-msg-box-left"}>
                                <div
                                    style={{
                                        backgroundImage: "url(" + movieDetail.coverimage + ")"
                                    }}
                                    className={"movie-logo"}/>
                                <div className={"movie-message-show"}>
                                    <Tooltip title={setToolTitle("Watched", movieDetail.watchlist_num)}>
                                        <div className={"image-message-show-icon"}>
                                            <img src={"/static/lookTrue.png"}/>
                                            &nbsp;
                                            <span style={{color: "#00e054"}}>{getMsg(movieDetail.watchlist_num)}</span>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={setToolTitle("Liked", movieDetail.num_like)}>
                                        <div className={"image-message-show-icon"}>
                                            <img src={"/static/likeTrue.png"}/>
                                            &nbsp;
                                            <span style={{color: "#40bcf4"}}>{getMsg(movieDetail.num_like)}</span>
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={setToolTitle("Wished", movieDetail.wishlist_num)}>
                                        <div className={"image-message-show-icon"}>
                                            <img src={"/static/collentTrue.png"}/>
                                            &nbsp;
                                            <span style={{color: "#ff900f"}}>{getMsg(movieDetail.wishlist_num)}</span>
                                        </div>
                                    </Tooltip>
                                </div>
                                {!!movieDetail.is_release &&
                                <div className={"rating"}>
                                    <h6 className={"rating-title"}>Average Rating:</h6>
                                    <div className={"rating-box"}>
                                        <h5 className={"rating-box-title"}>{setAvgRate(movieDetail.avg_rate || 0)}</h5>
                                        {rateChange &&
                                            <RateComponent defaultValue={setAvgRate(movieDetail.avg_rate || 0)}/>}
                                    </div>
                                </div>}
                                {!!rateObj && <div className={"ratings-box"}>
                                    <h6 className={"rating-title"}>Ratings:</h6>
                                    {!!rateObj && <div

                                        className={"echarts-dom"}>
                                        {setRateObj()}
                                        {/*<div className={"start-position"}>*/}
                                        {/*  <StarFilled className={"start-position-item"}/>*/}
                                        {/*  <StarFilled className={"start-position-item"}/>*/}
                                        {/*  <StarFilled className={"start-position-item"}/>*/}
                                        {/*  <StarFilled className={"start-position-item"}/>*/}
                                        {/*  <StarFilled className={"start-position-item"}/>*/}
                                        {/*</div>*/}

                                    </div>}
                                </div>}
                            </div>
                            <div className={"movie-msg-box-right"}>
                                {!!movieDetail.director &&
                                    <div className={"movie-message-body movie-message-body-flex"}>
                                        <p>DIRECTOR: </p>
                                        <h6
                                            onClick={() => {
                                                if (movieDetail.director) {
                                                    window.location.href = "/movie/searchMovie?keyword=" + movieDetail.director
                                                }
                                            }}
                                            className={"href_broswe_by"}
                                        >{movieDetail.director}</h6>
                                    </div>}
                                {!!movieDetail.prodecers &&
                                    <div className={"movie-message-body"}>
                                        <p>PRODUCERS: </p>
                                        <h6>{movieDetail.prodecers}</h6>
                                    </div>}
                                {!!movieDetail.writers &&
                                    <div className={"movie-message-body"}>
                                        <p>WRITERS: </p>
                                        <h6>{movieDetail.writers}</h6>
                                    </div>
                                }
                                {!!movieDetail.cast && <div className={"movie-message-body"}>
                                    <p>CAST: </p>
                                    <h6>{movieDetail.cast && movieDetail.cast.map((item, index) => {
                                        return <>
                         <span key={"href_broswe_by_cast_" + index}
                               onClick={() => {
                                   if (item) {
                                       window.location.href = "/movie/searchMovie?keyword=" + item
                                   }
                               }}
                               className={"href_broswe_by"}>{item}</span>
                                            {
                                                index < movieDetail.cast.length - 1 && "," || ""
                                            }
                                        </>
                                    })}</h6>
                                </div>}
                                {!!movieDetail.description && <div className={"movie-message-body"}>
                                    <p>DETAILS: </p>
                                    <h6>{getDetailMsg(movieDetail.description)}</h6>
                                </div>}
                                {!!movieDetail.genre && !!setGeners(movieDetail.genre) &&
                                    <div className={"movie-message-body"}>
                                        <p>GENRES: </p>
                                        <h6>{setGeners(movieDetail.genre)}</h6>
                                    </div>}
                                {!!movieDetail.country &&
                                    <div className={"movie-message-body movie-message-body-flex"}>
                                        <p>COUNTRY: </p>
                                        <h6
                                            onClick={() => {
                                                if (movieDetail.country) {
                                                    window.location.href = "/movie/browseBy?queryForBrowseBy="
                                                        + encodeURIComponent(JSON.stringify({
                                                            size: 16,
                                                            number: 1,
                                                            total: 0,
                                                            area: movieDetail.country,
                                                            genre: null,
                                                            year: null,
                                                            sort: null,
                                                            rate: null,
                                                        }))
                                                }
                                            }}
                                            className={"href_broswe_by"}>{movieDetail.country}</h6>
                                    </div>}
                                {!!movieDetail.language &&
                                    <div className={"movie-message-body movie-message-body-flex"}>
                                        <p>LANGUAGE: </p>
                                        <h6>{movieDetail.language}</h6>
                                    </div>}
                                {!!movieDetail.duration &&
                                    <div className={"movie-message-body movie-message-body-flex"}>
                                        <p>LENGTH: </p>
                                        <h6>{movieDetail.duration}min</h6>
                                    </div>}
                                {!!movieDetail.release_date &&
                                    <div className={"movie-message-body movie-message-body-flex"}>
                                        <p>RELEASE DATE: </p>
                                        <h6>{(movieDetail.release_date || "").split(" ")[0]}</h6>
                                    </div>}
                            </div>
                            {
                                !!isLogin && !isVisitor(USERMESSAGE) &&
                                <div className={"operation"}>
                                    {!!movieDetail.is_release &&
                                        <>
                                            <div className={"operation-image"}>
                                                <div
                                                    onClick={() => {
                                                        changeOperation(1)
                                                    }}
                                                    className={"image-box"}>{svgGet(1, movieDetail.is_user_watch)}</div>
                                                <div className={"a-href"}>
                                                    Watchlist
                                                </div>
                                            </div>
                                        </>}
                                    <div className={"operation-image"}>
                                        <div
                                            onClick={() => {
                                                changeOperation(2)
                                            }}
                                            className={"image-box"}> {svgGet(2, movieDetail.is_user_wish)}</div>
                                        <div className={"a-href"}>
                                            Wishlist
                                        </div>
                                    </div>
                                    {!!movieDetail.is_release &&
                                    <>
                                        <div className={"operation-image"}>
                                                <div
                                                    onClick={() => {
                                                        changeOperation(0)
                                                    }}
                                                    className={"image-box"}>{svgGet(0, movieDetail.is_user_like)}</div>
                                                <div className={"a-href"}>
                                                    Like
                                                </div>
                                            </div>
                                            <div className={"operation-image"}>
                                                <div
                                                    onClick={() => {
                                                        changeOperation(3)
                                                    }}
                                                    className={"image-box"}>{svgGet(3, movieDetail.is_user_dislike)}</div>
                                                <div className={"a-href"}>
                                                    Dislike
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    const _year = movieDetail.year;
                                                    ratingRef && ratingRef.current && ratingRef.current.changeVisible
                                                    && ratingRef.current.changeVisible(true, movieDetail.moviename + (_year && ("(" + _year + ")") || ""),
                                                        movieDetail.mid, USERMESSAGE && USERMESSAGE.uid || null, movieDetail.is_user_rate || 0);
                                                }}
                                                className={"operation-image"}>
                                                <div
                                                    className={"image-box"}>
                                                    {(movieDetail.is_user_rate === null || movieDetail.is_user_rate === undefined ||
                                                        movieDetail.is_user_rate <= 0
                                                    ) ? <img src={"/static/star.png"}/> : <img src={"/static/starChoose.png"}/>}
                                                </div>
                                                <div className={"a-href"}>
                                                    Rate
                                                </div>
                                            </div>

                                    </>}

                                    <div
                                        onClick={() => {
                                            setShowModel(true)
                                            queryMoviesList()
                                        }}
                                        className={"operation-image"}>
                                        <div
                                            className={"image-box"}>
                                            <img src={"/static/playSquare.png"}/>
                                        </div>
                                        <div className={"a-href"}>
                                            Movielist
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </>
                }
                {!!movieDetail && !!movieDetail.is_release &&
                    <div className={"reviews-list"}>
                    <div className={"review-title"}>
                        <p>Related Review{!!isLogin && !isVisitor(USERMESSAGE)
                            && <span onClick={() => {
                                reviewsInfoRef && reviewsInfoRef.current && reviewsInfoRef.current.changeVisible
                                && reviewsInfoRef.current.changeVisible(true, movieDetail.moviename + setYear(movieDetail.year),
                                    movieDetail.mid, USERMESSAGE && USERMESSAGE.uid || null, movieDetail.is_user_rate || 0);
                            }}
                            >Add review and rating</span>}</p>
                        {reviewsList && reviewsList.length > 2 &&
                            <div
                                onClick={() => {
                                    window.location.href = "/movie/reviewList?movieName=" + movieDetail.moviename + setYear(movieDetail.year)
                                        + "&movieId=" + initQuery.movieId
                                }}
                                className={"review-more"}>
                                More >
                            </div>
                        }
                    </div>
                    <div className={"review-box"}>
                        {reviewsList && reviewsList.map((item, index) => {
                            if (index >= 2) {
                                return null;
                            }
                            const userReview = item.userReview;
                            return <div className={`review-box-item ${(index === reviewsList.length - 1 || index === 1)
                            && "review-box-item-no-border" || ""}`}
                                        key={"review-box-item-" + index}>
                                <div className={"user-logo"}>
                                    <Avatar
                                        onClick={() => {
                                            goUserDetail(item.uid);
                                        }}
                                        size={40} icon={<UserOutlined/>}/>
                                </div>
                                <div className={"review-body"}>
                                    <div className={"user-name"}>
                                        <span className={"userName"}>Review By:<span>{item.username}</span></span>
                                        {(item.rate || 0) > 0 && <div className={"rate"}>
                                            <RateComponent style={{
                                                fontSize: "14px"
                                            }} defaultValue={(item.rate || 0) <= 0 ? 0 : (item.rate)}/>
                                            &nbsp;({(item.rate || 0) <= 0 ? 0 : (item.rate)})
                                        </div>}
                                    </div>
                                    <div
                                        className={`review-body-msg ${(!isLogin || isVisitor(USERMESSAGE)) && "review-body-msg-margin-bottom" || ""}`}>
                                        {item.review}
                                    </div>
                                    <div style={{
                                        fontSize: "12px",
                                        marginTop: "5px",
                                        color: "#999"
                                    }} className={"userName"}>&nbsp;{item.utime}</div>
                                    {!!isLogin && !isVisitor(USERMESSAGE) && <div style={{
                                        marginBottom: "15px"
                                    }} className={"operation"}>
                                        <div className={"operation-like"}>
                                            <div
                                                onClick={() => {
                                                    likeReview({
                                                        add_or_del: !item.is_user_likeReview ? "add" : "del",
                                                        uid: USERMESSAGE && USERMESSAGE.uid || null,
                                                        mrid: item.mrid
                                                    }).then(res => {
                                                        if (res.code === 200) {
                                                            const _reviewsList = _.cloneDeep(reviewsList);
                                                            const isLike = _reviewsList[index].is_user_likeReview;
                                                            const like_count = _reviewsList[index].like_count;
                                                            _reviewsList[index].is_user_likeReview = !isLike;
                                                            if (!item.is_user_likeReview) {
                                                                _reviewsList[index].like_count = (like_count || 0) + 1;
                                                            } else {
                                                                _reviewsList[index].like_count = (like_count || 0) - 1;
                                                            }

                                                            changeReviewsList(_reviewsList);
                                                            message.success(res.msg);
                                                        } else {
                                                            message.error(res.msg);
                                                        }
                                                    })

                                                }}
                                                className={"image-box"}>{svgGet(0, item.is_user_likeReview)}</div>
                                            <div className={"a-href"}>
                                                {!!item.is_user_likeReview && "Like review"}
                                            </div>
                                        </div>
                                        <div className={"operation-like-number"}>
                                            {getMsg(item.like_count)} {(item.like_count || 0) >= 2 ? "Likes" : "Like"}
                                        </div>
                                        <div
                                            onClick={() => {
                                                reviewsThisRef && reviewsThisRef.current && reviewsThisRef.current.changeVisible
                                                && reviewsThisRef.current.changeVisible(true, item.username,
                                                    item.mrid, USERMESSAGE && USERMESSAGE.uid || null);
                                            }}
                                            className={"operation-review-this"}>
                                            <MessageOutlined/>
                                            &nbsp;&nbsp;Review this
                                        </div>
                                    </div>}
                                    {
                                        userReview && userReview.map((item2, index2) => {
                                            if (index2 >= 2) {
                                                return null;
                                            }
                                            return <div
                                                style={{
                                                    marginLeft: 0,
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    paddingBottom: "5px"
                                                }}
                                                className={`review-box-item ${(index2 === userReview.length - 1 || index2 === 1) && "review-box-item-no-border" || ""}`}
                                                key={"review-box-item-user-review-" + index2}>
                                                <div className={"user-logo"}>
                                                    <Avatar
                                                        onClick={() => {
                                                            goUserDetail(item2.uid);
                                                        }}
                                                        size={40} icon={<UserOutlined/>}/>
                                                </div>
                                                <div className={"review-body"}>
                                                    <div className={"user-name"}>
                                                        <span className={"userName"}>Review By:<span>{item2.username}</span></span>
                                                    </div>
                                                    <div
                                                        style={{marginTop: "5px"}}
                                                        className={`review-body-msg ${(!isLogin || isVisitor(USERMESSAGE)) && "review-body-msg-margin-bottom" || ""}`}>
                                                        {item2.review}
                                                    </div>
                                                    <div style={{
                                                        fontSize: "12px",
                                                        marginTop: "5px",
                                                        color: "#999"
                                                    }} className={"userName"}>&nbsp;{item2.utime}</div>
                                                </div>
                                            </div>
                                        })
                                    }
                                    <div style={{width: "100%", height: "15px"}}/>
                                </div>
                            </div>
                        })}
                        {(!reviewsList || reviewsList.length === 0) &&
                            <h6 className={"no-review-style"}>
                                There is no review
                            </h6>}
                    </div>
                </div>}
            </div>
            {recommendList && recommendList.length > 0 && <ScrollImageComponent
                goHrefMore={() => {
                    window.location.href = "/movie/similarMovie?movieId=" + initQuery.movieId
                }}
                typeFrom={"movieDetail"}
                uid={USERMESSAGE && USERMESSAGE.uid || null}
                listCount={recommendListCount}
                isLogin={isLogin && !isVisitor(USERMESSAGE)} list={recommendList}
                title={isLogin && !isVisitor(USERMESSAGE) ? "RECOMMEND FOR YOU SIMILAR" : "SIMILAR MOVIES"}/>}

            {/*推荐列表*/}
            {recommendedMovieList.length !== 0 &&<h6 style={{width : "80%",
                margin:"50px 10% 20px 10%",
                fontSize: "16px",
                fontWeight: 700,
                height: "40px",
                borderBottom: "1px solid #d7d7d7"
            }}>RECOMMEND MOVIE LIST WITH CURRENT FILM</h6>}
            <div className={"imgBox-detail-home"}>
                {recommendedMovieList &&
                    recommendedMovieList.map((item, index) =>{
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

            <RatingComponent
                changeRating={(mid, rate, avg_rate) => {
                    if (mid === movieDetail.mid) {
                        displayMovieReviewService();
                        getRateDisPlay();
                        const _movieDetail = _.cloneDeep(movieDetail);
                        _movieDetail.avg_rate = avg_rate;
                        _movieDetail.is_user_rate = rate;
                        _movieDetail.is_user_wish = false;
                        _movieDetail.is_user_watch = false;
                        _movieDetail.wishlist_num = (_movieDetail.wishlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
                        _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
                        const _is_user_watch = _movieDetail.is_user_watch;
                        if (!_is_user_watch) {
                            _movieDetail.is_user_watch = true;
                            _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0) + 1;
                        }

                        changeMovieDetail(_movieDetail);
                        changeRateChange(false);
                        setTimeout(() => {
                            changeRateChange(true);
                        }, 0)
                    }
                }}
                ratingRef={ratingRef}/>

            <ReviewsInfoComponent
                changeReview={() => {
                    displayMovieReviewService();
                }}
                changeRating={(mid, rate, avg_rate) => {
                    if (mid === movieDetail.mid) {
                        displayMovieReviewService();
                        getRateDisPlay();
                        const _movieDetail = _.cloneDeep(movieDetail);
                        _movieDetail.avg_rate = avg_rate;
                        _movieDetail.is_user_rate = rate;
                        _movieDetail.is_user_wish = false;
                        _movieDetail.is_user_watch = false;
                        _movieDetail.wishlist_num = (_movieDetail.wishlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
                        _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0) - 1 < 0 ? 0 : ((_movieDetail.wishlist_num || 0) - 1);
                        const _is_user_watch = _movieDetail.is_user_watch;
                        if (!_is_user_watch) {
                            _movieDetail.is_user_watch = true;
                            _movieDetail.watchlist_num = (_movieDetail.watchlist_num || 0) + 1;
                        }

                        changeMovieDetail(_movieDetail);
                        changeRateChange(false);
                        setTimeout(() => {
                            changeRateChange(true);
                        }, 0)
                    }
                }}
                reviewsInfoRef={reviewsInfoRef}/>
            <ReviewsThisComponent
                changeReview={() => {
                    displayMovieReviewService();
                }}
                reviewsThisRef={reviewsThisRef}/>

            <RatingPersonComponent USERMESSAGE={USERMESSAGE} ratingPersonRef={ratingPersonRef}/>


            {/*添加和编辑的弹窗*/}
            <Modal visible={showModel} onCancel={() => setShowModel(false)} onOk={() => addToMovieList(molid, mid)}>
                <Select placeholder={'existing movie list'} style={{margin: '20px 0', width: '100%',}} onChange={(v) => setMolid(v)}>
                    {movieList.map((item, index) => <Option value={item.molid} key={index}>{item.title}</Option>)}
                </Select>
                <a onClick={() => {
                    setShowModel(false)
                    setShowAddMoviesListModel(true)
                }}><PlusOutlined/>&nbsp;Create new movielist</a>
            </Modal>

            <Modal visible={showAddMoviesListModel} onCancel={() => setShowAddMoviesListModel(false)} onOk={() => {
                createMovieList()
            }}>
                <label>List Name</label>
                <Input type="text" value={listName} onChange={e => setListName(e.target.value)}/>
                <label>List Description</label>
                <TextArea
                    maxLength={250}
                    autoSize={{minRows: 4, maxRows: 6}}
                    allowClear
                    value={listDescription}
                    onChange={e => setListDescription(e.target.value)}
                />
            </Modal>
        </PageBase>
    )
}
Detail.getInitialProps = async (status) => {
    const movieId = status && status.query && status.query.movieId;
    return {
        initQuery: {
            movieId
        }
    }
}
export default Detail
