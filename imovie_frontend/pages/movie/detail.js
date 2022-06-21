import PageBase from '../basePage'
import React, { useState, useEffect, useRef } from 'react'
import detailstyle from "./detail.less";
import {getQueryString} from "../../util/common";
const Detail = () => {
  useEffect(()=>{
  },[]);
  return (
    <PageBase>
      <style dangerouslySetInnerHTML={{ __html: detailstyle }} />
    </PageBase>
  )
}

export default Detail
