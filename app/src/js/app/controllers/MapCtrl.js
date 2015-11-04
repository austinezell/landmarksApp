var app = angular.module('landmarksApp');



app.controller('MapCtrl', function($scope, $ionicLoading, $compile, landmark) {
  $scope.$on('$ionicView.enter', function() {
    initialize();
  });
      function initialize() {
        $scope.locations = [];
        var locationCoords = [];
        var landmarksMap;
        var myLatlng;
        var bounds;
        var center;
        var area;
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

        function boundsAndCenter(landmarksMap){
          var boundsObj = landmarksMap.getBounds();
          console.log(boundsObj);
          var ne = boundsObj.getSouthWest().toString();
          var sw = boundsObj.getNorthEast().toString();

          bounds = {NE: ne, SW: sw};
          center = landmarksMap.getCenter().toString();
        }

        function calcArea(center, bounds){
          var neBounds = formatCoord(bounds.NE);
          var swBounds = formatCoord(bounds.SW);
          var distanceEq = Math.pow((parseFloat(swBounds[0]) - parseFloat(neBounds[0])), 2) + Math.pow((parseInt(swBounds[1]) - parseInt(neBounds[1])), 2);
          var distance = Math.sqrt(distanceEq);
          var radius = distance/2;
          area = (Math.PI * Math.pow(radius, 2));
        }

        function formatCoord(coord){
          return coord.split("").filter(function(el){
            return el.match(/[\d|,|\.]/g);
          }).join("").split(",");
        }

        function getLandmarks(){
          landmark.getAll()
          .success(function(locations){
            locations.forEach(function(location){
              landmarkFromCenter(location);
            })
            showLocationMarkers()
          })
          .error(function(err){
            console.log(err);
          })
        }

        function landmarkFromCenter(location){
          var centerCoord = formatCoord(center);
          var distanceEq = Math.pow((parseFloat(location.coords.lat) - parseFloat(centerCoord[0])), 2) + Math.pow((parseInt(location.coords.lng) - parseInt(centerCoord[1])), 2);
          var distance = Math.sqrt(distanceEq);
          if(distance < area){
            $scope.locations.push(location);
          }
        }

        function showLocationMarkers(){
          var landmarks = $scope.locations;
          console.log(landmarks);
          var newLandmark = new google.maps.LatLng(landmarkCoord.lat, (landmarkCoord.lng * -1));

          var marker = new google.maps.Marker({
             map: landmarksMap,
             draggable: true,
             animation: google.maps.Animation.DROP,
             position: newLandmark
           });

           marker.addListener('click', toggleBounce);

          function toggleBounce() {
           if (marker.getAnimation() !== null) {
             marker.setAnimation(null);
           } else {
             marker.setAnimation(google.maps.Animation.BOUNCE);
           }
          }
          marker.setMap(landmarksMap);
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
              zoom: 16,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: styles
            };

            landmarksMap = new google.maps.Map(document.getElementById("map"),
            mapOptions);

            landmarksMap.addListener('zoom_changed', function() {
              locationCoords = [];
              $scope.locations = [];
              boundsAndCenter(landmarksMap);
              calcArea(center, bounds);
              getLandmarks();
            });

            landmarksMap.addListener('center_changed', function() {
              locationCoords = [];
              $scope.locations = [];
              boundsAndCenter(landmarksMap);
              calcArea(center, bounds);
              getLandmarks()
            });

            google.maps.event.addListenerOnce(landmarksMap, 'idle', function(){
              $scope.locations = [];
              boundsAndCenter(landmarksMap)
              calcArea(center, bounds);
              getLandmarks();
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
    });
