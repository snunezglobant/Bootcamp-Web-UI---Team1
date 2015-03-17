(function() {
  'use strict';

  var authApiEndPoint = 'https://accounts.spotify.com/authorize';
  var clientId = '571a9e3919224543aaf987881b4262c8';
  var redirectUri = 'http://localhost:8080/spotify-auth';

  var spotifyApp = angular.module('spotifyAuthorization', []);

  spotifyApp.factory('getToken', ['$q', function($q){
    function requestAuth() {
      var deferred = $q.defer();
      var authWindow = window.open(
          authApiEndPoint +
          '?client_id=' + clientId +
          '&response_type=token' +
          '&redirect_uri=' + redirectUri,
        '_blank',
        'toolbar=yes, scrollbars=yes, resizable=yes, ' +
        'top=' + parseInt((screen.height / 2) - 225) + ', ' +
        'left=' + parseInt((screen.width / 2) - 200) + ', ' +
        'width=400, height=450');
      var intervalId;

      if (authWindow) {
        intervalId = setInterval(function waitForToken() {
          var authData = localStorage.getItem('spotify-auth');

          if (authData || authWindow.closed) {
            clearInterval(intervalId);
            if (authData === '{}' || authWindow.closed) {
              localStorage.removeItem('spotify-auth');
              deferred.reject('cancelled');
            }
            else {
              deferred.resolve();
            }

            authWindow.close();
          }
        }, 1000);
      }
      else {
        // if the browser blocked the popup, inform the user and reject the promise
        deferred.reject('popup blocked');
      }

      return deferred.promise;
    }

    function getToken() {
      var deferred = $q.defer();
      var authData = JSON.parse(localStorage.getItem('spotify-auth'));

      if (authData && authData['expiration_timestamp'] > Date.now()) {
        deferred.resolve({
          token: authData['access_token'],
          type: authData['token_type']
        });
      }
      else {
        localStorage.removeItem('spotify-auth');
        requestAuth().then(
          // success
          function() {
            authData = JSON.parse(localStorage.getItem('spotify-auth'));
            deferred.resolve({
              token: authData['access_token'],
              type: authData['token_type']
            });
          },
          // error
          function(error) {
            deferred.reject(error);
          }
        );
      }

      return deferred.promise;
    }

    return getToken;
  }]);
})();
