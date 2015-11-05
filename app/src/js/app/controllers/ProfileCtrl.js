var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function($scope, auth, $http, $state) {
  // console.log(!auth.isLoggedIn);
  // if(!auth.isLoggedIn()) {
  //   $state.go('app.landing')
  //   console.log('hey');
  // } else {
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
