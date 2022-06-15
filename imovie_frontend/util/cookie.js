export const setCookie = (name, value, expires) => {
  const time = new Date()
  time.setTime(time.getTime() + expires * 24 * 60 * 60 * 1000)
  document.cookie =
    name + '=' + encodeURIComponent(value) + '; expires=' + time.toUTCString()
}
export const getCookie = (name, cookie) => {
  if (cookie === null || cookie === undefined) {
    cookie = document.cookie
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