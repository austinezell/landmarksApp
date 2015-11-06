var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function($scope, auth, $ionicModal) {
  auth.getCurrentUserInfo();

  $ionicModal.fromTemplateUrl('html/landmark.html', {
    scope: $scope
  }).then(function(landmarkModal) {
    $scope.landmarkModal = landmarkModal;
  });

  $scope.closeLandmark = () => {
    $scope.landmarkModal.hide();
  }

  $scope.showLandmark = (displayLandmark) =>{
    $scope.displayLandmark = displayLandmark;
    $scope.hideVisitButton = true;
    $scope.landmarkModal.show();
  }

  $scope.addToVisited = (displayLandmark) => {
    landmark.addToVisited(displayLandmark._id)
    .catch(err => {
      console.log(err);
    })
    .then(user => {
      console.log(user);
      swal({
        title: "Success!",
        text: "You've visited " + displayLandmark.name,
        type: "success",
        timer: 2000,
        showConfirmButton: false
      });
      $scope.landmarkModal.hide();
    })
  }




});
