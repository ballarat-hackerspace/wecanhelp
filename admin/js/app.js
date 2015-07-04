var app = angular.module('WeCanHelpApp', ['ngMaterial', 'ngRoute', 'uiGmapgoogle-maps'])

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

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
  $scope.map = { center: { latitude: -37.816215, longitude: 143.755160 }, zoom: 12 };
}]);

app.controller('MainCtrl', ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.params = $routeParams;
}]);

app.controller('SideNavCtrl', function($scope) {
  $scope.disasters = [
    { id: 'bf001', name: 'Dereel', type: 'bushfire', active: true },
    { id: 'eq001', name: 'Wellington', type: 'earthquake', active: false }
  ];
});

app.controller('RegisterCtrl', function($scope) {
  $scope.disaster = {'items':[{}]};
  $scope.push = function () {
    $scope.disaster.items.push({
      required: "",
      details: ""
    });
  };
  $scope.pop = function () {
    $scope.disaster.items.pop();
  };
});