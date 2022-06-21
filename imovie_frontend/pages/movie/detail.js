import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import detailStyle from "./detail.less";
import {getQueryString} from "../../util/common";
const Detail = () => {
  const [movieDetail,changeMovieDetail]=useState({
    movieId :123323,
    image : "https://swiperjs.com/demos/images/nature-1.jpg",
    look :23000,
    like :24,
    isLike : false,
    isLook : false,
    isCollection : false,
    collection : 256,
    rate : 3,
    year : "2022",
    tags : [{
      value : "Renre",
      key : 1,
    },{
      value : "Renre1",
      key : 2,
    },{
      value : "Renre2",
      key : 3,
    }],
    movieName : "movie name",
    director : ["jerry jackson"],
    cast : ["Tom","Haidi"]
  })
  useEffect(()=>{
  },[]);
  return (
    <PageBase>
      <style dangerouslySetInnerHTML={{ __html: detailStyle }} />
      <div className={"movie-detail-box"}>
          <div className={"movie-msg-box"}>
            <p>{movieDetail.movieName}</p>
          </div>
      </div>
    </PageBase>
  )
}

export default Detail
