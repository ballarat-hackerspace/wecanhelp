var app = angular.module('WeCanHelpApp', ['firebase', 'ngMaterial', 'ngRoute', 'uiGmapgoogle-maps'])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/disaster', {
            templateUrl: 'register.html',
            controller: 'MainCtrl'
        })
        .when('/disaster/:disasterId', {
            templateUrl: 'disaster.html',
            controller: 'DisasterCtrl',
            controllerAs: 'main'
        })
        .otherwise({templateUrl: 'map.html'});
}]);

app.config(function (uiGmapGoogleMapApiProvider) {
    console.log("loading maps");
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAPRDqAY5tLbmOGPZeULMzPX4H0HW6Q5wE',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    })
});

app.controller('AppCtrl', ['$location', '$firebaseObject', '$scope', '$mdSidenav', function ($location, $firebaseObject, $scope, $mdSidenav) {
    var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.disasters = $firebaseObject(ref);
    $scope.map = {center: {latitude: -32.816215, longitude: 143.755160}, zoom: 4};
    $scope.go = function (path) {
        $location.path(path);
    };
    $scope.nonEmpty = function (object) {
        if (!object) return false;
        return Object.keys(object).length > 0
    };
    $scope.sizeOf = function (object) {
        if (!object) return 0;
        return Object.keys(object).length
    };
}]);

app.controller('MainCtrl', ['$scope', '$firebaseObject', '$route', '$routeParams', '$location',
    function ($scope, $firebaseObject, $route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
    }
]);

app.controller('DisasterCtrl', ['$scope', '$mdDialog', '$firebaseObject', '$route', '$routeParams', '$location',
    function ($scope, $mdDialog, $firebaseObject, $route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        var disasterRef = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $routeParams.disasterId);
        $scope.disaster = $firebaseObject(disasterRef);
        $scope.volunteers = 0;
        $scope.disaster.$loaded(function () {
            $scope.volunteers = $scope.$parent.sizeOf($scope.disaster.volunteers);
        });
        $scope.canPush = function () {
            return $scope.$parent.nonEmpty($scope.disaster.volunteers);
        };
        $scope.isCompleted = function () {
            return $scope.disaster && $scope.disaster.completed;
        }
        $scope.reset = function () {
            $scope.disaster.completed = false;
            angular.forEach($scope.disaster.volunteers, function (value) {
                value.message = "";
                value.responseStatus = 0;
            });
            $scope.disaster.$save();
        }
        $scope.complete = function () {
            $scope.disaster.completed = true;
            angular.forEach($scope.disaster.volunteers, function (value) {
                value.message = "Thank you for helping.";
                value.responseStatus = 3;
            });
            $scope.disaster.$save();
        }
        $scope.push = function (ev) {
            var confirm = $mdDialog
                .show({
                    controller: 'RequestDetailsCtrl',
                    templateUrl: 'volunteers-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                })
                .then(function (data) {
                    angular.forEach($scope.disaster.volunteers, function (value) {
                        value.message = data.message;
                        value.responseStatus = data.responseStatus;
                    });
                    $scope.disaster.$save();
                });
        };
    }
]);

app.controller('RequestDetailsCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.data = {
        message: "",
        responseStatus: 0,
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.notNeeded = function() {
        $scope.data.responseStatus = 2;
        $mdDialog.hide($scope.data);
    };
    $scope.needed = function() {
        $scope.data.responseStatus = 1;
        $mdDialog.hide($scope.data);
    };
    $scope.canAnswer = function() {
        return $scope.data.message.length > 0;
    };
}]);

app.controller('RegisterCtrl', function ($scope) {
    var ref = new Firebase("https://we-can-help.firebaseio.com/disasters");
    $scope.reset = function () {
        $scope.disaster = {name: "", where: "", details: "", type: ""};
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
    $scope.canSave = function () {
        return $scope.disaster.name.length > 0 && $scope.disaster.where.length > 0
            && $scope.disaster.details.length > 0 && $scope.disaster.type.length > 0
            && $scope.disasterItems.length > 0;
    };
    $scope.save = function () {
        var newDisasterRef = ref.push($scope.disaster);
        angular.forEach($scope.disasterItems, function (value) {
            delete value['$$hashKey'];
            newDisasterRef.child('resources').push(value);
        });
    };
    $scope.reset();
});
