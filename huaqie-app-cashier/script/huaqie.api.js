var URL = 'https://g2.huaqie.com/cloud/'
var huaqie = {
	get: function(cmd, params, resolve, reject) {
		if(store.get('app'))
			params.appId = store.get('app').appId
		params.sessionId = store.get('sessionId')
		$.get(URL+cmd, params, function(ret) {
			if(ret.code){
				api.toast({
					msg: ret.message
				})
				if(typeof(reject) == 'function')
					reject()
				return
			}
			if(typeof(resolve) == 'function')
            	resolve(ret)
        })
	},
	post: function(cmd, params, resolve, reject) {
		if(store.get('app'))
			params.appId = store.get('app').appId
		params.sessionId = store.get('sessionId')
		$.post(URL+cmd, params, function(ret) {
			if(ret.code){
				api.toast({
					msg: ret.message
				})
				if(typeof(reject) == 'function')
					reject()
				return
			}
			if(typeof(resolve) == 'function')
            	resolve(ret)
        })
	}
}
