import Vue from 'vue'

var websock;
function initWebSocket(id){
        //ws地址
        var wsUrl = process.env.WS_API;
        const wsuri = 'ws://'+wsUrl+'/socketServer/'+id;
        websock = new WebSocket(wsuri);
       	websock.onopen = function () {
          console.log('WebSocket连接成功');
        };
        websock.onerror = function(){
          console.log('WebSocket连接发生错误');
        };
        websock.onclose = function(){
          console.log('WebSocket连接关闭');
        };
       Vue.prototype.websock = websock;
}

export{
	initWebSocket
}
