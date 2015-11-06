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
        templateUrl: '../html/profile.html',
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

app.controller('AppCtrl', function ($scope, $timeout, $state, auth, $ionicModal, $ionicHistory) {
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
    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
    $state.go("app.landing");
  };

  $scope.register = function (user) {
    if (!user || !user.username || !user.password || !user.email) {
      console.log('hit');
      swal({
        title: "Error",
        text: "Email, username, and password are required fields",
        type: 'warning',
        timer: 3000,
        showConfirmButton: true
      });
    } else {

      if (/(\w+\.)*\w+@(\w+\.)+\w+/.test(user.email)) {
        auth.register(user).success(function (data) {
          $scope.doLogin(user);
        }).error(function (err) {
          var error = undefined;
          if (err.errmsg.split(' ')[0] === "E11000") {
            error = "Username or email already exists!";
          }

          swal({
            title: "Error",
            text: error || err,
            type: 'warning',
            timer: 3000,
            showConfirmButton: true
          });
        });
      } else {
        swal({
          title: "Error",
          text: "Please enter a valid email",
          type: 'warning',
          timer: 3000,
          showConfirmButton: true
        });
      }
    }
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function (user) {
    auth.login(user).success(function (data) {
      auth.saveToken(data);
      swal({
        title: "Success!",
        text: "Successfully Authenticated",
        type: "success",
        timer: 1000,
        showConfirmButton: false
      });
      $scope.isLoggedIn = auth.isLoggedIn();
      $scope.closeLogin();

      //redirect to the profile page after login form is closed
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });

      $state.go("app.profile");
    }).error(function (err) {
      swal({
        title: "Error",
        text: err,
        type: 'warning',
        timer: 3000,
        showConfirmButton: true
      });
    });
  };
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('LandingCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('MapCtrl', function ($scope, $ionicLoading, $compile, landmark, $ionicModal) {
  $scope.$on('$ionicView.enter', function () {
    initialize();
  });
  function initialize() {
    $scope.locations = [];
    var locationCoords = [];
    var markers = [];
    var inProcess = false;
    var isMiles = true;
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
      calcRadius(center, bounds);
      getLandmarks();
    }

    function haversineDistance(coords1, coords2, isMiles) {
      function toRad(x) {
        return x * Math.PI / 180;
      }

      var lat1 = parseFloat(coords1[0]);
      var lon1 = parseFloat(coords1[1]);

      var lat2 = parseFloat(coords2[0]);
      var lon2 = parseFloat(coords2[1]);

      var R = 6371; // km

      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      if (isMiles) d /= 1.60934;

      return d;
    }

    function boundsAndCenter(landmarksMap) {
      var boundsObj = landmarksMap.getBounds();
      var sw = boundsObj.getSouthWest().toString();
      var ne = boundsObj.getNorthEast().toString();
      bounds = { NE: ne, SW: sw };
      center = landmarksMap.getCenter().toString();
    }

    function calcRadius(center, bounds) {
      var centerCoord = formatCoord(center);
      var neBounds = formatCoord(bounds.NE);
      radius = haversineDistance(centerCoord, neBounds, isMiles);
      console.log("radius: ", radius);
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
            collectMarkers();
            setTimeout(function () {
              popMarkers();
            }, 2000);
            inProcess = false;
          }
        });
      }).error(function (err) {
        console.log(err);
      });
    }

    function landmarkFromCenter(location) {
      var centerCoord = formatCoord(center);
      var landmarkCoords = [location.coords.lat, location.coords.lng];
      var distance = haversineDistance(landmarkCoords, centerCoord, isMiles);
      if (distance < radius) {
        $scope.locations.push(location);
      }
    }

    function collectMarkers() {
      var landmarks = $scope.locations;
      console.log("locations: ", landmarks);
      var marker;

      for (var i = 0; i < landmarks.length; i++) {
        marker = new google.maps.Marker({
          map: landmarksMap,
          position: new google.maps.LatLng(landmarks[i].coords.lat, landmarks[i].coords.lng),
          title: landmarks[i].name
        });
        marker.addListener('click', function () {
          toggleInfoWindow(this);
        });
        markers.push(marker);
      }
    }

    function toggleInfoWindow(marker) {
      var contentString = '<p id="firstHeading" class="firstHeading">' + marker.title + '</p>';
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      infowindow.open(landmarksMap, marker);
    }

    function popMarkers() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(landmarksMap);
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
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: styles
      };

      landmarksMap = new google.maps.Map(document.getElementById("map"), mapOptions);

      landmarksMap.addListener('zoom_changed', function () {
        setTimeout(function () {
          readjustView();
        }, 500);
      });

      landmarksMap.addListener('idle', function () {
        setTimeout(function () {
          readjustView();
        }, 500);
      });

      google.maps.event.addListenerOnce(landmarksMap, 'idle', function () {
        setTimeout(function () {
          readjustView();
        }, 500);
      });

      callback();
    }], function (err) {
      if (err) {
        alert(err);
      }
      $scope.map = landmarksMap;
    });
  }

  $ionicModal.fromTemplateUrl('html/landmark.html', {
    scope: $scope
  }).then(function (landmarkModal) {
    $scope.landmarkModal = landmarkModal;
  });

  $scope.closeLandmark = function () {
    $scope.landmarkModal.hide();
  };

  $scope.showLandmark = function (displayLandmark) {
    $scope.displayLandmark = displayLandmark;
    $scope.landmarkModal.show();
  };

  $scope.addToVisited = function (displayLandmark) {
    landmark.addToVisited(displayLandmark._id)['catch'](function (err) {
      console.log(err);
    }).then(function (user) {
      console.log(user);
    });
  };
});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistCtrl', function ($scope, $stateParams) {});
'use strict';

var app = angular.module('landmarksApp');

app.controller('PlaylistsCtrl', function ($scope) {});

// .controller('PlaylistsCtrl', function($scope) {
//   $scope.locations = [
//     { name: 'Mission San Jose', id: 1 },
//     { name: 'Rancho Higuera Historical Park', id: 2 },
//     { name: 'Centerville Pioneer Cemetery', id: 3 },
//     { name: 'Leland Stanford Winery', id: 4 },
//     { name: 'Ardenwood Historic Farm', id: 5 },
//     { name: 'Shinn Historic Park & Arboretum', id: 6 }
//   ];
// })
//
// .controller('PlaylistCtrl', function($scope, $stateParams) {
//
// });
'use strict';

var app = angular.module('landmarksApp');

app.controller('ProfileCtrl', function ($scope, auth, $http, $state) {
  $scope.$on('$ionicView.enter', function () {
    initialize();
  });
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
    return $http.get('/users/me');
  };

  return auth;
});
'use strict';

var app = angular.module('landmarksApp');

app.factory('landmark', function ($window, $http, auth) {
  var landmark = {};

  landmark.getAll = function () {
    return $http.get('/landmarks');
  };

  landmark.getOne = function (id) {
    return $http.get('/landmarks/' + id);
  };

  landmark.addToVisited = function (id) {
    console.log('hit');
    $http.defaults.headers.common.Authorization = 'Bearer ' + auth.getToken();
    return $http.post('/users/visited/' + id);
  };

  return landmark;
});