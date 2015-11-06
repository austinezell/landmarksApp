var app = angular.module('landmarksApp');

<<<<<<< HEAD
app.controller('AppCtrl', function($scope, $timeout, $state, auth,  $ionicModal, $ionicHistory) {
=======
app.controller('AppCtrl', function($scope, $ionicModal, $timeout, auth, $rootScope, $location) {
>>>>>>> 3900071c9ae10ddcdd8d73d90fee8e5c7e6ae89e
  $scope.Login = true;
  $scope.isLoggedIn = auth.isLoggedIn();

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  ($scope.registerState = function() {
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
    $rootScope.user = null;
    $scope.isLoggedIn = auth.isLoggedIn();
<<<<<<< HEAD
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go("app.landing");
=======
    $location.path("/home");
>>>>>>> 3900071c9ae10ddcdd8d73d90fee8e5c7e6ae89e
  };

  $scope.register = function(user) {
    if (!user || !user.username || !user.password || !user.email) {
      swal({
        title: "Error",
        text: "Email, username, and password are required fields",
        type: 'warning',
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: true,
        closeOnCancel: true
      })
    } else if (/(\w+\.)*\w+@(\w+\.)+\w+/.test(user.email)) {
      auth.register(user)
      .success(function(data) {
        $scope.doLogin(user);
      })
      .error(function(err) {
        let error;
        if (err.errmsg.split(' ')[0] === "E11000") {
          error = "Username or email already exists!"
        }
        swal({
          title: "Error",
          text: (error || err),
          type: 'warning',
          timer: 3000,
          showCancelButton: true
        })
      })
    } else {
      swal({
        title: "Error",
        text: "Please enter a valid email",
        type: 'warning',
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: true,
        closeOnCancel: true
      })
    }
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(user) {
    auth.login(user)
    .success(function(data) {
      auth.saveToken(data);
      auth.getCurrentUserInfo();
      swal({
        title: "Success!",
        text: "Successfully Authenticated",
        type: "success",
        timer: 1000,
        showConfirmButton: false
      });
      $scope.isLoggedIn = auth.isLoggedIn();
<<<<<<< HEAD
        $scope.closeLogin();

        //redirect to the profile page after login form is closed
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });

        $state.go("app.profile");

      })
=======
      $scope.closeLogin();
    })
>>>>>>> 3900071c9ae10ddcdd8d73d90fee8e5c7e6ae89e
    .error(function(err) {
      swal({
        title: "Error",
        text: err,
        type: 'warning',
        timer: 3000,
        showConfirmButton: false,
        showCancelButton: true,
        closeOnCancel: true
      })
    })
  };

});
