// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

angular.module('starter', ['ionic', 'starter.controllers']).constant('tokenStorageKey', 'my-token').run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: '../html/menu.html',
    controller: 'AppCtrl'
  }).state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: '../html/search.html'
      }
    }
  }).state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: '../html/browse.html'
      }
    }
  }).state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: '../html/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  }).state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: '../html/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
'use strict';

var app = angular.module('starter');

app.factory('auth', function ($window, $http, tokenStorageKey) {
  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage[tokenStorageKey] = token;
  };

  auth.getToken = function () {
    return $window.localStorage[tokenStorageKey];
  };

  auth.isLoggedIn = function () {
    var token = auth.getToken();
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.username;
    }
  };

  auth.register = function (user) {
    return $http.post('/users/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.login = function (user) {
    return $http.post('/users/login', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logout = function () {
    $window.localStorage.removeItem(tokenStorageKey);
  };

  return auth;
});
'use strict';

angular.module('starter.controllers', []).controller('AppCtrl', function ($scope, $ionicModal, $timeout, auth) {
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

  $scope.registerState = function () {
    $scope.Login = !$scope.Login;
    $scope.Login ? $scope.stateSwitch = "Create Account" : $scope.stateSwitch = "Login";
    console.log($scope.Login);
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('html/login.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function () {
    console.log("yes");
    $scope.modal.show();
  };

  $scope.register = function (user) {
    auth.register(user).success(function (data) {
      console.log(data);
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (user) {
    var loginData = $scope.loginData;
    console.log('Doing login', $scope.loginData);
    auth.login(loginData).success(function (data) {
      console.log(data);
    }).error(function (err) {
      console.log(err);
    });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeLogin();
    }, 1000);
  };
}).controller('PlaylistsCtrl', function ($scope) {
  $scope.playlists = [{ title: 'Reggae', id: 1 }, { title: 'Chill', id: 2 }, { title: 'Dubstep', id: 3 }, { title: 'Indie', id: 4 }, { title: 'Rap', id: 5 }, { title: 'Cowbell', id: 6 }];
}).controller('PlaylistCtrl', function ($scope, $stateParams) {});