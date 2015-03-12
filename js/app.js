//hola

var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('searchController', ['$scope', '$http', function($scope, $http) {
    $scope.searchsArray = [{
        name: 'artist'
    }, {
        name: 'album'
    }];
    $scope.searchItem = '';
    $scope.submit = (function() {
        varArtist = $('.search-input').val();
        $http.get('https://api.spotify.com/v1/search', {
            params: {
                q: varArtist,
                type: $scope.searchItem.name
            }
        }).success(function(data) {
            $scope.searchs = data;
        });
    })
}])



