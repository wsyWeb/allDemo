export {
    msghub,
    processor,
    xerror,
    errorMsg,
    MQMsg
}

function msghub() {
    this.processor = new processor()
    this.processor.registerMsg('"error', errorMsg)
}

msghub.prototype.processor = null
msghub.prototype.subscriptions = {}
msghub.prototype.ws = null
msghub.prototype.wsURL = ''
msghub.prototype.queryParams = ''
msghub.prototype.debug = false
msghub.prototype.heartbeatHandle = null

// reSubscribe 订阅全部重新注册 
msghub.prototype.reSubscribe = function () {
    //认证完成后需要重新注册消息
    let subscriptions = this.subscriptions
    this.subscriptions = {}
    for(var t in subscriptions) {
        this.subscribe(subscriptions[t].topic,subscriptions[t].handler)
    }
}

msghub.prototype.getSubscribe = function(topic) {
    return this.subscriptions[topic]
}

// connect 连接websocket
msghub.prototype.connect = function(url,queryParams) {
    this.wsURL = url
    this.queryParams = queryParams

    if(typeof(queryParams) !== 'object') {
        queryParams = {}
    }

    let queryString = ''
    for(var t in queryParams) {
        queryString += t + '=' + encodeURIComponent(queryParams[t]) + '&'
        
    }
    
    queryString = queryString.substr(0, queryString.length-1)
    
    if(queryString !== '') {
        url += '?' + queryString
    }

    let that = this;
    this.ws = new WebSocket(url)
    this.ws.onopen = function() {
        if(this.debug) {
            console.log('msghub 连接已打开')
        }
        that.reSubscribe()
    }
    this.ws.onclose = function() {
        if(this.debug) {
            console.log('msghub 连接已断开')
        }
    }
    this.ws.onmessage = function(evt) {
        that.processor.process(evt.data)
    }
}

msghub.prototype.getSubscription = function(topic) {
    return this.subscriptions[topic]
}

// sub 订阅某个topic
msghub.prototype.subscribe = function (topic, handler) {
    if (typeof(this.subscriptions[topic]) != 'undefined') {
        return new xerror(topic+' 订阅已存在，请勿重复订阅')
    }

    this.subscriptions[topic] = new subscription(topic,handler)
    if (this.ws.readyState === 1) {
        this.ws.send('{"SubscriptMsg":{"Topic":"' + topic + '"}}')
    }

    MQMsg.addTopicHandler(topic, handler)

    return null
}

// unsub 取消订阅某个topic
msghub.prototype.unsubscribe = function (topic) {
    this.ws.send('{"UnSubscriptMsg":{"Topic":"' + topic + '"}}')
    delete this.subscriptions[topic]
}

msghub.prototype.startHeartbeat = function() {
    let that = this
    this.heartbeatHandle = setInterval(function(){
        if (that.ws.readyState === 3) {
            that.connect(that.wsURL,that.queryParams)
        } else if (that.ws.readyState === 1) {
            that.ws.send('{"HearbeatMsg":null}')
        }
    },3000)
}

msghub.prototype.close = function() {
    for(var t in this.subscriptions) {
        this.unsubscribe(this.subscriptions[t].topic)
    }
    this.ws.close()
    clearInterval(this.heartbeatHandle)
}

function xerror(msg){
    this.errMsg = msg
}
xerror.prototype.errMsg = ''
xerror.prototype.error = function() {
    return this.errMsg
}

function subscription(topic,handler) {
    this.topic = topic
    this.handler = handler
}
subscription.prototype.topic = ''
subscription.prototype.handler = function(data) {}

function processor() {}

processor.prototype.handlers = {}

processor.prototype.registerMsg = function(msgType,handler) {
    if(typeof(this.handlers[msgType]) === 'undefined') {
        this.handlers[msgType] = handler
    } else {
        console.warn('msg handler type "' + msgType + '" already registerd')
    }
}

processor.prototype.process = function(data) {
    let m = JSON.parse(data)
    let handler = this.handlers[m.type]
    handler.handler(m)
}

let errorMsg = {
    handler: function(data) {
        console.log(data)
    }
}

let MQMsg = {
    handler(jdata) {
        let h = this.topicHandler[jdata.topic]
        if(typeof(h) !== 'undefined' && typeof(h) === 'function') {
            h(jdata)
        }
    },
    addTopicHandler(topic, handler) {
        this.topicHandler[topic] = handler
        this.topicHandler["aa"] = 2
    },
    topicHandler: {}
}