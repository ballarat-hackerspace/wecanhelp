var app = angular.module('WeCanHelpApp', ['ngMaterial', 'ngRoute'])

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
      .otherwise({redirectTo: '/'});
}]);

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}]);

app.controller('MainCtrl', ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.params = $routeParams;
}]);

app.controller('SideNavCtrl', function($scope, $mdDialog) {
  $scope.disasters = [
    { id: 'bf001', name: 'Dereel', type: 'bushfire', active: true },
    { id: 'eq001', name: 'Wellington', type: 'earthquake', active: false }
  ];
});
