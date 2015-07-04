var app = angular.module('WeCanHelpApp', ['firebase', 'ngMaterial', 'ngRoute', 'ngAnimate', 'uiGmapgoogle-maps'])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'landing.html',
          controller: 'LandingCtrl',
          controllerAs: 'landing'
        })
        .when('/needed/:uuid', {
          templateUrl: 'needed.html',
          controller: 'NeededCtrl',
          controllerAs: 'needed'
        })
        .when('/register', {
          templateUrl: 'register.html',
          controller: 'RegisterCtrl',
          controllerAs: 'register'
        })
        .when('/request/:uuid', {
          templateUrl: 'request.html',
          controller: 'RequestCtrl',
          controllerAs: 'request'
        })
        .when('/confirm/:uuid', {
          templateUrl: 'confirm.html',
          controller: 'ConfirmCtrl',
          controllerAs: 'confirm'
        })
        .when('/require/:uuid', {
          templateUrl: 'require.html',
          controller: 'RequireCtrl',
          controllerAs: 'require'
        })
        .when('/thanks/:reason', {
          templateUrl: 'thanks.html',
          controller: 'ThanksCtrl',
          controllerAs: 'thanks'
        })
        .otherwise({redirectTo: '/'});
    }])
  .config(function(uiGmapGoogleMapApiProvider) {
    console.log("loading maps");
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAPRDqAY5tLbmOGPZeULMzPX4H0HW6Q5wE',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  });


app.controller('AppCtrl', ['$firebaseObject', '$scope', '$mdSidenav', function($firebaseObject, $scope, $mdSidenav){
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}]);

app.controller('ConfirmCtrl', ['$scope', function($scope){
}]);

app.controller('LandingCtrl', ['$scope', '$location', function($scope, $location){
  $scope.go = function (path) {
    $location.path(path);
  };
}]);

app.controller('NeededCtrl', ['$scope', function($scope){
  $scope.map = { center: { latitude: -37.816215, longitude: 143.755160 }, zoom: 12 };
}]);

app.controller('RequestCtrl', ['$scope', function($scope){
  $scope.data = {
    title: "Dereel Bushfires",
    description: "We are looking for volunteers who can provide or assist with the following resources:",
    resources: [
      {
        name: "Blankets",
        description: "Non-flammable, non-syntetic."
      },
      {
        name: "Food",
        description: "Fresh fruit and tinned cans."
      },
      {
        name: "Labour",
        description: "Clean up of debris."
      }
    ]
  };
}]);

app.controller('RequireCtrl', ['$scope', function($scope){
  $scope.map = { center: { latitude: -37.816215, longitude: 143.755160 }, zoom: 12 };
}]);

