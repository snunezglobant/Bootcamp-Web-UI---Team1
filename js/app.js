//hola

var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('searchController', ['$scope', '$http', function($scope, $http) {
    $scope.submit = (function() {
        varArtistOrAlbum = $('.search-input').val();
        $http.get('https://api.spotify.com/v1/search', {
            params: {
                q: varArtistOrAlbum,
                type: "album,artist"
            }
        }).success(function(data) {
            $scope.searchs = data;
            $scope.viewEnable=true;
        });
    })
}])



