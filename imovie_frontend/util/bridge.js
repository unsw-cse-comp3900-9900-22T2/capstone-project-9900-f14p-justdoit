import phoneUtil from './phone';

const noop = () => {};

let invokeTimeout = null;
let registerTimeout = null;
let invokeTryTimes = 0;
let registerTryTimes = 0;
const TRY_TIMES = 10;

/**
 * @desc 使用iframe的方式与native通信，创建bridge对象
 * @param {function} callback - callback接受bridge对象，
 * bridge对象有registerHandler和callHandler两个方法，首先
 * 调用registerHandler，然后调用callHandler方法。
 */
const setupWebViewJavascriptBridge = (callback) => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  return setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

/**
 * @desc 调用native的方法
 * @param {string} method - 要调用的native方法名
 * @param {string} params - 调用native方法所需要传递的参数，
 * 如果需要传递对象JSON.stringify成string, 默认为空字符串。
 * @param {function} callback - 调用native方法之后的callback。
 */
const invoke = (method, params = '', callback = noop) => {
  /*
  console.log('========== INVOKE BEGIN ==========');
  console.log('==> bridge: ', window.WebViewJavascriptBridge);
  console.log('==> params: ', params);
  console.log('==> method: ', method);
  console.log('==> callback: ', callback);
  console.log('========== INVOKE END ==========');
  */

  console.log('invoke', method, params)

    if(!window.bridge){
        if(invokeTryTimes > TRY_TIMES){
            return callback && callback();
        }
        invokeTryTimes++;
        console.log('invoke_tryTimes: ' + invokeTryTimes);
        //alert('invoke_tryTimes: ' + invokeTryTimes + ', ' + method);
        invokeTimeout = setTimeout(()=>{
            invoke(method, params, callback)
        }, 1000);
    } else {
        //alert('bridge: ' + window.bridge + ', ' + method + ', ' + invokeTryTimes);
        invokeTryTimes = 0;

        window.bridge.callHandler(method, params, function(res){
            if(typeof(res) === "string"){
                if(res.indexOf('callback') == -1)
                    res = JSON.parse(res)
            }
            console.log('invoke_res: ' + JSON.stringify(res))
            callback && callback(res);
        });
    }

  /*
  if(!!!phoneUtil.isInIOS()){  // Android
      if (window.WebViewJavascriptBridge) {
          window.WebViewJavascriptBridge.callHandler(method, params, function(res){
              console.log('invoke_res: ' + JSON.stringify(res))
              callback && callback(res);
          });
      } else {
          document.addEventListener('WebViewJavascriptBridgeReady', function() {
              console.log('invoke_WebViewJavascriptBridgeReady', method, params)
              window.WebViewJavascriptBridge.callHandler(method, params, function(res){
                  console.log('invoke_WebViewJavascriptBridgeReady_res: ' + JSON.stringify(res))
                  callback && callback(res);
              });
          }, false);
      }
  } else {  // iOS
      setupWebViewJavascriptBridge(bridge => bridge.callHandler(method, params, callback));
  }
  */
};

// 国旅 Network.js 需要使用
export const callHandler = (method, params = '') => {
  return new Promise((resolve, reject)=>{
      try{
          invoke(method, params, resolve)
      } catch(e){
          reject(e)
      }
  });
};

/**
 * @desc 把js的方法暴露给native调用
 * @param {string} method - 暴露给native方法名
 * @param {function} callback - 暴露给native的callback。
 */
const register = (method, callback = noop) => {
    console.log('register', method)

    if(!window.bridge){
        if(registerTryTimes > TRY_TIMES){
            return callback && callback();
        }
        registerTryTimes++;
        console.log('register_tryTimes: ' + registerTryTimes);
        registerTimeout = setTimeout(()=>{
            register(method, callback)
        }, 1000);
    } else {
        registerTryTimes = 0;

        window.bridge.registerHandler(method, function(res){
            console.log('register_res: ' + JSON.stringify(res))
            callback && callback(res);
        });
    }

    /*
    if(!!!phoneUtil.isInIOS()){
        if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.registerHandler(method, function(res){
                console.log('register_res: ' + JSON.stringify(res))
                callback && callback(res);
            });
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                console.log('register_WebViewJavascriptBridgeReady', method)
                window.WebViewJavascriptBridge.registerHandler(method, function(res){
                    console.log('register_WebViewJavascriptBridgeReady_res: ' + JSON.stringify(res))
                    callback && callback(res);
                });
            }, false);
        }
    } else {
        setupWebViewJavascriptBridge(bridge => bridge.registerHandler(method, callback));
    }
    */
};

const callbackUUID = () => {
  const s4 = () => (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
  return `callback$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}$${s4()}`;
};

export default {
  invoke,
  register,
  callbackUUID
};
