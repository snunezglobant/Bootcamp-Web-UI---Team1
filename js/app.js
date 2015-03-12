var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/settings', {
      controller: 'SettingsController',
      controllerAs: 'settingsCtrl',
      templateUrl: 'templates/settings.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

myApp.controller('TopbarController', ['$location', function($location){
  this.settings = function() {
    $location.path('/settings');
  }
}])

myApp.controller('SettingsController', ['$scope', function($scope) {
  this.setTheme = function(name) {
    $('#css-theme').attr('href', 'css/' + name + '.css');
    localStorage.setItem('css-theme', name);
  };
}]);

myApp.directive('goBack', [function(){
  return {
    restrict: 'A',
    link: function($scope, iElm, iAttrs, controller) {
      iElm.bind('click', function() {
        history.back();
      });
    }
  };
}]);

var cssTheme = localStorage.getItem('css-theme');
if (cssTheme)
$('#css-theme').attr('href', 'css/' + cssTheme + '.css');

