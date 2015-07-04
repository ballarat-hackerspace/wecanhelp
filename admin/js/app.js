var app = angular.module('WeCanHelpApp', ['firebase', 'ngMaterial', 'ngRoute', 'uiGmapgoogle-maps'])

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/disaster', {
        templateUrl: 'register.html',
        controller: 'MainCtrl'
      })
      .when('/disaster/:disasterId', {
        templateUrl: 'disaster.html',
        controller: 'MainCtrl',
        controllerAs: 'disaster'
      })
      .otherwise({ templateUrl: 'map.html'});
}]);

app.config(function(uiGmapGoogleMapApiProvider) {
  console.log("loading maps");
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAPRDqAY5tLbmOGPZeULMzPX4H0HW6Q5wE',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  })
});

app.controller('AppCtrl', ['$firebaseObject', '$scope', '$mdSidenav', function($firebaseObject, $scope, $mdSidenav){
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  $scope.disasters = $firebaseObject(ref);
  $scope.map = { center: { latitude: -37.816215, longitude: 143.755160 }, zoom: 12 };
}]);

app.controller('MainCtrl', ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.params = $routeParams;
}]);

app.controller('RegisterCtrl', function($scope) {
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.reset = function() {
    $scope.disaster = {};
    $scope.disasterItems = [{}];
  };
  $scope.push = function () {
    $scope.disasterItems.push({
      required: "",
      details: ""
    });
  };
  $scope.pop = function () {
    $scope.disasterItems.pop();
  };
  $scope.save = function() {
    var newDisasterRef = ref.push($scope.disaster);
    angular.forEach($scope.disasterItems, function(value) {
      delete value['$$hashKey'];
      newDisasterRef.child('resources').push(value);
    });
  };
  $scope.reset();
});