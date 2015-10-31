angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth) {
  $scope.Login = true;
  $scope.stateSwitch = "Create Account";
  $scope.Login ? $scope.state = "Login" : $scope.state = "Create Account";
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  $scope.registerState = function(){
    $scope.Login = !$scope.Login;
    $scope.Login ? $scope.stateSwitch = "Create Account" : $scope.stateSwitch = "Login";
    console.log($scope.Login);
  }


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('html/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    console.log("yes");
    $scope.modal.show();
  };

  $scope.register = function(user){
    auth.register(user)
    .success(function(data){
      console.log(data);
    })
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(user) {
    var loginData = $scope.loginData;
    console.log('Doing login', $scope.loginData);
    auth.login(loginData)
    .success(function(data){
      console.log(data);
    })
    .error(function(err){
      console.log(err);
    })


    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

});
