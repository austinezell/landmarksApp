var app = angular.module('landmarksApp')

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth) {
  $scope.Login = true;
  $scope.isLoggedIn = auth.isLoggedIn();

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  ($scope.registerState = function(){
    $scope.Login = !$scope.Login;
    $scope.Login ? $scope.state = "Login" : $scope.state = "Create Account";
    $scope.Login ? $scope.stateSwitch = "Create Account" : $scope.stateSwitch = "Login";
    $scope.Login ? $scope.stateMessage = "Do you need an Account?" : $scope.stateMessage = "Go to login";
  })();

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

  $scope.logout = function() {
    auth.logout();
    $scope.isLoggedIn = false;
  };

  $scope.register = function(user){
    console.log("register");
    auth.register(user)
    .success(function(data){
      $scope.doLogin(user);s
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
      swal({  title: "Success!",   text: "Successfully Authenticated",   type: "success", timer: 1000, showConfirmButton: false });
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
