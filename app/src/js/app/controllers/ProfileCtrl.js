var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function($scope, auth) {
  console.log("Profile contrler.");
  $scope.getCurrentUserInfo = () => {
    auth.getCurrentUserInfo()
    .success( data => {
        console.log(data);
        $scope.user = data;
    })
    .error( err => {
      console.log(err)
    }

    )
  };

  $scope.getCurrentUserInfo();
});


