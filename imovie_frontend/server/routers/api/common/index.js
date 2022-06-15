/**
 * Created by chenjiajie on 2020/4/13.
 */
const response = require('../../response');

const redis = require('redis');

//创建redis
const client = redis.createClient(6379,"127.0.0.1");

//链接错误处理
client.on("error",() => {

    console.log("error",error);

})

const redisList = {
      getRedis(risName){
          client.set(risName, 5, function(err, obj) {
              client.incr(risName, function(err,data) {
                  client.get(risName, function(err,data) {
                      console.log(data);         // 6
                  })
              })
          })
      },
}

export default redisList;