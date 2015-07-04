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

app.controller('LandingCtrl', ['$firebaseObject', '$location', '$scope', function($firebaseObject, $location, $scope){
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
    $scope.required = $scope.disasters[$scope.uuid].hasOwnProperty('resources');
  });
}]);


app.controller('RequestCtrl', ['$firebaseObject', '$location', '$scope', '$routeParams', '$mdDialog', function($firebaseObject, $location, $scope, $routeParams, $mdDialog) {
  $scope.uuid = $routeParams.uuid;

  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);
  $scope.disaster = {};
  $scope.selected = {};

  $scope.disasters.$loaded(function() {
    $scope.disaster = $scope.disasters[$scope.uuid];
  });

  $scope.canConfirm = function() {
     var keys = Object.keys($scope.selected).filter(function(key) {
       return $scope.selected[key];
     });

     return keys.length > 0;
  }

  $scope.go = function (path) {
    $location.path(path);
  };

  $scope.showCancel = function(ev) {
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title('Please confirm ...')
      .content('Are you sure you can\'t provide any assistance.')
      .ariaLabel('Sorry')
      .ok('Yes, I can!')
      .cancel('Sorry, I can\'t')
      .targetEvent(ev);

    $mdDialog.show(confirm).then(function() {
      $scope.go('/thanks/woot');
    });
  };
  $scope.showConfirm = function(ev) {
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title('Please confirm ...')
      .content('Are you sure you can provide the selected resources.')
      .ariaLabel('Confirm')
      .ok('Yes, I can!')
      .cancel('Sorry, I can\'t')
      .targetEvent(ev);

    $mdDialog.show(confirm).then(function() {
      $scope.go('/confirm/'+$scope.uuid);
    });
  };
}]);

app.controller('RequireCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
}]);

app.controller('ThanksCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
}]);
