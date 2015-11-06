var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function($scope, auth, $state) {
  auth.getCurrentUserInfo();
});
