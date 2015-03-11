var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider){
  $routeProvider
  .when("/", {
    controller: "controllerHome",
    templateUrl: "index.html"
  })
  .otherwise({
    redirectTo: "/"
  });;
});


app.controller("controllerHome" ,function ($scope, $http) {
 $("#searchbutton").click(function(){
  var1=$(".search-input").val();
  $http.get("https://api.spotify.com/v1/search?q="+ var1+"&type=album").success(function(data)
    {$scope.albums=data;
      console.log(data);});
});
});

