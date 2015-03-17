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
  }])

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
