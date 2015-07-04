var app = angular.module('WeCanHelpApp', ['ngMaterial', 'ngRoute'])

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'register.html',
        controller: 'MainCtrl'
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
    this.$routeParams = $routeParams;
}]);

app.controller('SideNavCtrl', function($scope, $mdDialog) {
  $scope.disasters = [
    { name: 'Dereel', type: 'bushfire', active: true },
    { name: 'Wellington', type: 'earthquake', active: false }
  ];
  $scope.itemClick = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .content('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
});
