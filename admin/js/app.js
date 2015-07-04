var app = angular.module('WeCanHelpApp', ['ngMaterial'])

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

}]);

app.controller('SideNavCtrl', function($scope, $mdDialog) {
  $scope.disasters = [
    { name: 'Dereel', type: 'bushfire', active: true },
    { name: 'Wellington', type: 'earthquake', active: false }
  ];
  $scope.actions = [
    { name: 'Register new disaster' }
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
