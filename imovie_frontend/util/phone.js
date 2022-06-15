export default {
    isInIOS: function () {
        let type = false;
        if (typeof window !== "undefined") {
            if (this.isInApp()) {
                type = !!navigator.userAgent.match(/iphone|ipad|ipod/i)
            }
        }
        return type;
    },
    isIphoneX: function(){
        let type = false;
        if(typeof window !== "undefined"){
            const app = this.isInApp();
            if(app) {
                type = /isiphonex/.test(navigator.userAgent.toLowerCase())
            }
            if(app && !type){
                const clientHeight = document.documentElement.clientHeight || window.pageYOffset || document.body.clientHeight;
                if(clientHeight > 800 && clientHeight < 1000){
                    type = true;
                }
            }
        }
        return type;
    },
    isInApp: function() {
        return !!navigator.userAgent.match(new RegExp(ProjectConfig.vendor, 'i'));
    },
    isInWechat: function() {
        return !!navigator.userAgent.match(/micromessenger/i);
    }
}