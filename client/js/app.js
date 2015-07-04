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


app.controller('AppCtrl', ['$firebaseObject', '$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}]);

app.controller('ConfirmCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams) {
  $scope.uuid = $routeParams.uuid;
}]);

app.controller('LandingCtrl', ['$firebaseObject', '$scope', function($firebaseObject, $scope){
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);

  $scope.go = function (path) {
    $location.path(path);
  };
}]);

app.controller('NeededCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
  $scope.map = {};

  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);

  $scope.disasters.$loaded(function() {
    $scope.map = { center: $scope.disasters[$scope.uuid].latlong, zoom: 12 };
    console.log($scope.map);
  });
}]);


app.controller('RequestCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
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

app.controller('RequireCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
}]);

