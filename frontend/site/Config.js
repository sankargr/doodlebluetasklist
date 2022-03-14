
var baseUrl = "http://localhost:3000";

var isLogin = false;
var loginType = '';
var loginName =''


const getTemplate = function(tpl) {
  return new Promise((resolve, reject) => {
    fetch("tpl/" + tpl + "?_=" + new Date().getTime(), {method: "GET"})
      .then(resp => resp.text())
      .then(tmpl => resolve(tmpl))
      .catch(err => {
        console.log(err);
        resolve("<div>An error occured</div>");
      });
  });
};


const titleCase = function(str) {
	var sentence = str.toLowerCase().split(" ");
	for(var i = 0; i< sentence.length; i++) {
		sentence[i] = sentence[i].charAt(0).toUpperCase() + sentence[i].slice(1);
	}
	return sentence.join(" ");
};

const loadFromServer = function (targetUrl, callback, type, params, hideLoading) {
	// buildUrl
	let buildUrl = function(targetUrl) {
		return baseUrl + targetUrl ;		
	}
	targetUrl = buildUrl(targetUrl)
	$.ajax({
		method: type ? type : "POST",
		data: params,
		headers: {
			"Authkey": getToken(),
			"access-token": getToken(),
			'Access-Control-Allow-Origin': '*'
		},
		url: (targetUrl),
		success: function (respose) {
			console.log('success')
			console.log(respose)
			if (callback) callback(respose);
		},
		complete: function (data) {
			console.log('complate')
			console.log(data)
			if(data.status != 200)
			{
				if(data.status == 400)
				{
					if (callback) callback(data);
				}
				
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			console.log(errorThrown);
			
		},
		
	});
	
	
};

const setToken = function(token) {
	if(window.localStorage) {
		return window.localStorage.setItem("token", token);
	}
	return null;
}
const getToken = function() {
	if(window.localStorage) {
		return window.localStorage.getItem("token");
	}
	return null;
}

const setForgotToken = function(token) {
	if(window.localStorage) {
		return window.localStorage.setItem("forgot_token", token);
	}
	return null;
}
const getForgotToken = function() {
	if(window.localStorage) {
		return window.localStorage.getItem("forgot_token");
	}
	return null;
}

const setUser = function(token) {
	if(window.localStorage) {
		return window.localStorage.setItem("authorized_user", token);
	}
	return null;
}
const getUser = function() {
	if(window.localStorage) {
		return window.localStorage.getItem("authorized_user");
	}
	return null;
}

const setSignInUser = function(token) {
	if(window.localStorage) {
		return window.localStorage.setItem("signin_user", token);
	}
	return null;
}
const getSignInUser = function() {
	if(window.localStorage) {
		return window.localStorage.getItem("signin_user");
	}
	return null;
}

const setItem = function(key, keyValue) {
	if(window.sessionStorage) {
		return window.sessionStorage.setItem(key, keyValue);
	}
	return null;
}
const getItem = function(key) {
	if(window.sessionStorage) {
		return window.sessionStorage.getItem(key);
	}
	return null;
}
const removeItem = function(key) {
	if(window.sessionStorage) {
		return window.sessionStorage.removeItem(key);
	}
	return null;
}

const saveLocalItem = function(key, keyValue) {
	if(window.localStorage) {
		return window.localStorage.setItem(key, keyValue);
	}
	return null;
}
const getLocalItem = function(key) {
	if(window.localStorage) {
		return window.localStorage.getItem(key);
	}
	return null;
}
const removeLocalItem = function(key) {
	if(window.localStorage) {
		return window.localStorage.removeItem(key);
	}
	return null;
}

const isMobileView = function() {
	var x = window.matchMedia("(min-device-width: 320px)");
	var y = window.matchMedia("(max-device-width: 1024px)");
	return x.matches && y.matches;	
}
