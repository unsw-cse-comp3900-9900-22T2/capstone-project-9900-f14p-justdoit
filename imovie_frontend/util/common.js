
import { Base64 } from "js-base64"
import {registerVisitor} from "../pages/MockData";
export const ten = (str) => {
  return str * 1 < 10 ? '0' + str : str + ''
}
export const setDate = (day) => {
  if (!day) {
    return ''
  }
  const _newDate = new Date(day)
  const y = _newDate.getFullYear()
  const mon = ten(_newDate.getMonth() + 1)
  const d = ten(_newDate.getDate())
  const h = ten(_newDate.getHours())
  const min = ten(_newDate.getMinutes())
  const s = ten(_newDate.getSeconds())
  return `${y}-${mon}-${d} ${h}:${min}:${s}`
}
export const tableSet = (name, value,goType) => {
  const data = {};
  for (let i in value) {
    const _queryData = value[i];
    if (
        _queryData !== null &&
        _queryData !== undefined &&
        _queryData !== '' &&
        _queryData !== 'null' &&
        _queryData !== 'undefined'
    ) {
      data[i] = _queryData;
    }
  }
  addHref(name, encodeURIComponent(JSON.stringify(data)),goType);
};
export const tableGet = (name, url) => {
  let _query = getQueryString(name, url);
  try {
    _query = JSON.parse(decodeURIComponent(_query));
    /* tableRemove(name);*/
  } catch (e) {
    _query = null;
  }
  return _query;
};
export const tableGetValue = (value, initValue) => {
  if (value !== null && value !== undefined && value !== 'null' && value !== 'undefined') {
    return value;
  }
  return initValue || '';
};
export const resInData = (value, data) => {
  if (data[value] === undefined) {
    return false
  }
  return true
}
export const hasTab = (value) => {
  if (value === undefined || value === null) {
    return true
  }
  return !!value
}
export const getQueryString = (name, url) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const href = url || window.location.href
  const s = href.indexOf('?')
  const r = href.substr(s + 1).match(reg)
  if (r != null) {
    const _r = decodeURIComponent(r[2]).split('#')
    return _r[0]
  }
  return null
}
export const getContentHref = (content) => {
  if (!content) {
    return ''
  }
  const re = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  content = content.replace(re, (a, b, c) => {
    return (
      '<a onclick="event && event.stopPropagation();window.open(\'' +
      a +
      '\')">' +
      a +
      '</a>'
    )
  })
  return content
}
export const getContentHrefForKnowledge = (content) => {
  if (!content) {
    return ''
  }
  const re = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  content = content.replace(re, (a, b, c) => {
    return (
      "<a target='_blank' style='color: #1890ff;' href='" +
      a +
      "'>" +
      a +
      '</a>'
    )
  })
  return content
}
export const isVisitor = (cookie) => {
   if(!cookie || !cookie.uid || cookie.role === 2){
     return true
   }
   return false
}
export const addHref = (type, val) => {
  try {
    const search = window.location.href.split('?')
    let tagUrl = ''
    if (search.length === 1 || !search[1]) {
      if (!!val) {
        tagUrl = type + '=' + val
      }
    } else {
      const searchList1 = search[1].split('&')
      if (
        getQueryString(type, null) !== undefined &&
        getQueryString(type, null) !== null
      ) {
        let listUrl = []
        let hasDays = false
        for (let i = 0; i < searchList1.length; i++) {
          let hasIndex = false
          let cl = searchList1[i].split('=')
          if (cl[0] === type) {
            if (!!val) {
              hasDays = true
              cl[1] = val
            } else {
              hasIndex = true
            }
            cl = cl.filter((item) => {
              return !!item
            })
          }

          const clStr = cl.join('=')
          if (!hasIndex) {
            listUrl.push(clStr)
          }
        }
        if (!hasDays) {
          if (!!val) {
            listUrl.push(type + '=' + val)
          }
        }
        tagUrl = listUrl.join('&')
      } else {
        if (!!val) {
          tagUrl = search[1] + '&' + type + '=' + val
        } else {
          tagUrl = search[1]
        }
      }
    }
    window.history.replaceState('forward', null, '?' + tagUrl)
    /* window.history.forward(1);*/
  } catch (e) {
    //console.log('点击选中出错了')
  }
}

