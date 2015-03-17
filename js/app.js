(function() {
  'use strict';

  var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'newReleases']);
  var validPreviousRoute;

  myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainViewController',
        controllerAs: 'mainViewCtrl',

        /**
         * The user can choose what to show on the main page, and the appropriate template
         * will be included using ng-include.
         * An alternative would've been to redirect the main route ('/') to the corresponding
         * route displaying the chosen template, using routeProvider's templateUrl.
         * The drawback of the second approach is that the user would be bookmarking, saving
         * or sharing the route associated with the app's settings, instead of the main route.
         * If the user changed the settings afterwards, that change wouldn't be reflected in
         * the bookmark or link they saved.
         */
        template: '<div ng-include="mainViewCtrl.templateUrl"></div>',
        reloadOnSearch: false
      })
      .when('/settings', {
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl',
        templateUrl: 'templates/settings.html'
      })
      .when('/search/:searchvalue', {
        controller: 'SearchController',
        controllerAs: 'searchCtrl',
        templateUrl: 'templates/searchresults.html'
      })
      .when('/searchartist/:id', {
        controller: 'ArtistController',
        controllerAs: 'artistCtrl',
        templateUrl: 'templates/artistresults.html'
      })
      .when('/searchartistalbums/:id', {
        controller: 'ArtistAlbumsController',
        controllerAs: 'artistAlbumsCtrl',
        templateUrl: 'templates/artistalbumsresults.html'
      })
      .when('/searchrelatedartist/:artistid', {
        controller: 'ArtistRelatedController',
        controllerAs: 'artistRelatedCtrl',
        templateUrl: 'templates/artistRelatedResults.html'
      })
      .when('/searchalbum/:albumid', {
        controller: 'AlbumController',
        controllerAs: 'albumCtrl',
        templateUrl: 'templates/albumResults.html'
      })
      .when('/searchalbumtracks/:albumid', {
        controller: 'AlbumTracksController',
        controllerAs: 'albumTracksCtrl',
        templateUrl: 'templates/albumTracksResults.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

  myApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
      if (current) {
        validPreviousRoute = true;
      }
    });
  }]);

  myApp.controller('TopbarController', ['$location', function($location) {
    this.settings = function() {
      $location.url('/settings');
    }

    this.search = function() {
      $location.url('/search/' + $('.search-input').val());
    }
  }]);

  myApp.controller('SettingsController', [function() {
    this.setTheme = function(name) {
      $('#css-theme').attr('href', 'css/' + name + '.css');
      localStorage.setItem('css-theme', name);
    };

    this.showReleases = JSON.parse(localStorage.getItem('show-releases'));

    this.setShowReleases = function() {
      localStorage.setItem('show-releases', this.showReleases);
    };

    this.showSearchbox = JSON.parse(localStorage.getItem('show-searchbox'));

    this.setShowSearchbox = function() {
      localStorage.setItem('show-searchbox', this.showSearchbox);
    }
  }]);

  myApp.controller('MainViewController', [function() {
    if (JSON.parse(localStorage.getItem('show-releases'))) {
      this.templateUrl = 'templates/new-releases.html';
    }
    else {
      if (JSON.parse(localStorage.getItem('show-searchbox'))) {
        this.templateUrl = 'templates/searchbox.html';
      }
      else {
        this.templateUrl = null;
      }
    }
  }]);

  myApp.controller('SearchController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/search', {
      params: {
        q: $routeParams.searchvalue,
        type: 'album,artist'
      }})
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('ArtistController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/artists/' + $routeParams.id)
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('ArtistAlbumsController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/artists/' + $routeParams.id + '/albums')
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('ArtistRelatedController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/artists/' + $routeParams.artistid + '/related-artists')
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('AlbumController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/albums/' + $routeParams.albumid)
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('AlbumTracksController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/albums/' + $routeParams.albumid + '/tracks')
      .success(function(data) {
        self.search = data;
      });
  }]);

  /**
   * {{ duration_ms | date:"m:ss 'minutes'"}} breaks for durations greater than 60 minutes
   */
  myApp.filter('millSecondsToTimeString', function() {
    return function(millseconds) {
      var minutes = Math.floor((millseconds / 1000) / 60);
      var seconds = Math.round((millseconds - minutes * 1000 * 60) / 1000);
      var timeString = '';
      if(minutes >= 0) timeString += minutes + ':';
      if(seconds >= 0) timeString += seconds + '  minutes';
      return timeString;
  }
  });

  myApp.directive('goBack', [function() {
    return {
      restrict: 'A',
      template: '<span class="icon-arrow-back"></span>Back',
      link: function($scope, element, attributes, controller) {
        if (validPreviousRoute) {
          element.addClass('back-button background-color-primary-0-hover transparent border-color-primary-0');
          element.bind('click', function() {
            history.back();
          });
        }
        else {
          //element.prop('disabled', true);
          element.hide();
        }
      }
    };
  }]);

  myApp.directive('navButtons', ['$location', '$route', '$routeParams', function($location, $route, $routeParams) {
    return {
      scope: {
        type: '@',
        model: '='
      },
      controller: function($scope, $element, $attrs, $transclude) {
        $scope.previousPage = function() {
          var newOffset = parseInt(Math.max($scope.model.offset - $scope.model.limit, 0));
          $location.search('offset', newOffset);
        }

        $scope.nextPage = function() {
          var newOffset = parseInt($scope.model.offset + $scope.model.limit);
          $location.search('offset', newOffset);
        }
      },
      restrict: 'A',
      templateUrl: 'templates/nav-buttons.html',
    };
  }]);
})();
