/**
 * Created by lei_sun on 2019/7/9.
 */
import serviceFetch from '../../util/serviceFetch'
let serviceObj = {};
serviceObj.getTime = function(obj){
    const json = {
        "request": {
            ...obj
        }
    }
    //1,new
    const oAjax = new XMLHttpRequest();
    let data = "";
    oAjax.open('POST',  '/api/time/getTime', false);//false表示同步请求

    oAjax.setRequestHeader("Content-type", 'application/json');

    oAjax.onreadystatechange = function() {
        //6,通过状态确认完成
        if (oAjax.readyState == 4 && oAjax.status == 200) {
            //7,获取返回值，解析json格式字符串为对象
           data = JSON.parse(oAjax.responseText);
        } else {
            console.log(oAjax);
        }
    };
    try{
        oAjax.send(JSON.stringify(json));
    }catch (e) {

    }

    return data
}

serviceObj.getTimeAsyncTrue = function(obj){
    const json = {
        "request": {
            ...obj
        }
    }
    return new Promise((resolve, reject)=>{
        serviceFetch( '/api/time/getTime',json).then((res)=>{
            resolve(res)
        }).catch(reject)
    })
}

serviceObj.getTimeRedis = function(obj){
    const json = {
        "request": {
            ...obj
        }
    }
    return new Promise((resolve, reject)=>{
        serviceFetch( '/api/time/getRedis',json).then((res)=>{
            resolve(res)
        }).catch(reject)
    })
}
export default serviceObj
