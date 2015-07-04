var app = angular.module('WeCanHelpApp', ['ngMaterial', 'ngRoute', 'ngAnimate'])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/register', {
          templateUrl: 'register.html',
          controller: 'RegisterCtrl',
          controllerAs: 'register'
        })
      .when('/thanks/:reason', {
        templateUrl: 'thanks.html',
        controller: 'ThanksCtrl',
        controllerAs: 'thanks'
      });
    }]);


app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
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

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.disasters = [
    { name: 'Bushfire cleanup', type: 'bushfire', where: "Dereel, Victoria, Australia", details: "Volunteers needed", active: true },
    { name: 'Earthquake relief', where: 'Wellington, New Zealand', type: 'earthquake', active: false, details: "Register for updates" }
  ];
}]);
