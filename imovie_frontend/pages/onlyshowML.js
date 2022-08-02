import PageBase from './basePage'
// import onlyShowMLStyle from "./onlyShowML.less";
// import React, {useEffect, useState} from 'react'
// import {Button, Card, Input, List, message, Modal, Select} from "antd";
// import {DeleteTwoTone, ExclamationCircleOutlined, SearchOutlined} from "@ant-design/icons";
// import {
//     addMoviesList,
//     addMovieToList,
//     delMovieFromList,
//     delMoviesList,
//     editMoviesList,
//     getMoviesInList,
//     getMoviesList,
//     getWatchlist, searchBy,
//     searchResult
// } from "./MockData";
// import ImageDom from "../Home/ImageDom";
// import DocunceSelectComponent from "../DounceSelect";

// const {Meta} = Card;
// const {TextArea, Search} = Input;
// const {Option} = Select;
// const {confirm} = Modal;


const OnlyShowML = ({USERMESSAGE}) => {
    console.log(USERMESSAGE)
    return <PageBase USERMESSAGE={USERMESSAGE}>        
        {/* <style dangerouslySetInnerHTML={{__html: onlyShowMLStyle}}/> */}
        {/* <div> */}
        {/* <div className={"imgBox"} style={{position: "relative", top: 50}}>
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
        </div> */}
        </PageBase>
}

export default OnlyShowML