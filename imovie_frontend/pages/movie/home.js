import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import HomeSearchComponent from "../../components/Home/HomeSearch"
import homeStyle from "./home.less";
import {getQueryString} from "../../util/common";
const Home = () => {
  const [list1,changeList1] = useState([
     [{
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
      },{
       image : "https://swiperjs.com/demos/images/nature-1.jpg",
       look :24,
       like :24,
       collection : 256,
       movieName : "movie name"
     },{
       image : "https://swiperjs.com/demos/images/nature-1.jpg",
       look :25,
       like :24,
       collection : 256,
       movieName : "movie name"
     },{
       image : "https://swiperjs.com/demos/images/nature-1.jpg",
       look :26,
       like :24,
       collection : 256,
       movieName : "movie name"
     }],
    [{
      image : "https://swiperjs.com/demos/images/nature-2.jpg",
      look :23,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-2.jpg",
      look :24,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-2.jpg",
      look :25,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-2.jpg",
      look :26,
      like :24,
      collection : 256,
      movieName : "movie name"
    }],
    [{
      image : "https://swiperjs.com/demos/images/nature-3.jpg",
      look :23,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-3.jpg",
      look :24,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-3.jpg",
      look :25,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-3.jpg",
      look :26,
      like :24,
      collection : 256,
      movieName : "movie name"
    }],
    [{
      image : "https://swiperjs.com/demos/images/nature-4.jpg",
      look :23,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-4.jpg",
      look :24,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-4.jpg",
      look :25,
      like :24,
      collection : 256,
      movieName : "movie name"
    },{
      image : "https://swiperjs.com/demos/images/nature-4.jpg",
      look :26,
      like :24,
      collection : 256,
      movieName : "movie name"
    }]
  ])
  const [browseBy,changeBrowseBy] = useState(false);
  useEffect(()=>{
    const _browseBy = getQueryString("browseBy") === "1";
    changeBrowseBy(_browseBy)
  },[]);
  return (
    <PageBase>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      {
        browseBy && <HomeSearchComponent/>
      }
      <ScrollImageComponent list={list1} title={"RECENT POPULAR FILMS"}/>
      <ScrollImageComponent list={list1} title={"RECENT RELESE"}/>
      <ScrollImageComponent list={list1} title={"GUESS LIKE"}/>
    </PageBase>
  )
}

export default Home
