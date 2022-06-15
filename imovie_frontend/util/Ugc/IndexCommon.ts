import { fatherSubMenu } from '../subMenu'

import _ from "lodash"

import { Base64 } from 'js-base64'

export const getNewList = (list, numberList, newList) => {
  if (!list || list.length === 0) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    const li = [...(numberList || [])]
    const _list = list[i]
    li.push(i)
    newList.push({
      id: li,
      value: _list.value
    })
    if (_list.child && _list.child.length > 0) {
      getNewList(_list.child, li, newList)
    }
  }
  return newList
}

export const getIdValue = (list, indexList, defaultOpenKeysList, iList) => {
  if (!list || list.length === 0) {
    return
  }
  const _index = indexList[0] > list.length - 1 ? 0 : indexList[0]
  const _list = list[_index]
  defaultOpenKeysList.push(_list.value)
  iList.push(_index)
  indexList.splice(0, 1)
  if (indexList.length > 1) {
    getIdValue(_list.child, indexList, defaultOpenKeysList, iList)
  }
  return {
    defaultOpenKeysList: defaultOpenKeysList,
    iList: iList
  }
}

export const getValueName = (value, list) => {
  for (let i = 0; i < list.length; i++) {
    const _li = list[i]
    if (_li.value === value) {
      return _li.name
    }
    if (_li.child && _li.child.length > 0) {
      const _name = getValueName(value, _li.child)
      if (typeof _name === 'string') {
        return _name
      }
    }
  }
}

export const get_key = (list, value) => {
  if (!list || list.length === 0) {
    return false
  }
  if (!list[0].child || list[0].child.length === 0) {
    value = list[0].value
  } else {
    value = get_key(list[0].child, value)
  }
  return value
}

export const setInitTabPange = (
  list,
  defaultJson,
  selectedKeys,
  selectedTabKeys,
  initContent,
  initTabFromInitContent
) => {
  /* if(!selectedKeys && !selectedTabKeys){
    return []
  }*/
  initContent = initContent || []
  let _initContentJsonList = []
  for (let i = 0; i < initContent.length; i++) {
    const _initContent = initContent[i]
    let _initContentJson
    const _initContentList = _initContent.split(returnContentSplit)
    if (_initContentList.length >= 4) {
      _initContentJson = {
        pageKey: _initContentList[0],
        id: _initContentList[1],
        title: _initContentList[2],
        fKey: _initContentList[3],
        initContent: _initContent
      }
      _initContentJsonList.push(_initContentJson)
    }
  }

  let _paneList = []
  const _pList = []
  if (!initTabFromInitContent) {
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const _li = list[i]
        _paneList.push({
          title: getValueName(_li, fatherSubMenu(null)),
          value: _li,
          content: _li === (selectedKeys || selectedTabKeys) ? _li : null,
          fValue: _li,
          key: 'tabPane_' + _li
        })
        _pList.push('tabPane_' + _li)
      }
    } else {
      if (defaultJson && defaultJson.length > 0) {
        _paneList = [
          {
            title: getValueName(
              selectedKeys || selectedTabKeys,
              fatherSubMenu(null)
            ),
            value: selectedKeys || selectedTabKeys,
            fValue: selectedKeys || selectedTabKeys,
            content: selectedKeys || selectedTabKeys,
            key: 'tabPane_' + (selectedKeys || selectedTabKeys)
          }
        ]
        _pList.push('tabPane_' + (selectedKeys || selectedTabKeys))
      } else {
        _paneList = []
      }
    }
  }
  if (!!_initContentJsonList && _initContentJsonList.length > 0) {
    for (let i = 0; i < _initContentJsonList.length; i++) {
      const __initContentJsonList = _initContentJsonList[i]
      _paneList.push({
        title: __initContentJsonList.title,
        value: __initContentJsonList.initContent,
        fValue: __initContentJsonList.fKey,
        content: __initContentJsonList.pageKey,
        id: getId(__initContentJsonList.initContent),
        key:
          'tabPane_' +
          __initContentJsonList.initContent +
          '&&' +
          'tabPane_' +
          __initContentJsonList.fKey
      })
    }
  }
  return _paneList
}

export const getId = (initContent) => {
  if (initContent) {
    const _initContentList = (initContent || '').split(returnContentSplit)
    return _initContentList[1]
  } else {
    return null
  }
}

export const getChild = (id, list) => {
  if (list[id].child && list[id].child.length > 0) {
    return list[id].child
  } else {
    return false
  }
}

