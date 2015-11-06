var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function($scope, auth, $http, $state) {
  $scope.$on('$ionicView.enter', function() {
    initialize();
  });
  $scope.getCurrentUserInfo = () => {
    auth.getCurrentUserInfo()
    .success( data => {
      console.log(data);
      $scope.user = data;
    })
    .error( err => {
      console.log(err);
    })
  };
  $scope.getCurrentUserInfo();


});
