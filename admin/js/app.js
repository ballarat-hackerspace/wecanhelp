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
    $scope.map = {center: {latitude: -37.816215, longitude: 143.755160}, zoom: 12};
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

app.controller('DisasterCtrl', ['$scope', '$firebaseObject', '$route', '$routeParams', '$location',
    function ($scope, $firebaseObject, $route, $routeParams, $location) {
        this.$route = $route;
        this.$location = $location;
        var disasterRef = new Firebase("https://we-can-help.firebaseio.com/disasters/" + $routeParams.disasterId);
        $scope.disaster = $firebaseObject(disasterRef);
        $scope.hasResources = function () {
            if (!$scope.disaster.resources) return false;
            return Object.keys($scope.disaster.resources).length > 0;
        }
    }
]);

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
        console.log($scope.disaster);
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