export const pagesetCookie = () => {
  /*const _list = [];
  if(!list){
    delCookie(sessionKey,null);
    return
  }
  for(let i = 0 ; i < list.length ; i++){
    _list.push(list[i].value)
  }*/
  /* setCookie(sessionKey,_list.join(","),0.15);*/
}

export const addProps = (prop, msg, func) => {
  const { key, id } = msg
  const { redirectTo } = func
  return {
    ...(prop || {}),
    ...{
      msg: {
        pageKey: key,
        id: id
      },
      func: {
        redirectTo: (type, fatherkey, chlidrenJson) =>
          redirectTo(type, fatherkey, chlidrenJson)
      }
    }
  }
}

export const getActiveTabPaneKey = (initTab, initContent) => {
  if (initContent && initContent.length > 0) {
    const __initContent__ = initContent[initContent.length - 1]
    let _initContent, _initContentList
    _initContentList = __initContent__.split(returnContentSplit)
    _initContent =
      'tabPane_' + __initContent__ + '&&' + 'tabPane_' + _initContentList[3]
    if (_initContentList && _initContentList.length >= 3) {
      return _initContent
    } else {
      return initTab
    }
  }
  return initTab
}
export const returnContentSplit = '|_-|'

export const baseHref = (value, type) => {
  if (type === 0) {
    value.replace(/(^\s+)|(\s+$)/g, '')
    return Base64.encode(encodeURIComponent(_.clone(value || '')))
  } else if (type === 1) {
    let _value = ''
    try {
      _value = decodeURIComponent(Base64.decode(_.clone(value || '')))
      if (_value === value) {
        _value = ''
      }
      _value.replace(/(^\s+)|(\s+$)/g, '')
    } catch (e) {
      //console.log('e', e)
    }
    return _value
  }
  return value
}

export const setNewPageKey = (cKey, id, title, fKey, type) => {
  if (type === 0) {
    return cKey
  } else {
    return [cKey, id, title, baseHref(fKey, 0)].join(returnContentSplit)
  }
}

export const commonRedirectTo = (
  redirectToPro,
  refirectType,
  cKey,
  id,
  title,
  fKey,
  icon,
  redirectBack
) => {
  redirectToPro &&
    redirectToPro(refirectType, fKey, {
      title: title,
      id: id,
      pageKey: cKey,
      type: icon,
      redirectBack
    })
  return setNewPageKey(cKey, id, title, fKey, refirectType)
}

export const setHrefList = (
  nowList,
  nowListChange,
  thisPageKey,
  fromPageKey,
  initTabPane,
  type,
  thisKeyIsSelect
) => {
  nowList = _.clone(nowList || [])
  if (type === 'remove') {
    const index = nowList.indexOf(thisPageKey)
    if (index !== -1) {
      nowList.splice(index, 1)
    }
  }
  if (thisKeyIsSelect) {
    if (thisPageKey !== fromPageKey) {
      let index = nowList.indexOf(fromPageKey)
      if (index !== -1) {
        nowList.splice(index + 1)
        nowList.push(thisPageKey)
      } else {
        nowList = []
        let chooseIndex = 0
        const newList = []
        for (let i = 0; i < initTabPane.length; i++) {
          newList.push(initTabPane[i].value)
        }
        const setList = (key) => {
          const _number = newList.indexOf(key)
          if (_number !== -1) {
            if (_number < chooseIndex) {
              nowList.unshift(key)
            } else {
              nowList.push(key)
            }
            chooseIndex = _number
            const keyList = key.split(returnContentSplit)
            if (keyList.length >= 4) {
              setList(baseHref(keyList[3], 1))
            } else {
              return
            }
          } else {
            return
          }
        }
        setList(thisPageKey)
      }
    } else if (thisPageKey === fromPageKey) {
      nowList = []
      nowList.push(thisPageKey)
    }
  }

  nowListChange && nowListChange(nowList)
  return JSON.stringify(nowList)
}

export const getFatherList = (key) => {
  key = key || ''
  const _base64 = baseHref(baseHref(key, 1), 0)
  if (_base64 === key) {
    key = baseHref(key, 1)
  }
  const _keyList = key.split(returnContentSplit)
  if (_keyList.length >= 4) {
    key = baseHref(_keyList[3], 1)
    return getFatherList(key)
  } else {
    return key
  }
}

export const getSelectedKeysByInitContent = (initContent) => {
  if (!(initContent && initContent.length > 0)) {
    return ''
  }
  const _initContent = initContent[0]
  const _keyList = _initContent.split(returnContentSplit)
  let _val = ''
  if (_keyList.length >= 4) {
    _val = baseHref(_keyList[3], 1)
    _val = getFatherList(_val)
  }
  return {
    selectedKeys: _val || ''
  }
}
