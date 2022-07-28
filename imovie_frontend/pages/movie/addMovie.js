import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import {displayMovieReview, likeReview} from "../MockData"
import {Button, message,Input,Select,DatePicker,Image} from "antd";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
import addMovieStyle from "./addMovie.less"
import _ from "lodash"
const dateFormat = 'YYYY/MM/DD';
const AddMovie = ({USERMESSAGE,initQuery}) => {
  const [msg,changeMsg] = useState({
      movieName : "",
      director : "",
      coverImage : "",
      genres : [],
      releaseTime : null,
      cast : "",
      country : "",
      language : "",
      duration : "",
      description : "",
      lookImage : false
  });
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
          genres,
          releaseTime,
          cast,
          country,
          language,
          duration,
          description,
      } = msg;
      return !(movieName && director && genres && genres.length > 0 && releaseTime
          && cast && country && language && duration && description)
    }
    function initMsg(){
      changeMsg({
          movieName : "",
          coverImage : "",
          director : "",
          genres : [],
          releaseTime : null,
          cast : "",
          country : "",
          language : "",
          duration : "",
          description : "",
      })
    }
    function submitMsg(){
      if(checkDisabled() || !USERMESSAGE){
          return;
      }
        const {
            movieName,
            director,
            genres,
            releaseTime,
            cast,
            country,
            language,
            duration,
            description,
        } = msg;
      const msg = {
          uid : USERMESSAGE && USERMESSAGE.uid || null,
          moviename : movieName,
          description,
          genre : genres.join(" "),
          cast,
          director,
          country,
          language,
          release_date : (releaseTime || "").replace(/\//g,"-"),
          year : (releaseTime || "").split("/")[0],
          duration
      }
      console.log("msg",msg)
    }
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
        <style dangerouslySetInnerHTML={{
            __html : addMovieStyle
        }}/>
        <div className={"add-movie-component"}>
            <div className={"add-movie-item"}>
                 <p>Movie Name</p>
                 <Input placeholder="movieName"
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
                    <Input placeholder="Cover image"
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
                                message.warning("please enter cover image")
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
                <Input placeholder="director"
                       onChange={(e)=>{
                           const _msg = _.cloneDeep(msg);
                           _msg.director = e.target.value;
                           changeMsg(_msg)
                       }}
                       value={msg.director}/>
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
                        placeholder: 'Genres',
                    }} />
                </div>
                <div className={"add-movie-item-flex"}>
                    <p>Release Time</p>
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
                <TextArea placeholder="cast"
                       onChange={(e)=>{
                           const _msg = _.cloneDeep(msg);
                           _msg.cast = e.target.value;
                           changeMsg(_msg)
                       }}
                      minRows={6}
                      maxRows={15}
                      value={msg.cast}/>
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
                        placeholder: 'country',
                    }} />
                </div>
                <div className={"add-movie-item-flex"}>
                    <p>Language</p>
                    <Input placeholder="language"
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
                <Input placeholder="duration"
                          onChange={(e)=>{
                              const _msg = _.cloneDeep(msg);
                              _msg.duration = e.target.value;
                              changeMsg(_msg)
                          }}
                          value={msg.duration}/>
            </div>
            <div className={"add-movie-item"}>
                <p>Description</p>
                <TextArea placeholder="description"
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
