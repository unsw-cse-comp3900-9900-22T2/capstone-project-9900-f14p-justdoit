import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import ScrollImageComponent from "../../components/Home/ScrollImage"
import HomeSearchComponent from "../../components/BrowseBy/HomeSearch"
import homeStyle from "./home.less";
import {getMovies} from "../MockData";
import {isVisitor} from "../../util/common";
import UserMsg from "./userMsg";
const BrowseBy = ({USERMESSAGE,queryForBrowseBy}) => {
  const [list,changeList] = useState([]);
  const [isSearch,changeIsSearch] = useState(!!queryForBrowseBy);
  useEffect(()=>{
    console.log("USERMESSAGE",USERMESSAGE)
    getMovies({
      uid : USERMESSAGE && USERMESSAGE.uid || null
    }).then(res => {
       if(res.code === 200){
          const {result} = res;
          const {mlist} = result;
          const _list = [];
          let  childList = [];
          for(let i = 0 ; i < mlist.length ; i++){
               childList.push(mlist[i]);
               if(i % 4 === 3){
                 _list.push(childList);
                 childList = _.cloneDeep(childList);
                 childList = [];
               }
          }
         changeList(_list)
       }
    }).catch(err => {
   const res = {
     "code": 200,
     "result": {
       "count": 16,
       "mlist": [
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/sm/upload/hf/o9/fn/p4/adogswill-ms-0-230-0-345-crop.jpg?k=c61671eb55",
           "description": "The (mis)adventures of João Grilo and Chicó in Brazil's Northeastern region. The four-chapter miniseries original version of O Auto da Compadecida.",
           "director": "Guel Arraes",
           "genre": [
             "comedy",
             "drama"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Portuguese",
           "mid": "PtXiSvs7VZ1655993156",
           "moviename": "A Dog's Will",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/1/9/8/6198-radiohead-in-rainbows-from-the-basement-0-230-0-345-crop.jpg?k=2cf1b66170",
           "description": "A live performance by Radiohead of their 2007 album In Rainbows. This was their first of two full-episode performances, filmed at Maida Vale Studios in London, as part of the ‘From the Basement’ television series produced by Nigel Godrich, Dilly Gent, James Chads and John Woollcombe.",
           "director": "David Barnard",
           "genre": [
             "music",
             "documentary"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "gtwXejS2qW1655993156",
           "moviename": "Radiohead: In Rainbows – From the Basement",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/7/4/7/7/7/7/747777-twenty-one-pilots-livestream-experience-0-230-0-345-crop.jpg?k=adaa64c503",
           "description": "A one-night livestream concert performed by Twenty One Pilots on May 21, 2021, introducing their newest album \"Scaled and Icy\".",
           "director": "Jason Zada",
           "genre": [
             ""
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "A1tWB7LrTz1655993156",
           "moviename": "Twenty One Pilots: Livestream Experience",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/3/7/6/9/8/2/376982-national-theatre-live-angels-in-america-part-1-millennium-0-230-0-345-crop.jpg?k=98de0869a6",
           "description": "The National Theatre's live theatrical production of Tony Kushner's two-part play 'Angels In America' about New Yorkers grappling with the AIDS crisis during the mid-1980s.",
           "director": "Bridget Caldwell",
           "genre": [
             ""
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "SmZ6jXWIQL1655993156",
           "moviename": "National Theatre Live: Angels In America — Part One: Millennium Approaches",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/sm/upload/sw/n5/tx/py/okupas-0-230-0-345-crop.jpg?k=dcb4b63e62",
           "description": "During the year 2000, Ricardo, Pollo, Walter and Chiqui occupied a house in the Buenos Aires neighborhood of Congreso. The four young people forge a strong friendship that leads them to go through different stories of crime, drugs and social marginalization.",
           "director": "Bruno Stagnaro",
           "genre": [
             "drama",
             "crime"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Spanish",
           "mid": "CZYVHD2Ohi1655993156",
           "moviename": "Okupas",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/3/7/6/9/8/6/376986-national-theatre-live-angels-in-america-part-2-perestroik-0-230-0-345-crop.jpg?k=c981233346",
           "description": "America in the mid-1980s. In the midst of the AIDS crisis and a conservative Reagan administration, New Yorkers grapple with life and death, love and sex, heaven and hell. This new staging of Tony Kushner's multi-award winning two-part play, Angels In America: A Gay Fantasia On National Themes, is directed by Olivier and Tony award winning director Marianne Elliott.",
           "director": "Bridget Caldwell",
           "genre": [
             ""
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "xH9SsaZvzf1655993156",
           "moviename": "National Theatre Live: Angels In America — Part Two: Perestroika",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/7/3/0/8/0/2/730802-reply-1988-0-230-0-345-crop.jpg?k=fd6cdaa2fe",
           "description": "A nostalgic trip back to the late 1980s through the lives of five families and their five teenage kids living in a small neighborhood in Seoul.",
           "director": "Shin Won-ho",
           "genre": [
             ""
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Korean",
           "mid": "mZgHj5s7uP1655993156",
           "moviename": "Reply 1988",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/0/7/2/2/1/607221-cowboy-bebop-0-230-0-345-crop.jpg?k=9336c29399",
           "description": "In 2071, roughly fifty years after an accident with a hyperspace gateway made the Earth almost uninhabitable, humanity has colonized most of the rocky planets and moons of the Solar System. Amid a rising crime rate, the Inter Solar System Police (ISSP) set up a legalized contract system, in which registered bounty hunters (also referred to as \"Cowboys\") chase criminals and bring them in alive in return for a reward.",
           "director": "Ikurô Satô Kunihiro Mori …",
           "genre": [
             "western",
             "animation"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Japanese",
           "mid": "LC97Na0ATE1655993156",
           "moviename": "Cowboy Bebop",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/0/8/9/3/2/608932-monster-0-230-0-345-crop.jpg?k=f0419427b0",
           "description": "Kenzou Tenma, a Japanese brain surgeon in Germany, finds his life in utter turmoil after getting involved with a psychopath that was once a former patient.",
           "director": "Kazuhisa Oono Masayuki Kojima",
           "genre": [
             "mystery",
             "crime",
             "drama",
             "animation"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Japanese",
           "mid": "wG1NL0PIxF1655993156",
           "moviename": "Monster",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/2/0/2/8/6/5/202865-avatar-spirits-0-230-0-345-crop.jpg?k=2e22174ea1",
           "description": "Bryan Konietzko and Michael Dante DiMartino, co-creators of the hit television series, Avatar: The Last Airbender, reflect on the creation of the masterful series.",
           "director": "Kurt Mattila",
           "genre": [
             ""
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "genklLGTxU1655993156",
           "moviename": "Avatar Spirits",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/8/4/4/9/0/8/844908-bts-permission-to-dance-on-stage-seoul-live-viewing-0-230-0-345-crop.jpg?k=84a939c941",
           "description": "‘BTS PERMISSION TO DANCE ON STAGE - SEOUL’, a performance for BTS and ARMY to dance together live. Join us as BTS and ARMY become one once again with music and dance in this unmissable live concert experience broadcast from Seoul to cinemas around the world! ‘BTS PERMISSION TO DANCE ON STAGE’ is the latest world tour series headlined by 21st century pop icons BTS, featuring powerful performances and the greatest hit songs from throughout their incredible career. The earlier Los Angeles shows were seen by approximately 813,000 people across the four sold-out shows, making them one of the most successful shows in 2021.",
           "director": "",
           "genre": [
             "documentary",
             "music"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "",
           "mid": "dAKEOmG85B1655993156",
           "moviename": "BTS Permission to Dance On Stage - Seoul: Live Viewing",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/3/4/1/0/9/634109-nana-0-230-0-345-crop.jpg?k=37c7a02658",
           "description": "Nana is a 2006 anime series based upon the manga of the same name. It centers on two girls with the same name and of the same age, crossing paths and ending up living together in Tokyo.",
           "director": "Hiroshi Kugimiya Katsuyoshi Yatabe …",
           "genre": [
             "drama",
             "comedy",
             "animation"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "Japanese",
           "mid": "mjAfko1iYE1655993156",
           "moviename": "Nana",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/3/8/2/4/3/638243-harry-styles-behind-the-album-the-performances-0-230-0-345-crop.jpg?k=67e919e6d6",
           "description": "With a full band at his side, Styles performs songs from his debut album in London's legendary Abbey Road Studios.",
           "director": "Paul Dugdale",
           "genre": [
             "music",
             "documentary"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "1D0X8SCEcp1655993156",
           "moviename": "Harry Styles: Behind the Album - The Performances",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/6/6/4/5/2/66452-taylor-swift-speak-now-world-tour-live-0-230-0-345-crop.jpg?k=90d6761a4f",
           "description": "Recorded during her Speak Now World Tour in 2011, this live recording collects 18 performances from the country-pop starlet, including almost all songs from her 2010 studio album \"Speak Now\".",
           "director": "Ryan Polito",
           "genre": [
             "music",
             "documentary"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "H9rlyuR6iW1655993156",
           "moviename": "Taylor Swift: Speak Now World Tour Live",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/3/4/3/9/1/1/343911-over-the-garden-wall-0-230-0-345-crop.jpg?k=462177733a",
           "description": "Two brothers, Wirt and Greg, find themselves lost in the Unknown; a strange forest adrift in time. With the help of a wise old Woodsman and a foul-tempered bluebird named Beatrice, Wirt and Greg must travel across this strange land, in hope of finding their way home. Join them as they encounter surprises and obstacles on their journey through the wood.",
           "director": "Nate Cash",
           "genre": [
             "animation",
             "mystery",
             "family",
             "comedy"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "English",
           "mid": "g6ukoLn0S21655993156",
           "moviename": "Over the Garden Wall",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         },
         {
           "avg_rate": null,
           "cast": null,
           "coverimage": "https://a.ltrbxd.com/resized/film-poster/4/2/6/4/0/6/426406-parasite-0-230-0-345-crop.jpg?k=2d9ea1c1b9",
           "description": "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
           "director": "Bong Joon-ho",
           "genre": [
             "comedy",
             "drama",
             "thriller"
           ],
           "is_user_dislike": 0,
           "is_user_like": 0,
           "is_user_watch": 0,
           "is_user_wish": 0,
           "language": "",
           "mid": "lStE9gLC711655993156",
           "moviename": "Parasite",
           "num_like": 0,
           "release_date": null,
           "watchlist_num": 0,
           "wishlist_num": 0
         }
       ]
     }
   }
      if(res.code === 200){
        const {result} = res;
        const {mlist} = result;
        const _list = [];
        let  childList = [];
        for(let i = 0 ; i < mlist.length ; i++){
          childList.push(mlist[i]);
          if(i % 4 === 3){
            _list.push(childList);
            childList = _.cloneDeep(childList);
            childList = [];
          }
        }
        changeList(_list)
      }
    })
  },[]);
  return (
    <PageBase USERMESSAGE={USERMESSAGE}>
      <style dangerouslySetInnerHTML={{ __html: homeStyle }} />
      <HomeSearchComponent
          queryForBrowseBy={queryForBrowseBy}
        uid={USERMESSAGE && USERMESSAGE.uid || null}
          USERMESSAGE={USERMESSAGE}
        changeIsSearch={(isSear)=>{
        changeIsSearch(isSear)
      }}/>
      {!isSearch && <ScrollImageComponent
          listCount={16}
          uid={USERMESSAGE && USERMESSAGE.uid || null}
                            isLogin={!!USERMESSAGE && !isVisitor(USERMESSAGE)}
          list={list} title={"RECENT POPULAR FILMS"}/>}
    </PageBase>
  )
}
BrowseBy.getInitialProps = async (status) => {

  let queryForBrowseBy = status && status.query && status.query.queryForBrowseBy;
  try {
    queryForBrowseBy = JSON.parse(queryForBrowseBy);
  }catch (err){
    queryForBrowseBy = null;
  }
  return {
    queryForBrowseBy
  }
}
export default BrowseBy