export const setCookie = (name, value, expires) => {
  const time = new Date()
  time.setTime(time.getTime() + expires * 24 * 60 * 60 * 1000)
  document.cookie =
    name + '=' + encodeURIComponent(value) + '; expires=' + time.toUTCString()
}
export const getCookie = (name, cookie) => {
  if ((cookie === null || cookie === undefined) && typeof window !== "undefined") {
    cookie = document.cookie
  }
  if(!cookie){
      return null
  }
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
    arr = cookie.match(reg)
  if (!!arr && !!arr[2]) {
    return decodeURIComponent(arr[2])
  } else {
    return null
  }
}

export const delCookie = (name, cookie) => {
  if (cookie === null) {
    cookie = document.cookie
  }
  const cval = getCookie(name, cookie)
  if (cval != null) {
    setCookie(name, '', -1)
  }
}
export const cookieUserMessageDo = (
  userMessage,
  hasCookieDo,
  hasNotCookieDo
) => {
  let cookie = userMessage || getCookie('USER_MESSAGE', userMessage)
  if (!cookie) {
    return hasNotCookieDo && hasNotCookieDo()
  } else {
    cookie = userMessage || JSON.parse(cookie)
    const { token, name, type } = cookie
    const _token = Base64.decode(token)
    const _tokenList = _token.split('&&')
    const thisTime = new Date().getTime()
    if (_tokenList[0] === name && thisTime - _tokenList[2] < 0) {
      return hasCookieDo && hasCookieDo(name, token, type)
    } else {
      return hasNotCookieDo && hasNotCookieDo()
    }
  }
}
export const getToken = (token) => {
  let _token = ''
  const tokenJson = {}
  if (!!token) {
    try {
      _token = Base64.decode(token)
      const tokenList = _token.split('&&')
      if (tokenList.length > 0) {
        tokenJson['name'] = tokenList[0]
      }
      if (tokenList.length > 1) {
        tokenJson['id'] = tokenList[1]
      }
      if (tokenList.length > 2) {
        tokenJson['time'] = tokenList[2]
      }
      if (tokenList.length > 3) {
        tokenJson['type'] = tokenList[3]
      }
      if(tokenList.length > 4){
        tokenJson["nameText"] = tokenList[4]
      }
    } catch (e) {}
  }
  return tokenJson
}
export const checkHref = (href) => {
  if (!href) {
    return false
  }
  return !!href.match(
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g
  )
}
export const getTableMaxHeight = (tableId) => {
  let tableMaxHeight = 0
  if (typeof window !== 'undefined') {
    const clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    const tableDom = document.getElementById(tableId)
    const tableOffsetTop = ((tableDom && tableDom.offsetTop) || 0) + 60
    tableMaxHeight = clientHeight - tableOffsetTop - 130
  }
  return tableMaxHeight
}
export const checkType = (dom) => {
  const nodeMameList = ["BR","STYLE","SCRIPT","LINK"];
  return nodeMameList.indexOf(dom.nodeName) === -1 && !!dom.innerHTML && !!dom.innerText
}
export const getDomForSkeleton = (dom,newDom) => {
    newDom = newDom || document.createElement("div");
    let firstDom = dom.firstElementChild;
    let nextDom = dom.nextElementSibling;
    if(!!firstDom){
      while (!!firstDom && !checkType(firstDom)) {
        firstDom = firstDom.nextElementSibling
      }
      if(!!firstDom) {
        const firstNewDom = document.createElement("div");
        if(firstDom.id){
          firstNewDom.id = firstDom.id;
        }
        if(firstDom.className){
          firstNewDom.className = firstDom.className;
        }
        newDom.appendChild(firstNewDom);
        getDomForSkeleton(firstDom, firstNewDom);
      }
    }
    if(!!nextDom){
      while (!!nextDom && !checkType(nextDom)) {
        nextDom = nextDom.nextElementSibling
      }
      if(!!nextDom) {
        const nextNewDom = document.createElement("div");
        if(nextDom.id){
          nextNewDom.id = nextDom.id;
        }
        if(nextDom.className){
          nextNewDom.className = nextDom.className;
        }
        newDom.parentNode.appendChild(nextNewDom);
        getDomForSkeleton(nextDom, nextNewDom);
      }
    }
    return newDom
}
