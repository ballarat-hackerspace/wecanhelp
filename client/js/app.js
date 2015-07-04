var app = angular.module('WeCanHelpApp', ['ngMaterial']);

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.disasters = [
    { name: 'Bushfire cleanup', type: 'bushfire', where: "Dereel, Victoria, Australia", details: "Volunteers needed", active: true },
    { name: 'Earthquake relief', where: 'Wellington, New Zealand', type: 'earthquake', active: false, details: "Register for updates" }
  ];

}]);
