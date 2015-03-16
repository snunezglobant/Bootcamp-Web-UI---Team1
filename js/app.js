var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/settings', {
      controller: 'SettingsController',
      controllerAs: 'settingsCtrl',
      templateUrl: 'templates/settings.html'
    })
    .when('/search/:searchvalue', {
      controller: 'searchController',  
      controllerAs: 'searchController',    
      templateUrl: 'templates/searchresults.html'
    })
    .when('/searchartist/:id', {
      controller: 'artistController',  
      controllerAs: 'artistController',    
      templateUrl: 'templates/artistresults.html'
    })
    .when('/searchartistalbums/:id', {
      controller: 'artistalbumsController',  
      controllerAs: 'artistalbumsController',    
      templateUrl: 'templates/artistalbumsresults.html'
    })
    .when('/searchrelatedartist/:artistid', {
      controller: 'artistRelatedController',  
      controllerAs: 'artistRelatedController',    
      templateUrl: 'templates/artistRelatedResults.html'
    })
    .when('/searchalbum/:albumid', {
      controller: 'albumController',  
      controllerAs: 'albumController',    
      templateUrl: 'templates/albumResults.html'
    })
    .when('/searchalbumtracks/:albumid', {
      controller: 'albumTracksController',  
      controllerAs: 'albumTracksController',    
      templateUrl: 'templates/albumTracksResults.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

myApp.controller('TopbarController', ['$location', function($location){
  this.settings = function() {
    $location.path('/settings');
  }    
   this.search = function() {
    $location.path('/search/' + $('.search-input').val());
  }
}]);

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


myApp.controller('searchController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/search', {
            params: {
                q: $routeParams.searchvalue,
                type: "album,artist"
            }
        }).success(function(data) {
            console.log(data);          
            $scope.searchs = data;                                   
        });    
}]);
myApp.controller('artistController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/artists/'+$routeParams.id).success(function(data){
            console.log(data);
            $scope.searchs = data;  
            });                                
           
}]);
myApp.controller('artistalbumsController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/artists/'+$routeParams.id+'/albums').success(function(data){
            console.log(data);
            $scope.searchs = data;              
            });                                
           
}]);

myApp.controller('artistRelatedController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/artists/'+$routeParams.artistid+'/related-artists').success(function(data){
            console.log(data);
            $scope.searchs = data;              
            });                                
           
}]);

myApp.controller('albumController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/albums/'+$routeParams.albumid).success(function(data){
            console.log(data);
            $scope.searchs = data;              
            });                                
           
}]);

myApp.controller('albumTracksController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
       $http.get('https://api.spotify.com/v1/albums/'+$routeParams.albumid+'/tracks').success(function(data){
            console.log(data);
            $scope.searchs = data;              
            });   

           
}]);

myApp.filter('millSecondsToTimeString', function() {
  return function(millseconds) {
    var minutes = Math.floor((millseconds / 1000)/60);
    var seconds = Math.round((millseconds - minutes*1000*60)/1000);
    var timeString = '';
    if(minutes >= 0) timeString += minutes + ":";
    if(seconds >= 0) timeString += seconds + "  minutes";
    return timeString;
}
});