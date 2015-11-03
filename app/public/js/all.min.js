// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

var app = angular.module('landmarksApp', ['ionic']);

app.constant('tokenStorageKey', 'my-token');

app.run(function ($ionicPlatform) {
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
});

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: '../html/menu.html',
    controller: 'AppCtrl'
  }).state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: "../html/profile.html",
        controller: 'ProfileCtrl'
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
  }).state('app.landing', {
    url: '/landing',
    views: {
      'menuContent': {
        templateUrl: "../html/landing.html",
        controller: 'LandingCtrl'
      }
    }
  }).state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: "../html/map.html",
        controller: 'MapCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/landing');
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, auth) {
  $scope.Login = true;
  $scope.isLoggedIn = auth.isLoggedIn();

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal

  ($scope.registerState = function () {
    $scope.Login = !$scope.Login;
    $scope.Login ? $scope.state = "Login" : $scope.state = "Create Account";
    $scope.Login ? $scope.stateSwitch = "Create Account" : $scope.stateSwitch = "Login";
    $scope.Login ? $scope.stateMessage = "Do you need an Account?" : $scope.stateMessage = "Go to login";
  })();

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
    $scope.modal.show();
  };

  $scope.logout = function () {
    auth.logout();
    $scope.isLoggedIn = auth.isLoggedIn();
  };

  $scope.register = function (user) {
    if (/(\w+\.)*\w+@(\w+\.)+\w+/.test(user.email)) {
      auth.register(user).success(function (data) {
        $scope.doLogin(user);
      }).error(function (err) {
        var error = undefined;
        if (err.errmsg.split(' ')[0] === "E11000") {
          error = "Username or email already exists!";
        }
        swal({ title: "Error", text: error, type: 'warning', timer: 1200, showConfirmButton: true });
      });
    } else {
      swal({ title: "Error", text: "Please enter a valid email", type: 'warning', timer: 2000, showConfirmButton: true });
    }
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (user) {
    auth.login(user).success(function (data) {
      auth.saveToken(data);
      swal({ title: "Success!", text: "Successfully Authenticated", type: "success", timer: 1000, showConfirmButton: false });
      $scope.isLoggedIn = auth.isLoggedIn();
      $scope.closeLogin();
    }).error(function (err) {
      swal({ title: "Error", text: err, type: 'warning', timer: 1200, showConfirmButton: true });
    });
  };
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('LandingCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('MapCtrl', function ($scope, $ionicLoading, $compile) {
  $scope.$on('$ionicView.enter', function () {
    $scope.locations = [{ name: 'Mission San Jose', id: 1 }, { name: 'Rancho Higuera Historical Park', id: 2 }, { name: 'Centerville Pioneer Cemetery', id: 3 }, { name: 'Leland Stanford Winery', id: 4 }, { name: 'Ardenwood Historic Farm', id: 5 }, { name: 'Shinn Historic Park & Arboretum', id: 6 }];
    initialize();
  });
  function initialize() {

    var myLatlng;

    async.series([function (callback) {
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log(pos);
        myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.loading.hide();
        callback();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
        callback(error);
      });
    }, function (callback) {
      console.log(myLatlng);
      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      callback();
    }], function (err) {
      if (err) {
        alert(err);
      }
      $scope.map = map;
    });

    //Marker + infowindow + angularjs compiled ng-click
    // var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    // var compiled = $compile(contentString)($scope);
    //
    // var infowindow = new google.maps.InfoWindow({
    //   content: compiled[0]
    // });
    //
    // var marker = new google.maps.Marker({
    //   position: myLatlng,
    //   map: map,
    //   title: 'Uluru (Ayers Rock)'
    // });
    //
    // google.maps.event.addListener(marker, 'click', function() {
    //   infowindow.open(map,marker);
    // });

    $scope.map = map;
  }
  // google.maps.event.addDomListener(window, 'load', initialize);

  function centerOnMe() {
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.clickTest = function () {
    alert('Example of infowindow with ng-click');
  };
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistsCtrl', function ($scope) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function ($scope, auth) {
  console.log("Profile contrler.");
  $scope.getCurrentUserInfo = function () {
    auth.getCurrentUserInfo().success(function (data) {
      console.log(data);
      $scope.user = data;
    }).error(function (err) {
      console.log(err);
    });
  };

  $scope.getCurrentUserInfo();
});
'use strict';

var app = angular.module('landmarksApp');

app.factory('auth', function ($window, $http, tokenStorageKey) {
  var auth = {};

  auth.saveToken = function (token) {
    console.log('hit', token);
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
      console.log("Is logged in!");
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return { id: payload._id, username: payload.username };
    }
  };

  auth.register = function (user) {
    return $http.post('/users/register', user);
  };

  auth.login = function (user) {
    return $http.post('/users/login', user);
  };

  auth.logout = function () {
    $window.localStorage.removeItem(tokenStorageKey);
  };

  auth.getCurrentUserInfo = function () {
    $http.defaults.headers.common.Authorization = 'Bearer ' + auth.getToken();
    var user = auth.currentUser();
    console.log(user);
    return $http.get('/users/me/' + user.id);
  };

  return auth;
});