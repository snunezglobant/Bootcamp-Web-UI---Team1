var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('controllerHome', ['$scope', '$http', function($scope, $http) {
    $scope.searchsArray = [{
        name: 'artist'
    }, {
        name: 'album'
    }];
    $scope.searchItem = '';
    $scope.submit = (function() {
        var varArtist = $('.search-input').val();
        $http.get('https://api.spotify.com/v1/search', {
            params: {
                q: varArtist,
                type: $scope.searchItem.name
            }
        }).success(function(data) {
            if ($scope.searchItem.name == 'artist') {
                $scope.artists = data.artists.items;


            }
            if ($scope.searchItem.name == 'album') {
                $scope.albums = data.albums.items;


            }
            console.log(data);
        });
    })
}])


