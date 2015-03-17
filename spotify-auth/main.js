var authData = {};
var params;
var paramAttr;
var paramValue;

if (location.hash) {
  params = location.hash.substr(1).split('&');

  for (var i = 0; i < params.length; i++) {
    paramAttr = params[i].split('=')[0];
    paramValue = params[i].split('=')[1];

    authData[paramAttr] = paramValue;
  }
  authData['expiration_timestamp'] = parseInt(Date.now() + (authData['expires_in'] * 1000));
}

localStorage.setItem('spotify-auth', JSON.stringify(authData));
