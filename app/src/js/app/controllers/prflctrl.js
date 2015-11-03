var app = angular.module('landmarksApp')

app.controller('profileCtrl', function($scope, auth) {
  $scope.user =

  $scope.getCurrentUserInfo = () => {
    auth.getCurrentUserInfo()
    .success(data=>{
      console.log(data);
      return data
    })
    .error( error =>{
      
    }

    )
  }
})
