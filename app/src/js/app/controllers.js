angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth) {
  $scope.Login = true;
  $scope.Login ? $scope.state = "Login" : $scope.state = "Create Account";
  $scope.Login ? $scope.stateMessage = "Do you need an Account?" : $scope.stateMessage = "Go to login";
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
    $scope.Login ? $scope.stateMessage = "Do you need an Account?" : $scope.stateMessage = "Go to login";
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
    $scope.modal.show();
  };

  $scope.register = function(user){
    console.log("register");
    auth.register(user)
    .success(function(data){
      $scope.doLogin(user);
      $scope.user = {};
    })
    .error(function(err){
      console.log(err);
    })
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(user) {
    console.log("login");
    auth.login(user)
    .success(function(data){
      console.log(data);
      console.log("ok");
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
  $scope.locations = [
    { name: 'Mission San Jose', id: 1 },
    { name: 'Rancho Higuera Historical Park', id: 2 },
    { name: 'Centerville Pioneer Cemetery', id: 3 },
    { name: 'Leland Stanford Winery', id: 4 },
    { name: 'Ardenwood Historic Farm', id: 5 },
    { name: 'Shinn Historic Park & Arboretum', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

});
