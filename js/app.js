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
        templateUrl: 'templates/searchresults.html',
        reloadOnSearch: false
      })
      .when('/searchartist/:id', {
        controller: 'ArtistController',
        controllerAs: 'artistCtrl',
        templateUrl: 'templates/artistresults.html'
      })
      .when('/searchartistalbums/:id', {
        controller: 'ArtistAlbumsController',
        controllerAs: 'artistAlbumsCtrl',
        templateUrl: 'templates/artistalbumsresults.html',
        reloadOnSearch: false
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

  myApp.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(event, next, current) {
      /**
       * Validate route change so that a 'Back' button is displayed.
       * The button serves no purpose if there is no previous page, the previous page is blank, or a different website.
       */
      if (current) {
        validPreviousRoute = true;
      }

      /**
       * If the search box is visible on the main page, it's useless to show it in the topbar
       */
      if ($location.path() === '/' &&
        JSON.parse(localStorage.getItem('show-searchbox')) &&
        !JSON.parse(localStorage.getItem('show-releases'))) {
          $('.topbar .search-form').fadeOut();
      }
      else {
        $('.topbar .search-form').fadeIn();
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

  myApp.controller('SettingsController', ['$scope', function($scope) {
    var self = this;

    this.setTheme = function(name) {
      $('#css-theme').attr('href', 'css/' + name + '.css');
      localStorage.setItem('css-theme', name);
    };

    this.useGlass = JSON.parse(localStorage.getItem('use-glass'));

    this.setUseGlass = function() {
      localStorage.setItem('use-glass', this.useGlass);
      if (this.useGlass) $('.main').addClass('glass');
      else $('.main').removeClass('glass');
    }

    this.showOutline = JSON.parse(localStorage.getItem('text-outline'));

    this.setShowOutline = function() {
      localStorage.setItem('text-outline', this.showOutline);
      if (this.showOutline) $('body').addClass('text-outline');
      else $('body').removeClass('text-outline');
    }

    this.showReleases = JSON.parse(localStorage.getItem('show-releases'));

    this.setShowReleases = function() {
      localStorage.setItem('show-releases', this.showReleases);
    };

    this.showSearchbox = JSON.parse(localStorage.getItem('show-searchbox'));

    this.setShowSearchbox = function() {
      localStorage.setItem('show-searchbox', this.showSearchbox);
    }

    this.clearBackground = function() {
      localStorage.removeItem('background');
      $('.background').css('background-image', '');
      this.backgroundSet = false;
    }

    this.backgroundSet = (localStorage.getItem('background') !== null);

    $('.background').on('background-set', function() {
      self.backgroundSet = (localStorage.getItem('background') !== null);
      $scope.$apply();
    });
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

  myApp.controller('SearchController', ['$scope', '$http','$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    var self = this;

    $scope.$on('$routeUpdate', function() {
      var offset = $location.search().offset;

      if (offset && (offset < 0 || !parseInt(offset))) {
        offset = 0;
        $location.search('offset', null);
      }
      else {
        doSearch();
      }
    });

    function doSearch() {
      $http.get('https://api.spotify.com/v1/search', {
        params: {
          q: $routeParams.searchvalue,
          type: 'album,artist',
          offset: $location.search().offset
        }})
        .success(function(data) {
          self.search = data;
        });
    }

    doSearch();
  }]);

  myApp.controller('ArtistController', ['$http','$routeParams', function($http, $routeParams) {
    var self = this;

    $http.get('https://api.spotify.com/v1/artists/' + $routeParams.id)
      .success(function(data) {
        self.search = data;
      });
  }]);

  myApp.controller('ArtistAlbumsController', ['$scope', '$http','$routeParams', '$location', function($scope, $http, $routeParams, $location) {
    var self = this;

    $scope.$on('$routeUpdate', function() {
      var offset = $location.search().offset;

      if (offset && (offset < 0 || !parseInt(offset))) {
        offset = 0;
        $location.search('offset', null);
      }
      else {
        doSearch();
      }
    });

    function doSearch() {
      $http.get('https://api.spotify.com/v1/artists/' + $routeParams.id + '/albums', {
        params: {
          offset: $location.search().offset
        }})
        .success(function(data) {
          self.search = data;
        });
    }

    doSearch();
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
        // for looping in the items array,
        // I need this because disc_number is an attribute and can't loop around it
        self.discNumber = [];
        for (var i = 0; i < self.search.items[self.search.items.length - 1].disc_number; i++){
          self.discNumber[i] = i + 1;
        }
      });
  }]);

  myApp.controller('MainSearchboxController', ['$location', function($location) {
    this.search = function() {
      $location.url('/search/' + $('.mainpage .search-input').val());
    }

    // focus the search input automatically when the template is loaded
    $('.mainpage .search-input').focus();
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
      if(seconds >= 0 && seconds < 10) timeString += '0' + seconds;
      else timestring += seconds;
      return timeString;
  }
  });

  myApp.directive('goBack', [function() {
    return {
      restrict: 'A',
      template: '<span class="icon-arrow-back"></span>Back',
      link: function($scope, element, attributes, controller) {
        if (validPreviousRoute) {
          element.addClass('flat-button back background-color-primary-0 background-color-primary-0-hover transparent2 border-color-primary-0');
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
