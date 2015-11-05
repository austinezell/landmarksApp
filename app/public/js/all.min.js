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
  }).state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: '../html/search.html'
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
    console.log("register");
    auth.register(user).success(function (data) {
      $scope.doLogin(user);
      $scope.isLoggedIn = auth.isLoggedIn();
    }).error(function (err) {
      console.log(err);
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (user) {
    console.log("login");
    auth.login(user).success(function (data) {
      swal({ title: "Success!", text: "Successfully Authenticated", type: "success", timer: 1000, showConfirmButton: false });
      $scope.isLoggedIn = auth.isLoggedIn();
    }).error(function (err) {
      console.log(err);
    });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeLogin();
    }, 1000);
  };
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('LandingCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('MapCtrl', function ($scope, $ionicLoading, $compile, landmark) {
  $scope.$on('$ionicView.enter', function () {
    initialize();
  });
  function initialize() {
    $scope.locations = [];
    var locationCoords = [];
    var inProcess = false;
    var landmarksMap;
    var myLatlng;
    var bounds;
    var center;
    var radius;
    var styles = [{
      featureType: 'road',
      elementType: 'labels',
      stylers: [{ saturation: -100 }, { invert_lightness: true }]
    }, {
      "featureType": "landscape",
      "stylers": [{ "weight": 0.1 }, { "saturation": 58 }, { "color": "#FBF8E7" }]
    }];

    function readjustView() {
      if (inProcess) {
        return;
      }
      inProcess = true;
      boundsAndCenter(landmarksMap);
      calcArea(center, bounds);
      getLandmarks();
      console.log("center: ", center);
    }

    function boundsAndCenter(landmarksMap) {
      var boundsObj = landmarksMap.getBounds();
      console.log(boundsObj);
      var sw = boundsObj.getSouthWest().toString();
      var ne = boundsObj.getNorthEast().toString();

      bounds = { NE: ne, SW: sw };
      center = landmarksMap.getCenter().toString();
    }

    function calcArea(center, bounds) {
      var neBounds = formatCoord(bounds.NE);
      var swBounds = formatCoord(bounds.SW);
      console.log("swBounds: ", swBounds);
      console.log("neBounds: ", neBounds);
      var distanceEq = Math.pow(parseFloat(swBounds[0]) - parseFloat(neBounds[0]), 2) + Math.pow(parseInt(swBounds[1]) - parseInt(neBounds[1]), 2);
      var distance = Math.sqrt(distanceEq);
      radius = distance / 2;
      console.log("radius", radius);
    }

    function formatCoord(coord) {
      return coord.split("").filter(function (el) {
        return el.match(/[\d|,|\.|\-]/g);
      }).join("").split(",");
    }

    function getLandmarks() {
      $scope.locations = [];
      var counter = 0;
      landmark.getAll().success(function (locations) {
        locations.forEach(function (location) {
          counter++;
          landmarkFromCenter(location);
          if (counter === locations.length) {
            showLocationMarkers();
            inProcess = false;
          }
        });
      }).error(function (err) {
        console.log(err);
      });
    }

    function landmarkFromCenter(location) {
      var centerCoord = formatCoord(center);
      var distanceEq = Math.pow(parseFloat(location.coords.lat) - parseFloat(centerCoord[0]), 2) + Math.pow(parseInt(location.coords.lng) - parseInt(centerCoord[1]), 2);
      var distance = Math.sqrt(distanceEq);
      console.log("distance: ", distance, " radius: ", radius);
      if (distance < radius) {
        $scope.locations.push(location);
      }
    }

    function showLocationMarkers() {
      var landmarks = $scope.locations;
      console.log("locations: ", landmarks);
      // var newLandmark = new google.maps.LatLng(landmarkCoord.lat, (landmarkCoord.lng * -1));
      //
      var marker;

      for (var i = 0; i < landmarks.length; i++) {
        marker = new google.maps.Marker({
          map: landmarksMap,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(landmarks[i].coords.lat, landmarks[i].coords.lng)
        });

        marker.addListener('click', toggleBounce);
        marker.setMap(landmarksMap);
      }

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    }

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
      var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styles
      };

      landmarksMap = new google.maps.Map(document.getElementById("map"), mapOptions);

      landmarksMap.addListener('zoom_changed', function () {
        setTimeout(function () {
          readjustView();
        }, 1000);
      });

      landmarksMap.addListener('dragend', function () {
        setTimeout(function () {
          readjustView();
        }, 1000);
      });

      google.maps.event.addListenerOnce(landmarksMap, 'idle', function () {
        setTimeout(function () {
          readjustView();
        }, 1000);
      });

      callback();
    }], function (err) {
      if (err) {
        alert(err);
      }
      $scope.map = landmarksMap;
    });
  }
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistsCtrl', function ($scope) {});
'use strict';

var app = angular.module('landmarksApp');

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
      auth.saveToken(data);
    });
  };

  auth.login = function (user) {
    return $http.post('/users/login', user).success(function (data) {
      auth.saveToken(data);
    });
  };

  auth.logout = function () {
    $window.localStorage.removeItem(tokenStorageKey);
  };

  return auth;
});
'use strict';

var app = angular.module('landmarksApp');

app.factory('landmark', function ($window, $http) {
  var landmark = {};

  landmark.getAll = function () {
    return $http.get('/landmarks');
  };

  return landmark;
});