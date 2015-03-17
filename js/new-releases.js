(function() {
  'use strict';

  var myApp = angular.module('newReleases', ['spotifyAuthorization']);

  myApp.controller('NewReleasesController', ['$scope', '$location', '$http', 'getToken', function($scope, $location, $http, getToken) {
    var self = this;

    $scope.$on('$routeUpdate', function() {
      var offset = $location.search().offset;

      if (offset && (offset < 0 || !parseInt(offset))) {
        offset = 0;
        $location.search('offset', null);
      }
      else {
        self.authorize();
      }
    });

    self.authorize = function() {
      clearMessages();
      self.waitingForAuth = true;

      getToken().then(
        // success
        loadNewReleases,

        // error
        showError
      );
    }

    function loadNewReleases(authData) {
      clearMessages();
      $('*').css('cursor', 'wait');

      $http.get('https://api.spotify.com/v1/browse/new-releases', {
        params: {
          offset: $location.search().offset
        },
        headers: {
          Authorization: authData.type + ' ' + authData.token
        }})
        .success(function(data) {
          // todo remove console.log
          console.log(data);
          self.albums = data.albums;
          $('body').animate({scrollTop: 0}, 400);
          $('*').css('cursor', '');
    });
    }

    function showError(error) {
      delete self.albums;
      clearMessages();
      if (error === 'popup blocked') self.popupError = true;
      else
      if (error === 'cancelled') self.authError = true;
    }

    function clearMessages() {
      self.waitingForAuth = false;
      self.authError = false;
      self.popupError = false;
    }

    /**
     * Automatically ask for authorization when template is loaded
     */
    self.authorize();
  }]);
})();
