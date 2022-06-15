import fetch from 'isomorphic-unfetch'

let serviceFetch ;

serviceFetch = function(url, obj, method){
    if(method == undefined)
        method = 'post';

    method = method.toLowerCase();

    return new Promise((resolve, reject)=>{
        fetch(url,{
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(obj)
        }).then((res)=>{
            resolve(res.json())
        }).catch(reject)
    })
}

export default serviceFetch;