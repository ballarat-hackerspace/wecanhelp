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
        .when('/thanks/:uuid/:reason', {
          templateUrl: 'thanks.html',
          controller: 'ThanksCtrl',
          controllerAs: 'thanks'
        })
        .otherwise({redirectTo: '/'});
    }])
  .config(function(uiGmapGoogleMapApiProvider) {
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

app.controller('ConfirmCtrl', ['$firebaseObject', '$location', '$scope', '$routeParams', function($firebaseObject, $location, $scope, $routeParams) {
  $scope.uuid = $routeParams.uuid;
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $scope.uuid);
  $scope.disaster = $firebaseObject(ref);

  $scope.go = function (path) {
    $location.path(path);
  };

  $scope.disaster.$watch(function() {
    if ('volunteers' in $scope.disaster) {
      var message = '';
      var responseStatus = 0;
      angular.forEach($scope.disaster.volunteers, function(v,k) {
        if ('responseStatus' in v) {
          responseStatus = v.responseStatus;
          message = v.message;
        }
      });

      if (responseStatus == 1) {
        $scope.go('/require/'+$scope.uuid);
      }
      else if (responseStatus == 2) {
        $scope.go('/thanks/'+$scope.uuid+'/assistance');
      }
      else if (responseStatus == 3) {
        $scope.go('/thanks/'+$scope.uuid+'/assistance');
      }
    }
  });
}]);

app.controller('LandingCtrl', ['$firebaseObject', '$location', '$scope', function($firebaseObject, $location, $scope){
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);

  $scope.go = function (path) {
    $location.path(path);
  };
}]);

app.controller('NeededCtrl', ['$firebaseObject', '$location', '$scope', '$routeParams', function($firebaseObject, $location, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
  $scope.map = {};

  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
  $scope.disasters = $firebaseObject(ref);

  $scope.disasters.$loaded(function() {
    $scope.map = { center: $scope.disasters[$scope.uuid].latlong, zoom: 12 };
    $scope.required = $scope.disasters[$scope.uuid].hasOwnProperty('resources');
  });

  $scope.go = function(path) {
    $location.path(path);
  };
}]);

app.controller('RequestCtrl', ['$firebaseObject', '$location', '$scope', '$routeParams', '$mdDialog', function($firebaseObject, $location, $scope, $routeParams, $mdDialog) {
  $scope.uuid = $routeParams.uuid;

  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $scope.uuid);
  $scope.disaster = $firebaseObject(ref);
  $scope.selected = {};

  $scope.canConfirm = function() {
     var keys = Object.keys($scope.selected).filter(function(key) {
       return $scope.selected[key];
     });

     return keys.length > 0;
  }

  $scope.go = function (path) {
    console.log(path);
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
      $scope.go('/thanks/'+uuid+'/unable');
    });
  };

  $scope.showConfirm = function(ev) {
    var confirm = $mdDialog
      .show({
        controller: 'RequestDetailsCtrl',
        templateUrl: 'request-details-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      })
      .then(function(data) {
        ref.child('volunteers').push(data);
        $scope.go('/confirm/'+$scope.uuid);
      });
  };

  $scope.showDetail = function(e, details) {
    console.log(details);
  }
}]);

app.controller('RequestDetailsCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
  $scope.data = {
    name: "",
    phone: "",
  };

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function() {
    $mdDialog.hide($scope.data);
  };

  $scope.canAnswer = function() {
    return $scope.data.name.length > 0 && $scope.data.phone.length > 0;
  };
}]);


app.controller('RequireCtrl', ['$firebaseObject', '$location', '$scope', '$routeParams', function($firebaseObject, $location, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;

  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $scope.uuid);
  $scope.disaster = $firebaseObject(ref);

  $scope.go = function (path) {
    $location.path(path);
  };

  $scope.disaster.$watch(function() {
    if ('volunteers' in $scope.disaster) {
      var message = '';
      var responseStatus = 0;
      angular.forEach($scope.disaster.volunteers, function(v,k) {
        if ('responseStatus' in v) {
          responseStatus = v.responseStatus;
          message = v.message;
        }
      });

      if (responseStatus == 3) {
        $scope.go('/thanks/'+$scope.uuid+'/assistance');
      }
    }
  });
}]);

app.controller('ThanksCtrl', ['$firebaseObject', '$scope', '$routeParams', function($firebaseObject, $scope, $routeParams){
  $scope.uuid = $routeParams.uuid;
  $scope.reason = $routeParams.reason;
  var ref = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $scope.uuid);
  $scope.disaster = $firebaseObject(ref);
}]);
