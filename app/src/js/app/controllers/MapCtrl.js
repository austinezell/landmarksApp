var app = angular.module('landmarksApp');



app.controller('MapCtrl', function($scope, $ionicLoading, $compile, landmark, $ionicModal) {
  $scope.$on('$ionicView.enter', function() {
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
    var styles = [
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [
          { saturation: -100 },
          { invert_lightness: true }
        ]
      }, {
        "featureType": "landscape",
        "stylers": [
          { "weight": 0.1 },
          { "saturation": 58 },
          { "color": "#FBF8E7" }
        ]
      }
    ];

    function readjustView(){
      if(inProcess){
        return;
      }
      inProcess = true;
      boundsAndCenter(landmarksMap);
      calcRadius(center, bounds);
      getLandmarks()
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
      var dLon = toRad(x2)
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      if(isMiles) d /= 1.60934;

      return d;
    }

    function boundsAndCenter(landmarksMap){
      var boundsObj = landmarksMap.getBounds();
      var sw = boundsObj.getSouthWest().toString();
      var ne = boundsObj.getNorthEast().toString();
      bounds = {NE: ne, SW: sw};
      center = landmarksMap.getCenter().toString();
    }

    function calcRadius(center, bounds){
      var centerCoord = formatCoord(center);
      var neBounds = formatCoord(bounds.NE);
      radius = haversineDistance(centerCoord, neBounds, isMiles);
      console.log("radius: ", radius);
    }

    function formatCoord(coord){
      return coord.split("").filter(function(el){
        return el.match(/[\d|,|\.|\-]/g);
      }).join("").split(",");
    }

    function getLandmarks(){
      $scope.locations = [];
      var counter = 0;
      landmark.getAll()
      .success(function(locations){
        locations.forEach(function(location){
          counter++;
          landmarkFromCenter(location);
          if(counter === locations.length){
            collectMarkers();
            setTimeout(function(){
              popMarkers();
            }, 2000);
            inProcess = false;
          }
        });
      })
      .error(function(err){
        console.log(err);
      })
    }

    function landmarkFromCenter(location){
      var centerCoord = formatCoord(center);
      var landmarkCoords = [location.coords.lat, location.coords.lng];
      var distance = haversineDistance(landmarkCoords, centerCoord, isMiles);
      if(distance < radius){
        $scope.locations.push(location);
      }
    }

    function collectMarkers(){
      var landmarks = $scope.locations;
      console.log("locations: ", landmarks);
      var marker;

      for(var i = 0; i < landmarks.length; i++){
        marker = new google.maps.Marker({
          map: landmarksMap,
          position: new google.maps.LatLng(landmarks[i].coords.lat, landmarks[i].coords.lng)
        });
        marker.addListener('click', toggleBounce);
        markers.push(marker);
      }
    }

    function popMarkers(){
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(landmarksMap);
      }
    }

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    async.series([
      function(callback){
        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          console.log(pos);
          myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          $scope.loading.hide();
          callback();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
          callback(error);
        });
      },
      function(callback){
        var mapOptions = {
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: styles
        };

        landmarksMap = new google.maps.Map(document.getElementById("map"),
        mapOptions);

        landmarksMap.addListener('zoom_changed', () => {
          setTimeout(function(){
            readjustView();
          }, 500);
        });

        landmarksMap.addListener('idle', () => {
          setTimeout(function(){
            readjustView();
          }, 500);
        });

        google.maps.event.addListenerOnce(landmarksMap, 'idle', () => {
          setTimeout(function(){
            readjustView();
          }, 500);
        });

        callback();
      }
    ], function(err){
      if(err){
        alert(err);
      }
      $scope.map = landmarksMap;
    });
  }
  $ionicModal.fromTemplateUrl('html/landmark.html', {
    scope: $scope
  }).then(function(landmarkModal) {
    $scope.landmarkModal = landmarkModal;
  });

  $scope.closeLandmark = () => {
    $scope.landmarkModal.hide();
  }

  $scope.showLandmark = (landmark) =>{
    $scope.displayLandmark = landmark;
    $scope.landmarkModal.show();
  }
});
