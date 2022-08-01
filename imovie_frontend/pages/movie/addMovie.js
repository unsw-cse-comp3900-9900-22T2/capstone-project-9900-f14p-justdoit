import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import {insertMovie} from "../MockData"
import {Button, message,Input,Select,DatePicker,Image} from "antd";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import addMovieStyle from "./addMovie.less"
import _ from "lodash"
const dateFormat = 'YYYY/MM/DD';
import {CloseOutlined} from "@ant-design/icons"
const AddMovie = ({USERMESSAGE,initQuery}) => {
  const [msg,changeMsg] = useState({
      movieName : "",
      coverImage : "",
      director : [],
      genres : [],
      releaseTime : null,
      cast : [],
      country : "",
      language : "",
      duration : "",
      description : "",
      lookImage : false
  });
  const [castValue,changeCastValue] = useState("");
  const [directorValue,changeCastDirector] = useState("");
  const [genresList] = useState([{
      key : "Action",
      value : "Action"
  },{
      key : "Adventure",
      value : "Adventure"
  },{
      key : "Animation",
      value : "Animation"
  },{
      key : "Comedy",
      value : "Comedy"
  },{
      key : "Crime",
      value : "Crime"
  },{
      key : "Documentary",
      value : "Documentary"
  },{
      key : "Drama",
      value : "Drama"
  },{
      key : "Family",
      value : "Family"
  },{
      key : "Fantasy",
      value : "Fantasy"
  },{
      key : "History",
      value : "History"
  },{
      key : "Horror",
      value : "Horror"
  },{
      key : "Music",
      value : "Music"
  },{
      key : "Mystery",
      value : "Mystery"
  },{
      key : "Romance",
      value : "Romance"
  },{
      key : "Science Fiction",
      value : "Science Fiction"
  },{
      key : "Thriller",
      value : "Thriller"
  },{
      key : "TV Movie",
      value : "TV Movie"
  },{
      key : "War",
      value : "War"
  },{
      key : "Western",
      value : "Western"
  }])
    const [areaList] = useState([{
        key : "USA",
        value : "USA"
    },{
        key : "UK",
        value : "UK"
    },{
        key : "Australia",
        value : "Australia"
    },{
        key : "France",
        value : "France"
    },{
        key : "Germany",
        value : "Germany"
    },{
        key : "Italy",
        value : "Italy"
    },{
        key : "India",
        value : "India"
    },{
        key : "China",
        value : "China"
    },{
        key : "Korea",
        value : "Korea"
    },{
        key : "Japan",
        value : "Japan"
    },{
        key : "Thailand",
        value : "Thailand"
    },{
        key : "Others",
        value : "Others"
    }])
    function checkDisabled(){
      const {
          movieName,
          director,
          coverImage,
          genres,
          releaseTime,
          cast,
          country,
          language,
          duration,
          description,
      } = msg;
      return !(movieName && director && genres && genres.length > 0 && releaseTime
          && cast && cast.length > 0 && country && language && duration && checkIsNumber(duration)
          && description && coverImage)
    }
    function initMsg(){
      changeMsg({
          movieName : "",
          coverImage : "",
          director : [],
          genres : [],
          releaseTime : null,
          cast : [],
          country : "",
          language : "",
          duration : "",
          description : "",
      })
        changeCastValue("");
      changeCastDirector("");
    }
    function submitMsg(){
      if(checkDisabled() || !USERMESSAGE){
          return;
      }
        const {
            movieName,
            director,
            coverImage,
            genres,
            releaseTime,
            cast,
            country,
            language,
            duration,
            description,
        } = msg;
      const _msg = {
          uid : USERMESSAGE && USERMESSAGE.uid || null,
          moviename : movieName,
          description,
          genre : genres.join(" "),
          cast : cast.join(";"),
          director: director.join(";"),
          country,
          language,
          release_date : (releaseTime || "").replace(/\//g,"-"),
          duration : (duration || 0) * 1,
          coverimage : coverImage
      }
        insertMovie(_msg).then(res => {
            if(res.code === 200){
                message.success("insert successfully");
                initMsg();
            }else{
                message.error("insert failed")
            }
        }).catch(err => {
            message.error("insert failed")
        })
      console.log("msg",_msg)
    }
    function checkIsNumber(a){
      if(isNaN(Number(a,10))){
          return false
      } else{
          return true
      }
    }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
        <style dangerouslySetInnerHTML={{
            __html : addMovieStyle
        }}/>
        <div className={"add-movie-component"}>
            <div className={"add-movie-item"}>
                 <p>Movie Name</p>
                 <Input placeholder="please enter movie name"
                        onChange={(e)=>{
                            const _msg = _.cloneDeep(msg);
                            _msg.movieName = e.target.value;
                            changeMsg(_msg)
                        }}
                        value={msg.movieName}/>
            </div>
            <div className={"add-movie-item"}>
                <p>Cover image</p>
                <div className={"add-movie-flex"}>
                    <Input placeholder="Please enter the link of the cover image. If you need to confirm, please press check"
                           onChange={(e)=>{
                               const _msg = _.cloneDeep(msg);
                               _msg.coverImage = e.target.value;
                               changeMsg(_msg)
                           }}
                           value={msg.coverImage}/>
                    <Button
                        style={{
                            marginLeft : "10px"
                        }}
                        onClick={()=>{
                            if(!msg.coverImage){
                                message.warning("please enter cover image");
                                return;
                            }
                            const _msg = _.cloneDeep(msg);
                            _msg.lookImage = true;
                            changeMsg(_msg)
                        }}
                        type={"primary"}>CHECK</Button>
                </div>
                {
                    msg.lookImage && <Image
                    className={"image-box"}
                    src={msg.coverImage}
                    />
                }
            </div>
            <div className={"add-movie-item"}>
                <p>Director</p>
                <div className={"cast-label"}>
                    {
                        msg.director && msg.director.map((item,index) => {
                            return <div className={"cast-label-item"} key={"cast-director-label-item-" + index}>
                                {item} <CloseOutlined
                                onClick={()=>{
                                    const _msg = _.cloneDeep(msg);
                                    _msg.director.splice(index,1);
                                    changeMsg(_msg)
                                }}
                                className={"close"}/>
                            </div>
                        })
                    }
                </div>
                <Input placeholder="Please enter the director's name. Press enter after entering a director"
                       onChange={(e)=>{
                           changeCastDirector(e.target.value)
                       }}
                       onPressEnter={(e)=>{
                           const _msg = _.cloneDeep(msg);
                           const value = (e.target.value || "").trim();
                           const _cast =  _msg.director || [];
                           if(_cast.indexOf(value) < 0){
                               _cast.push(value)
                           }
                           _msg.director = _cast;
                           changeMsg(_msg);
                           changeCastDirector("");
                       }}
                       value={directorValue}/>
            </div>
            <div className={"add-movie-flex"}>
                <div className={"add-movie-item-flex"}>
                    <p>Genres</p>
                    <Select {... {
                        mode: 'multiple',
                        style: {
                            width: '100%',
                        },
                        value : msg.genres || [],
                        options : genresList,
                        onChange: (newValue) => {
                            const _msg = _.cloneDeep(msg);
                            _msg.genres = newValue || [];
                            changeMsg(_msg)
                        },
                        placeholder: 'Please select Genres'
                    }}
                        onScroll={(event)=>{
                            event.stopPropagation();
                        }}
                    />
                </div>
                <div className={"add-movie-item-flex"}>
                    <p>Release Date</p>
                    <DatePicker
                        value={msg.releaseTime &&
                        moment(msg.releaseTime,dateFormat) || null}
                        onChange={(date,dateString)=>{
                            console.log(dateString)
                            const _msg = _.cloneDeep(msg);
                            _msg.releaseTime = dateString;
                            changeMsg(_msg);
                        }}
                        format={dateFormat}
                    />
                </div>
            </div>
            <div className={"add-movie-item"}>
                <p>Cast</p>
                <div className={"cast-label"}>
                    {
                        msg.cast && msg.cast.map((item,index) => {
                            return <div className={"cast-label-item"} key={"cast-label-item-" + index}>
                                {item} <CloseOutlined
                                onClick={()=>{
                                    const _msg = _.cloneDeep(msg);
                                    _msg.cast.splice(index,1);
                                    changeMsg(_msg)
                                }}
                                className={"close"}/>
                            </div>
                        })
                    }
                </div>
                <Input placeholder="Please enter the cast's name. Press enter after entering a cast"
                       onChange={(e)=>{
                           changeCastValue(e.target.value)
                       }}
                       onPressEnter={(e)=>{
                           const _msg = _.cloneDeep(msg);
                           const value = (e.target.value || "").trim();
                           const _cast =  _msg.cast || [];
                           if(_cast.indexOf(value) < 0){
                               _cast.push(value)
                           }
                           _msg.cast = _cast;
                           changeMsg(_msg);
                           changeCastValue("");
                       }}
                      value={castValue}/>
            </div>
            <div className={"add-movie-flex"}>
                <div className={"add-movie-item-flex"}>
                    <p>Country</p>
                    <Select {... {
                        style: {
                            width: '100%',
                        },
                        value : msg.country || [],
                        options : areaList,
                        onChange: (newValue) => {
                            const _msg = _.cloneDeep(msg);
                            _msg.country = newValue || "";
                            changeMsg(_msg)
                        },
                        placeholder: 'Please select country',
                    }}
                        onScroll={(event)=>{
                            event.stopPropagation();
                        }}
                    />
                </div>
                <div className={"add-movie-item-flex"}>
                    <p>Language</p>
                    <Input placeholder="Please enter language"
                           onChange={(e)=>{
                               const _msg = _.cloneDeep(msg);
                               _msg.language = e.target.value;
                               changeMsg(_msg)
                           }}
                           value={msg.language}/>
                </div>
            </div>
            <div className={"add-movie-item"}>
                <p>Duration</p>
                <Input placeholder="Please enter duration"
                          onChange={(e)=>{
                              const _msg = _.cloneDeep(msg);
                              _msg.duration = e.target.value;
                              changeMsg(_msg)
                          }}
                          value={msg.duration}/>
            </div>
            <div className={"add-movie-item"}>
                <p>Description</p>
                <TextArea placeholder="Please enter description"
                          onChange={(e)=>{
                              const _msg = _.cloneDeep(msg);
                              _msg.description = e.target.value;
                              changeMsg(_msg)
                          }}
                          minRows={6}
                          maxRows={15}
                          value={msg.description}/>
            </div>
            <div className={"button-box"}>
                <Button onClick={()=>{
                    initMsg();
                }}>CLEAR</Button>
                <Button
                    onClick={()=>{
                        submitMsg();
                    }}
                    disabled={checkDisabled()}
                        type={"primary"}>SUBMIT</Button>
            </div>
        </div>

    </PageBase>
  )
}

export default AddMovie
